import { getCustomRepository, getManager } from 'typeorm';
import { User } from '../../main/entity/User';
import { UserRepository } from '../../main/repository/UserRepository';
import connection from '../repository/BaseRepositoryTest';
import { Express } from 'express';
import request from 'supertest';
import { UserFactory } from '../factory/UserFactory';
import { connectRedisClient, registerTestApplication } from './BaseController';
import { PromotionFactory } from '../factory/PromotionFactory';
import { PromotionRepository } from '../../main/repository/PromotionRepository';
import { DiscountType } from '../../main/data/DiscountType';
import { Promotion } from '../../main/entity/Promotion';
import { RedisClient } from 'redis-mock';
import { CustomAxiosMockAdapter } from '../mock/CustomAxiosMockAdapter';
import axios, { AxiosInstance } from 'axios';
import { Place } from '@googlemaps/google-maps-services-js';

describe('Unit tests for PromotionController', function () {
  let userRepository: UserRepository;
  let promotionRepository: PromotionRepository;
  let app: Express;
  let mockRedisClient: RedisClient;
  let customAxiosMockAdapter: CustomAxiosMockAdapter;
  let axiosInstance: AxiosInstance;

  beforeAll(async () => {
    await connection.create();
    mockRedisClient = await connectRedisClient();
    axiosInstance = axios.create();
    app = await registerTestApplication(mockRedisClient, axiosInstance);
  });

  afterAll(async () => {
    await connection.close();
    mockRedisClient.quit();
  });

  beforeEach(async () => {
    await connection.clear();
    userRepository = getCustomRepository(UserRepository);
    promotionRepository = getCustomRepository(PromotionRepository);
    customAxiosMockAdapter = new CustomAxiosMockAdapter(axiosInstance);
  });

  test('GET /promotions', async (done) => {
    const user: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generateWithRelatedEntities(user);

    await userRepository.save(user);
    await promotionRepository.save(promotion);

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

    const promotion1 = new PromotionFactory().generateWithRelatedEntities(user);
    const promotion2 = new PromotionFactory().generateWithRelatedEntities(user);

    promotion1.discount.discountType = DiscountType.PERCENTAGE;
    promotion2.discount.discountType = DiscountType.AMOUNT;

    await userRepository.save(user);
    await promotionRepository.save(promotion1);
    await promotionRepository.save(promotion2);

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

    const promotion1 = new PromotionFactory().generateWithRelatedEntities(user);
    const promotion2 = new PromotionFactory().generateWithRelatedEntities(user);
    const promotion3 = new PromotionFactory().generateWithRelatedEntities(user);

    // guarantee that search results will be hit
    promotion1.name = searchKey;
    promotion2.description = searchKey.repeat(3);
    promotion2.name = searchKey.repeat(3);

    await userRepository.save(user);
    await promotionRepository.save(promotion1);
    await promotionRepository.save(promotion2);
    await promotionRepository.save(promotion3);

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
    const expectedPromotion = new PromotionFactory().generateWithRelatedEntities(
      user
    );

    await userRepository.save(user);
    await promotionRepository.save(expectedPromotion);

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
    const expectedPromotion = new PromotionFactory().generateWithRelatedEntities(
      user
    );

    // todo: https://promopal.atlassian.net/browse/PP-82 uncommented
    // expectedPromotion.restaurant.lat = <insert expected lat>
    // expectedPromotion.restaurant.lon = <insert expected lon>
    // - do same as above for respective tests

    await userRepository.save(user);
    request(app)
      .post('/promotions')
      .send({
        ...expectedPromotion,
        user: undefined,
        userId: user.id,
        restaurant: undefined,
      })
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
    const promotion = new PromotionFactory().generateWithRelatedEntities(user);

    await userRepository.save(user);
    request(app)
      .post('/promotions')
      .send({
        ...promotion,
        user: undefined,
        userId: user.id,
        cuisine: 'nonexistentcuisinetype',
        restaurant: undefined,
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

  test('POST /promotions/ - should not be able to add promotion if user does not exist', async (done) => {
    const user: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generateWithRelatedEntities(user);

    request(app)
      .post('/promotions')
      .send({
        ...promotion,
        restaurant: undefined,
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
    const promotion = new PromotionFactory().generateWithRelatedEntities(user);

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
    const promotion = new PromotionFactory().generateWithRelatedEntities(user);

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
    const promotion = new PromotionFactory().generateWithRelatedEntities(user);

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

  test('GET /promotions/:id/restaurantDetails/', async (done) => {
    const user: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generateWithRelatedEntities(user);

    await userRepository.save(user);
    await promotionRepository.save(promotion);

    customAxiosMockAdapter.mockSuccessfulPlaceDetails(promotion.placeId);

    request(app)
      .get(`/promotions/${promotion.id}/restaurantDetails`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const restaurantDetails = res.body as Place;
        expect(restaurantDetails.place_id).toEqual(promotion.placeId);
        expect(restaurantDetails.name).toEqual('MOCK NAME');
        done();
      });
  });

  test('GET /promotions/:id/restaurantDetails/ should refresh placeId if not found', async (done) => {
    const expectedRefreshedPlaceId = 'new refreshed placeId';
    const user: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generateWithRelatedEntities(user);

    await userRepository.save(user);
    await promotionRepository.save(promotion);

    customAxiosMockAdapter.mockNotFoundPlaceDetails(promotion.placeId);
    customAxiosMockAdapter.mockSuccessfulRefreshRequest(
      promotion.placeId,
      expectedRefreshedPlaceId
    );
    customAxiosMockAdapter.mockSuccessfulPlaceDetails(expectedRefreshedPlaceId);

    request(app)
      .get(`/promotions/${promotion.id}/restaurantDetails`)
      .expect(200)
      .end(async (err, res) => {
        if (err) return done(err);
        // should be able to get promotion details with new placeId
        const restaurantDetails = res.body as Place;
        expect(restaurantDetails.place_id).toEqual(expectedRefreshedPlaceId);
        expect(restaurantDetails.name).toEqual('MOCK NAME');

        // placeId should be updated in the repository
        const actualPromotion = await promotionRepository.findOneOrFail(
          promotion.id
        );
        expect(actualPromotion.placeId).toEqual(expectedRefreshedPlaceId);
        done();
      });
  });

  test('GET /promotions/:id/restaurantDetails/ should not fail if refresh placeId results in not found', async (done) => {
    const user: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generateWithRelatedEntities(user);

    await userRepository.save(user);
    await promotionRepository.save(promotion);

    customAxiosMockAdapter.mockNotFoundPlaceDetails(promotion.placeId);
    // configure so that refresh request results in not found
    customAxiosMockAdapter.mockNotFoundRefreshRequest(promotion.placeId);

    request(app)
      .get(`/promotions/${promotion.id}/restaurantDetails`)
      .expect(200)
      .end(async (err, res) => {
        if (err) return done(err);
        // should be able to get promotion details with new placeId
        const restaurantDetails = res.body as Place;
        expect(restaurantDetails).toEqual({});

        // placeId should be updated in the repository
        const actualPromotion = await promotionRepository.findOneOrFail(
          promotion.id
        );
        expect(actualPromotion.placeId).toEqual('');
        done();
      });
  });

  test('GET /promotions/:id/restaurantDetails/ should return empty object if placeId is empty string', async (done) => {
    const user: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generateWithRelatedEntities(user);
    promotion.placeId = '';

    await userRepository.save(user);
    await promotionRepository.save(promotion);

    request(app)
      .get(`/promotions/${promotion.id}/restaurantDetails`)
      .expect(200)
      .end(async (err, res) => {
        if (err) return done(err);
        // should be able to get promotion details with new placeId
        const restaurantDetails = res.body as Place;
        expect(restaurantDetails).toEqual({});
        done();
      });
  });

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

    // todo: uncomment this once https://promopal.atlassian.net/browse/PP-82 has been implemented
    // if (expectedPromotion.restaurant) {
    //   const restaurantObject: any = { ...expectedPromotion.restaurant };
    //
    //   if (!expectedPromotion.restaurant.id) {
    //     delete restaurantObject.id;
    //   }
    //   expect(actualPromotion.restaurant).toMatchObject(restaurantObject);
    // }

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
