import { getCustomRepository, getManager } from 'typeorm';
import { User } from '../../main/entity/User';
import { UserRepository } from '../../main/repository/UserRepository';
import connection from '../repository/BaseRepositoryTest';
import { Express } from 'express';
import request from 'supertest';
import { UserFactory } from '../factory/UserFactory';
import { connectRedisClient, registerTestApplication } from './BaseController';
import { PromotionFactory } from '../factory/PromotionFactory';
import { DiscountFactory } from '../factory/DiscountFactory';
import { ScheduleFactory } from '../factory/ScheduleFactory';
import { PromotionRepository } from '../../main/repository/PromotionRepository';
import { DiscountType } from '../../main/data/DiscountType';
import { Promotion } from '../../main/entity/Promotion';
import { RedisClient } from 'redis-mock';
import { CachingService } from '../../main/service/CachingService';

describe('Unit tests for PromotionController', function () {
  let userRepository: UserRepository;
  let promotionRepository: PromotionRepository;
  let app: Express;
  let mockRedisClient: RedisClient;
  let cachingService: CachingService;

  beforeAll(async () => {
    await connection.create();
    mockRedisClient = await connectRedisClient();
    cachingService = new CachingService(mockRedisClient);
    app = await registerTestApplication(mockRedisClient);
  });

  afterAll(async () => {
    await connection.close();
    mockRedisClient.quit();
  });

  beforeEach(async () => {
    await connection.clear();
    userRepository = getCustomRepository(UserRepository);
    promotionRepository = getCustomRepository(PromotionRepository);
  });

  test('GET /promotions', async (done) => {
    const user: User = new UserFactory().generate();
    const discount = new DiscountFactory().generate();
    const schedule = new ScheduleFactory().generate();
    const promotion = new PromotionFactory().generate(user, discount, [
      schedule,
    ]);

    await userRepository.save(user);
    await promotionRepository.save(promotion);
    await cacheLatLonForPromotions([promotion]);

    request(app)
      .get('/promotions')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const promotions = res.body;
        expect(promotions).toHaveLength(1);
        comparePromotions(promotions[0], promotion);
        done();
      });
  });

  test('GET /promotions - query parameters without search query', async (done) => {
    const user: User = new UserFactory().generate();

    const promotion1 = new PromotionFactory().generate(
      user,
      new DiscountFactory().generate(DiscountType.PERCENTAGE),
      [new ScheduleFactory().generate()]
    );
    const promotion2 = new PromotionFactory().generate(
      user,
      new DiscountFactory().generate(DiscountType.AMOUNT),
      [new ScheduleFactory().generate()]
    );

    await userRepository.save(user);
    await promotionRepository.save(promotion1);
    await promotionRepository.save(promotion2);

    await cacheLatLonForPromotions([promotion1, promotion2]);

    request(app)
      .get('/promotions')
      .query({
        discountType: DiscountType.PERCENTAGE,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const promotions = res.body;
        expect(promotions).toHaveLength(1);
        comparePromotions(promotions[0], promotion1);
        done();
      });
  });

  test('GET /promotions - query parameters with search query', async (done) => {
    const searchKey = 'buffalo wings '; // purposefully have space after
    const user: User = new UserFactory().generate();

    const promotion1 = new PromotionFactory().generate(
      user,
      new DiscountFactory().generate(DiscountType.PERCENTAGE),
      [new ScheduleFactory().generate()]
    );
    const promotion2 = new PromotionFactory().generate(
      user,
      new DiscountFactory().generate(DiscountType.AMOUNT),
      [new ScheduleFactory().generate()]
    );
    const promotion3 = new PromotionFactory().generate(
      user,
      new DiscountFactory().generate(DiscountType.OTHER),
      [new ScheduleFactory().generate()]
    );

    // guarantee that search results will be hit
    promotion1.name = searchKey;
    promotion2.description = searchKey.repeat(3);
    promotion2.name = searchKey.repeat(3);

    await userRepository.save(user);
    await promotionRepository.save(promotion1);
    await promotionRepository.save(promotion2);
    await promotionRepository.save(promotion3);

    await cacheLatLonForPromotions([promotion1, promotion2, promotion3]);

    request(app)
      .get('/promotions')
      .query({
        searchQuery: searchKey,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const promotions = res.body;
        expect(promotions).toHaveLength(2);

        for (const promotion of promotions) {
          expect(promotion).toHaveProperty('rank');
          expect(promotion).toHaveProperty('boldDescription');
          expect(promotion).toHaveProperty('boldName');
        }
        done();
      });
  });

  test('GET /promotions/:id', async (done) => {
    const user: User = new UserFactory().generate();
    const discount = new DiscountFactory().generate();
    const schedule = new ScheduleFactory().generate();
    const expectedPromotion = new PromotionFactory().generate(user, discount, [
      schedule,
    ]);

    await userRepository.save(user);
    await promotionRepository.save(expectedPromotion);

    await cacheLatLonForPromotions([expectedPromotion]);

    request(app)
      .get(`/promotions/${expectedPromotion.id}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const promotion = res.body;
        comparePromotions(promotion, expectedPromotion);
        done();
      });
  });

  test('POST /promotions', async (done) => {
    const user: User = new UserFactory().generate();
    const expectedPromotion = new PromotionFactory().generate(
      user,
      new DiscountFactory().generate(DiscountType.PERCENTAGE),
      [new ScheduleFactory().generate()]
    );

    await userRepository.save(user);
    request(app)
      .post('/promotions')
      .send({ ...expectedPromotion, user: undefined, userId: user.id })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        const promotion = res.body;
        comparePromotions(promotion, expectedPromotion);
        done();
      });
  });

  test('POST /promotions/ - invalid request body should be caught', async (done) => {
    const user: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generate(
      user,
      new DiscountFactory().generate(DiscountType.PERCENTAGE),
      [new ScheduleFactory().generate()]
    );

    await userRepository.save(user);
    request(app)
      .post('/promotions')
      .send({
        ...promotion,
        user: undefined,
        userId: user.id,
        cuisine: 'nonexistentcuisinetype',
      })
      .expect(400)
      .end((err, res) => {
        const frontEndErrorObject = res.body;
        expect(frontEndErrorObject?.errorCode).toEqual('ValidationError');
        expect(frontEndErrorObject.message).toHaveLength(1);
        expect(frontEndErrorObject.message[0]).toContain(
          '"cuisine" must be one of'
        );
        done();
      });
  });

  test('POST /promotions/ - should not be able to add promotion if lat/lon do not exist', async (done) => {
    const user: User = new UserFactory().generate();
    const expectedPromotion = new PromotionFactory().generate(
      user,
      new DiscountFactory().generate(DiscountType.PERCENTAGE),
      [new ScheduleFactory().generate()]
    );

    delete expectedPromotion.lat;
    delete expectedPromotion.lon;

    await userRepository.save(user);
    request(app)
      .post('/promotions')
      .send({ ...expectedPromotion, user: undefined, userId: user.id })
      .expect(400)
      .end((err, res) => {
        const frontEndErrorObject = res.body;
        expect(frontEndErrorObject?.errorCode).toEqual('ValidationError');
        expect(frontEndErrorObject.message).toHaveLength(2);
        expect(frontEndErrorObject.message[0]).toContain('"lat" is required');
        expect(frontEndErrorObject.message[1]).toContain('"lon" is required');
        done();
      });
  });

  test('POST /promotions/ - should not be able to add promotion if user does not exist', async (done) => {
    const user: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generate(
      user,
      new DiscountFactory().generate(DiscountType.PERCENTAGE),
      [new ScheduleFactory().generate()]
    );

    request(app)
      .post('/promotions')
      .send({
        ...promotion,
        user: undefined,
        userId: '65d7bc0a-6490-4e09-82e0-cb835a64e1b8', // non-existent user UUID
      })
      .expect(400)
      .end((err, res) => {
        const frontEndErrorObject = res.body;
        expect(frontEndErrorObject?.errorCode).toEqual('EntityNotFound');
        expect(frontEndErrorObject.message).toHaveLength(1);
        expect(frontEndErrorObject.message[0]).toContain(
          'Could not find any entity of type "User"'
        );
        done();
      });
  });

  test('DELETE /promotions/:id', async (done) => {
    const user: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generate(
      user,
      new DiscountFactory().generate(DiscountType.PERCENTAGE),
      [new ScheduleFactory().generate()]
    );

    await userRepository.save(user);
    await promotionRepository.save(promotion);
    request(app)
      .delete(`/promotions/${promotion.id}`)
      .expect(204)
      .then(() => {
        return getManager().transaction(
          'READ UNCOMMITTED',
          async (transactionalEntityManager) => {
            // check that promotion no longer exists
            const promotionRepository = transactionalEntityManager.getCustomRepository(
              PromotionRepository
            );
            await expect(
              promotionRepository.findOneOrFail({ id: promotion.id })
            ).rejects.toThrowError();
            done();
          }
        );
      });
  });

  test('DELETE /promotions/:id - deleting non-existent promotion should not fail', async (done) => {
    const nonExistentUUID = '65d7bc0a-6490-4e09-82e0-cb835a64e1b8';
    request(app).delete(`/promotions/${nonExistentUUID}`).expect(204, done);
  });

  test('POST /promotions/:id/upVote', async (done) => {
    const user: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generate(
      user,
      new DiscountFactory().generate(DiscountType.PERCENTAGE),
      [new ScheduleFactory().generate()]
    );

    await userRepository.save(user);
    await promotionRepository.save(promotion);

    request(app)
      .post(`/promotions/${promotion.id}/upVote`)
      .expect(204)
      .then(() => {
        return getManager().transaction(
          'READ UNCOMMITTED',
          async (transactionalEntityManager) => {
            // check that promotion votes has incremented
            const promotionRepository = transactionalEntityManager.getCustomRepository(
              PromotionRepository
            );
            const newPromotion = await promotionRepository.findOneOrFail(
              promotion.id
            );
            expect(newPromotion.votes).toEqual(1);
            done();
          }
        );
      });
  });

  test('POST /promotions/:id/downVote', async (done) => {
    const user: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generate(
      user,
      new DiscountFactory().generate(DiscountType.PERCENTAGE),
      [new ScheduleFactory().generate()]
    );

    await userRepository.save(user);
    await promotionRepository.save(promotion);

    request(app)
      .post(`/promotions/${promotion.id}/downVote`)
      .expect(204)
      .then(() => {
        return getManager().transaction(
          'READ UNCOMMITTED',
          async (transactionalEntityManager) => {
            // check that promotion votes has decremented
            const promotionRepository = transactionalEntityManager.getCustomRepository(
              PromotionRepository
            );
            const newPromotion = await promotionRepository.findOneOrFail(
              promotion.id
            );
            expect(newPromotion.votes).toEqual(-1);
            done();
          }
        );
      });
  });

  async function cacheLatLonForPromotions(promotions: Promotion[]) {
    for (const promotion of promotions) {
      if (promotion.lat && promotion.lon) {
        await cachingService.cacheLatLonValues(
          promotion.placeId,
          promotion.lat,
          promotion.lon
        );
      }
    }
  }

  /**
   * Compare actual promotion against expected promotion
   * */
  function comparePromotions(
    actualPromotion: Promotion,
    expectedPromotion: Promotion
  ) {
    const promotionObject: any = {
      name: expectedPromotion.name,
      description: expectedPromotion.description,
      placeId: expectedPromotion.placeId,
      expirationDate: expectedPromotion.expirationDate.toISOString(),
      startDate: expectedPromotion.startDate.toISOString(),
      lat: expectedPromotion.lat,
      lon: expectedPromotion.lon,
      restaurantAddress: expectedPromotion.restaurantAddress,
      restaurantName: expectedPromotion.restaurantName,
    };

    // since id is undefined in POST requests
    if (!expectedPromotion.id) {
      delete promotionObject.id;
    }

    if (expectedPromotion.dateAdded) {
      promotionObject.dateAdded = expectedPromotion.dateAdded.toISOString();
    }
    expect(actualPromotion).toMatchObject(promotionObject);

    if (expectedPromotion.discount) {
      const discountObject: any = { ...expectedPromotion.discount };

      if (!expectedPromotion.discount.id) {
        delete discountObject.id;
      }
      expect(actualPromotion.discount).toMatchObject(discountObject);
    }

    if (expectedPromotion.schedules && expectedPromotion.schedules.length > 0) {
      const result = [];
      for (const schedule of expectedPromotion.schedules) {
        const scheduleObject: any = { ...schedule };

        // if POST request, id undefined and modify start/end times to format that postgres stores
        if (!schedule.id) {
          delete scheduleObject.id;
          scheduleObject.endTime = schedule.endTime + ':00';
          scheduleObject.startTime = schedule.startTime + ':00';
        }
        result.push(scheduleObject);
      }
      expect(actualPromotion.schedules).toMatchObject(result);
    }
  }
});
