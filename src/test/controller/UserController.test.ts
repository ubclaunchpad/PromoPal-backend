import { getManager, getCustomRepository, EntityManager } from 'typeorm';
import { User } from '../../main/entity/User';
import { UserRepository } from '../../main/repository/UserRepository';
import connection from '../repository/BaseRepositoryTest';
import { Express } from 'express';
import request from 'supertest';
import { UserFactory } from '../factory/UserFactory';
import {
  connectRedisClient,
  registerTestApplication,
  createFirebaseMock,
} from './BaseController';
import { PromotionFactory } from '../factory/PromotionFactory';
import { DiscountFactory } from '../factory/DiscountFactory';
import { ScheduleFactory } from '../factory/ScheduleFactory';
import { PromotionRepository } from '../../main/repository/PromotionRepository';
import { RedisClient } from 'redis-mock';
import * as dotenv from 'dotenv';
import { SavedPromotion } from '../../main/entity/SavedPromotion';
import { Promotion } from '../../main/entity/Promotion';
dotenv.config();

describe('Unit tests for UserController', function () {
  let userRepository: UserRepository;
  let promotionRepository: PromotionRepository;
  let app: Express;
  let redisClient: RedisClient;
  let firebaseAdmin: any;
  const uid = 'test-uid';
  let idToken = '';

  beforeAll(async () => {
    await connection.create();
    redisClient = await connectRedisClient();

    // init mock firebase
    firebaseAdmin = createFirebaseMock();

    app = await registerTestApplication(redisClient, firebaseAdmin);

    firebaseAdmin.autoFlush();

    // create user
    const user = await firebaseAdmin.createUser({
      uid: uid,
      email: 'test@gmail.com',
      password: 'testpassword',
    });
    idToken = await user.getIdToken();
  });

  afterAll(async () => {
    await connection.close();
    redisClient.quit();
  });

  beforeEach(async () => {
    await connection.clear();
    userRepository = getCustomRepository(UserRepository);
    promotionRepository = getCustomRepository(PromotionRepository);
  });

  test('GET /users', async (done) => {
    const expectedUser: User = new UserFactory().generate();
    await userRepository.save(expectedUser);

    request(app)
      .get('/users')
      .set('Authorization', idToken)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const users = res.body;
        // eslint-disable-next-line no-console
        // console.log(users);
        expect(users).toHaveLength(1);
        compareUsers(users[0], expectedUser);
        done();
      });
  });

  test('GET /users - invalid request without idToken on request header', async (done) => {
    const expectedUser: User = new UserFactory().generate();
    await userRepository.save(expectedUser);
    request(app)
      .get('/users')
      .expect(401)
      .end((err, res) => {
        expect(res.status).toEqual(401);
        expect(res.text).toEqual('You are not authorized!');
        done();
      });
  });

  test('GET /users/:id', async (done) => {
    const expectedUser: User = new UserFactory().generate();
    await userRepository.save(expectedUser);
    request(app)
      .get(`/users/${expectedUser.id}`)
      .set('Authorization', idToken)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const user = res.body;
        compareUsers(user, expectedUser);
        done();
      });
  });

  test('POST /users', async (done) => {
    const expectedUser: User = new UserFactory().generate();
    expectedUser.idFirebase = uid;
    const sentObj: any = { ...expectedUser };
    delete sentObj['idFirebase'];
    delete sentObj['id'];
    request(app)
      .post('/users')
      .set('Authorization', idToken)
      .send(sentObj)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        const user = res.body;
        compareUsers(user, expectedUser);
        done();
      });
  });

  test('POST /users/ - invalid request body should be caught', async (done) => {
    const expectedUser: User = new UserFactory().generate();
    request(app)
      .post('/users')
      .set('Authorization', idToken)
      .send({
        ...expectedUser,
        id: undefined, // POST request to users should not contain id
        email: 'invalid email',
        idFirebase: undefined,
      })
      .expect(400)
      .end((err, res) => {
        const frontEndErrorObject = res.body;
        expect(frontEndErrorObject?.errorCode).toEqual('ValidationError');
        expect(frontEndErrorObject.message).toHaveLength(1);
        expect(frontEndErrorObject.message[0]).toEqual(
          '"email" must be a valid email'
        );
        done();
      });
  });

  test('PATCH /users/:id', async (done) => {
    const changedProperties = {
      firstName: 'Diff firstName',
      lastName: 'Diff lastName',
      email: 'Diffemail@gmail.com',
    };
    const expectedUser: User = new UserFactory().generate();
    await userRepository.save(expectedUser);
    request(app)
      .patch(`/users/${expectedUser.id}`)
      .set('Authorization', idToken)
      .send({
        ...changedProperties,
      })
      .expect(204)
      .then(() => {
        // check properties of user have changed
        return getManager().transaction(
          'READ UNCOMMITTED',
          async (transactionalEntityManager) => {
            const userRepository = transactionalEntityManager.getCustomRepository(
              UserRepository
            );
            const user = await userRepository.findOneOrFail({
              id: expectedUser.id,
            });
            expect(user).toMatchObject(changedProperties);
            done();
          }
        );
      });
  });

  test('PATCH /users/:id - invalid request body should be caught', async (done) => {
    const changedProperties = {
      email: 'Invalid email',
    };
    const expectedUser: User = new UserFactory().generate();
    await userRepository.save(expectedUser);
    request(app)
      .patch(`/users/${expectedUser.id}`)
      .set('Authorization', idToken)
      .send({
        ...changedProperties,
      })
      .expect(400)
      .end((err, res) => {
        const frontEndErrorObject = res.body;
        expect(frontEndErrorObject?.errorCode).toEqual('ValidationError');
        expect(frontEndErrorObject.message).toHaveLength(1);
        expect(frontEndErrorObject.message[0]).toEqual(
          '"email" must be a valid email'
        );
        done();
      });
  });

  test('DELETE /users/:id', async (done) => {
    const expectedUser: User = new UserFactory().generate();
    await userRepository.save(expectedUser);
    request(app)
      .delete(`/users/${expectedUser.id}`)
      .set('Authorization', idToken)
      .expect(204)
      .then(() => {
        return getManager().transaction(
          'READ UNCOMMITTED',
          async (transactionalEntityManager) => {
            // check that user no longer exists
            const userRepository = transactionalEntityManager.getCustomRepository(
              UserRepository
            );
            await expect(
              userRepository.findOneOrFail({ id: expectedUser.id })
            ).rejects.toThrowError();
            done();
          }
        );
      });
  });

  test('DELETE /users/:id - delete non-existent user should not fail', async (done) => {
    const nonExistentUUID = '65d7bc0a-6490-4e09-82e0-cb835a64e1b8';
    request(app)
      .delete(`/users/${nonExistentUUID}`)
      .set('Authorization', idToken)
      .expect(204)
      .end(async () => {
        // check that user no longer exists
        await expect(
          userRepository.findOneOrFail({ id: nonExistentUUID })
        ).rejects.toThrowError();
        done();
      });
  });

  xtest('GET /users/:id/savedPromotions', async () => {
    for (let i = 0; i < 100; i++) {
      const expectedUser: User = new UserFactory().generate();
      const promotion = new PromotionFactory().generate(
        expectedUser,
        new DiscountFactory().generate(),
        [new ScheduleFactory().generate()]
      );

      await addSavedPromotion(expectedUser, promotion);

      await request(app)
        .get(`/users/${expectedUser.id}/savedPromotions`)
        .set('Authorization', idToken)
        .expect(200)
        .then((res) => {
          const promotions = res.body;
          expect(promotions).toHaveLength(1);
          expect(promotions[0].id).toEqual(promotion.id);
        });

      await connection.clear();
    }
  });

  test('GET /users/:id/savedPromotions - should return empty list if user has no saved promotions', async (done) => {
    const expectedUser: User = new UserFactory().generate();
    await addSavedPromotion(expectedUser);

    request(app)
      .get(`/users/${expectedUser.id}/savedPromotions`)
      .set('Authorization', idToken)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const promotions = res.body;
        expect(promotions).toHaveLength(0);
        done();
      });
  });

  test('POST /users/:id/savedPromotions/:pid', async (done) => {
    const expectedUser: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generate(
      expectedUser,
      new DiscountFactory().generate(),
      [new ScheduleFactory().generate()]
    );

    await userRepository.save(expectedUser);
    await promotionRepository.save(promotion);

    request(app)
      .post(`/users/${expectedUser.id}/savedPromotions/${promotion.id}`)
      .set('Authorization', idToken)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        const savedPromotion = res.body;
        expect(savedPromotion).toMatchObject({
          userId: expectedUser.id,
          promotionId: promotion.id,
        });
        done();
      });
  });

  test('DELETE /users/:id/savedPromotions/:pid', async (done) => {
    const expectedUser: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generate(
      expectedUser,
      new DiscountFactory().generate(),
      [new ScheduleFactory().generate()]
    );

    await addSavedPromotion(expectedUser, promotion);

    request(app)
      .delete(`/users/${expectedUser.id}/savedPromotions/${promotion.id}`)
      .set('Authorization', idToken)
      .expect(204, done);
  });

  test('DELETE /users/:id/savedPromotions/:pid - should not fail if promotion was never saved by user', async (done) => {
    const expectedUser: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generate(
      expectedUser,
      new DiscountFactory().generate(),
      [new ScheduleFactory().generate()]
    );

    await userRepository.save(expectedUser);
    await promotionRepository.save(promotion);

    request(app)
      .delete(`/users/${expectedUser.id}/savedPromotions/${promotion.id}`)
      .set('Authorization', idToken)
      .expect(204, done);
  });

  test('DELETE /users/:id/savedPromotions/:pid - should not fail if promotion and user do not exist', async (done) => {
    const nonExistentPid = '65d7bc0a-6490-4e09-82e0-cb835a64e1b8';
    const nonExistentUid = '65d7bc0a-6490-4e09-82e0-cb835a64e1b9';

    request(app)
      .delete(`/users/${nonExistentUid}/savedPromotions/${nonExistentPid}`)
      .set('Authorization', idToken)
      .expect(204, done);
  });

  test('GET /users/:id/uploadedPromotions', async (done) => {
    const expectedUser: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generate(
      expectedUser,
      new DiscountFactory().generate(),
      [new ScheduleFactory().generate()]
    );

    await userRepository.save(expectedUser);
    await promotionRepository.save(promotion);

    request(app)
      .get(`/users/${expectedUser.id}/uploadedPromotions`)
      .set('Authorization', idToken)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const user = res.body;
        expect(user).toHaveProperty('uploadedPromotions');
        compareUsers(user, expectedUser);
        expect(user.uploadedPromotions).toHaveLength(1);
        expect(user.uploadedPromotions[0]).toMatchObject({
          id: promotion.id,
          name: promotion.name,
          description: promotion.description,
        });
        done();
      });
  });

  test('GET /users/:id/uploadedPromotions - should return empty list if user has no uploaded promotions', async (done) => {
    const expectedUser: User = new UserFactory().generate();
    await userRepository.save(expectedUser);

    request(app)
      .get(`/users/${expectedUser.id}/uploadedPromotions`)
      .set('Authorization', idToken)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const user = res.body;
        expect(user).toHaveProperty('uploadedPromotions');
        compareUsers(user, expectedUser);
        expect(user.uploadedPromotions).toHaveLength(0);
        done();
      });
  });

  /**
   * Compare actual user against expected user
   * */
  function compareUsers(actualUser: User, expectedUser: User) {
    const expectedObject: any = {
      ...expectedUser,
    };

    if (actualUser.idFirebase) {
      fail('Http request should not return uid of firebase user');
    }
    // since uid of firebase user isn't returned from http requests
    delete expectedObject['idFirebase'];

    // since id is undefined in POST requests
    if (!expectedUser.id) {
      delete expectedObject.id;
    }
    expect(actualUser).toMatchObject(expectedObject);
  }

  /**
   * Save the promotion and user to the database. Also add the saved promotion into the database
   * * Set transaction level to serializable and set lock level to pessimistic write to avoid deadlocks
   * */
  async function addSavedPromotion(user: User, promotion?: Promotion) {
    await getManager().transaction(
      'SERIALIZABLE',
      async (entityManager: EntityManager) => {
        return entityManager
          .createQueryBuilder()
          .setLock('pessimistic_write')
          .insert()
          .into(User)
          .values(user)
          .execute();
      }
    );

    if (promotion) {
      await getManager().transaction(
        'SERIALIZABLE',
        async (entityManager: EntityManager) => {
          return entityManager
            .createQueryBuilder()
            .setLock('pessimistic_write')
            .insert()
            .into(Promotion)
            .values(promotion)
            .execute();
        }
      );

      await getManager().transaction(
        'SERIALIZABLE',
        async (entityManager: EntityManager) => {
          return entityManager
            .createQueryBuilder()
            .setLock('pessimistic_write')
            .insert()
            .into(SavedPromotion)
            .values([
              {
                promotionId: promotion.id,
                userId: user.id,
              },
            ])
            .execute();
        }
      );
    }

    // This is an unfortunate hack...need to invest more time into this
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
});
