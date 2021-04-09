import { EntityManager, getCustomRepository, getManager } from 'typeorm';
import { User } from '../../main/entity/User';
import { UserRepository } from '../../main/repository/UserRepository';
import connection from '../repository/BaseRepositoryTest';
import { Express } from 'express';
import request from 'supertest';
import { UserFactory } from '../factory/UserFactory';
import { BaseController } from './BaseController';
import { PromotionFactory } from '../factory/PromotionFactory';
import { PromotionRepository } from '../../main/repository/PromotionRepository';
import { SavedPromotion } from '../../main/entity/SavedPromotion';
import { Promotion } from '../../main/entity/Promotion';
import { Restaurant } from '../../main/entity/Restaurant';
import { S3_BUCKET } from '../../main/service/ResourceCleanupService';
import { ErrorMessages } from '../../main/errors/ErrorMessages';
import { UserDTO } from '../../main/validation/UserValidation';
import { randomString } from '../utility/Utility';

describe('Unit tests for UserController', function () {
  let userRepository: UserRepository;
  let promotionRepository: PromotionRepository;
  let app: Express;
  let baseController: BaseController;

  beforeAll(async () => {
    await connection.create();
    baseController = new BaseController();
    app = await baseController.registerTestApplication();
  });

  afterAll(async () => {
    await connection.close();
    await baseController.quit();
  });

  beforeEach(async () => {
    await connection.clear();
    await baseController.createAuthenticatedUser();
    userRepository = getCustomRepository(UserRepository);
    promotionRepository = getCustomRepository(PromotionRepository);
  });

  afterEach(async () => {
    await baseController.deleteAuthenticatedUser();
  });

  test('GET /users', async (done) => {
    request(app)
      .get('/users')
      .set('Authorization', baseController.idToken)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const users = res.body;
        expect(users).toHaveLength(1);
        compareUsers(users[0], baseController.authenticatedUser);
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
      .set('Authorization', baseController.idToken)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const user = res.body;
        compareUsers(user, expectedUser);
        done();
      });
  });

  test('POST /users', async (done) => {
    const userDTO: UserDTO = {
      email: randomString(20) + '@gmail.com',
      password: randomString(20),
      firstName: randomString(20),
      lastName: randomString(20),
      username: randomString(20),
    };
    request(app)
      .post('/users')
      .send(userDTO)
      .expect(201)
      .end(async (err, res) => {
        if (err) return done(err);
        const user = res.body as User;
        expect(user.firstName).toEqual(userDTO.firstName);
        expect(user.lastName).toEqual(userDTO.lastName);
        expect(user.username).toEqual(userDTO.username);

        // firebaseId should be the same as the userId
        const firebaseUser = await baseController.mockFirebaseAdmin.getUser(
          user.id
        );
        expect(firebaseUser).toBeDefined();
        expect(firebaseUser.email).toEqual(userDTO.email);
        done();
      });
  });

  test('POST /users/ - invalid request body should be caught', async (done) => {
    const userDTO: UserDTO = {
      email: 'test@gmail.com',
      firstName: 'test',
      lastName: 'test',
      password: 'test',
      username: 'test',
    };

    request(app)
      .post('/users')
      .send({
        ...userDTO,
        lastName: 1,
      })
      .expect(400)
      .end((err, res) => {
        const frontEndErrorObject = res.body;
        expect(frontEndErrorObject?.errorCode).toEqual('ValidationError');
        expect(frontEndErrorObject.message).toHaveLength(1);
        expect(frontEndErrorObject.message[0]).toEqual(
          '"lastName" must be a string'
        );
        done();
      });
  });

  test('PATCH /users/:id', async (done) => {
    const changedProperties = {
      firstName: 'Diff firstName',
      lastName: 'Diff lastName',
    };
    const expectedUser: User = new UserFactory().generate();
    await userRepository.save(expectedUser);
    request(app)
      .patch(`/users/${expectedUser.id}`)
      .set('Authorization', baseController.idToken)
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
      lastName: 1234,
    };
    const expectedUser: User = new UserFactory().generate();
    await userRepository.save(expectedUser);
    request(app)
      .patch(`/users/${expectedUser.id}`)
      .set('Authorization', baseController.idToken)
      .send({
        ...changedProperties,
      })
      .expect(400)
      .end((err, res) => {
        const frontEndErrorObject = res.body;
        expect(frontEndErrorObject?.errorCode).toEqual('ValidationError');
        expect(frontEndErrorObject.message).toHaveLength(1);
        expect(frontEndErrorObject.message[0]).toEqual(
          '"lastName" must be a string'
        );
        done();
      });
  });

  test('DELETE /users/:id - Should not be able to delete another user', async (done) => {
    const userToDelete: User = new UserFactory().generate();
    await userRepository.save(userToDelete);

    // baseController.authenticatedUser is trying to delete another user
    request(app)
      .delete(`/users/${userToDelete.id}`)
      .set('Authorization', baseController.idToken)
      .expect(403)
      .end((err, res) => {
        const frontEndErrorObject = res.body;
        expect(frontEndErrorObject?.errorCode).toEqual('ForbiddenError');
        expect(frontEndErrorObject.message).toHaveLength(1);
        expect(frontEndErrorObject.message[0]).toEqual(
          ErrorMessages.INSUFFICIENT_PRIVILEGES
        );
        done();
      });
  });

  test('DELETE /users/:id - Authenticated user that does not exist in our DB should not be able to delete another user', async (done) => {
    const userToDelete: User = new UserFactory().generate();
    await userRepository.save(userToDelete);

    request(app)
      .delete(`/users/${userToDelete.id}`)
      .set('Authorization', baseController.idToken)
      .expect(404)
      .end((err, res) => {
        const frontEndErrorObject = res.body;
        expect(frontEndErrorObject?.errorCode).toEqual('ForbiddenError');
        expect(frontEndErrorObject.message).toHaveLength(1);
        expect(frontEndErrorObject.message[0]).toEqual(
          ErrorMessages.INSUFFICIENT_PRIVILEGES
        );
        done();
      });
  });

  test('DELETE /users/:id - should be successful', async (done) => {
    request(app)
      .delete(`/users/${baseController.authenticatedUser.id}`)
      .set('Authorization', baseController.idToken)
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
              userRepository.findOneOrFail({
                id: baseController.authenticatedUser.id,
              })
            ).rejects.toThrowError();
            done();
          }
        );
      });
  });

  test('GET /users/:id/savedPromotions', async (done) => {
    const expectedUser: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generateWithRelatedEntities(
      expectedUser
    );

    await addSavedPromotion(expectedUser, promotion);

    request(app)
      .get(`/users/${expectedUser.id}/savedPromotions`)
      .set('Authorization', baseController.idToken)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const promotions = res.body;
        expect(promotions).toHaveLength(1);
        expect(promotions[0].id).toEqual(promotion.id);
        done();
      });
  });

  test('GET /users/:id/savedPromotions - should return empty list if user has no saved promotions', async (done) => {
    const expectedUser: User = new UserFactory().generate();

    await addSavedPromotion(expectedUser);

    request(app)
      .get(`/users/${expectedUser.id}/savedPromotions`)
      .set('Authorization', baseController.idToken)
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
    const promotion = new PromotionFactory().generateWithRelatedEntities(
      expectedUser
    );

    await userRepository.save(expectedUser);
    await promotionRepository.save(promotion);

    request(app)
      .post(`/users/${expectedUser.id}/savedPromotions/${promotion.id}`)
      .set('Authorization', baseController.idToken)
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
    const promotion = new PromotionFactory().generateWithRelatedEntities(
      expectedUser
    );

    await addSavedPromotion(expectedUser, promotion);

    request(app)
      .delete(`/users/${expectedUser.id}/savedPromotions/${promotion.id}`)
      .set('Authorization', baseController.idToken)
      .expect(204, done);
  });

  test('DELETE /users/:id/savedPromotions/:pid - should not fail if promotion was never saved by user', async (done) => {
    const expectedUser: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generateWithRelatedEntities(
      expectedUser
    );

    await userRepository.save(expectedUser);
    await promotionRepository.save(promotion);

    request(app)
      .delete(`/users/${expectedUser.id}/savedPromotions/${promotion.id}`)
      .set('Authorization', baseController.idToken)
      .expect(204, done);
  });

  test('Adding a user, promotion, and savedPromotion should not deadlock', async () => {
    for (let i = 0; i < 10; i++) {
      const expectedUser: User = new UserFactory().generate();
      const promotion = new PromotionFactory().generateWithRelatedEntities(
        expectedUser
      );

      await addSavedPromotion(expectedUser, promotion);
      await connection.clear();
    }
  }, 10000);

  test('DELETE /users/:id/savedPromotions/:pid - should not fail if promotion and user do not exist', async (done) => {
    const nonExistentPid = '65d7bc0a-6490-4e09-82e0-cb835a64e1b8';
    const nonExistentUid = '65d7bc0a-6490-4e09-82e0-cb835a64e1b9';

    request(app)
      .delete(`/users/${nonExistentUid}/savedPromotions/${nonExistentPid}`)
      .set('Authorization', baseController.idToken)
      .expect(204, done);
  });

  test('GET /users/:id/uploadedPromotions', async (done) => {
    const expectedUser: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generateWithRelatedEntities(
      expectedUser
    );

    await userRepository.save(expectedUser);
    await promotionRepository.save(promotion);

    request(app)
      .get(`/users/${expectedUser.id}/uploadedPromotions`)
      .set('Authorization', baseController.idToken)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const promotions = res.body as Promotion[];
        expect(promotions).toHaveLength(1);
        expect(promotions[0]).toMatchObject({
          id: promotion.id,
          name: promotion.name,
          description: promotion.description,
        });
        expect(promotions[0].discount).toBeDefined();
        expect(promotions[0].restaurant).toBeDefined();
        expect(promotions[0].schedules).toBeDefined();
        done();
      });
  });

  test('GET /users/:id/uploadedPromotions - should return empty list if user has no uploaded promotions', async (done) => {
    const expectedUser: User = new UserFactory().generate();
    await userRepository.save(expectedUser);

    request(app)
      .get(`/users/${expectedUser.id}/uploadedPromotions`)
      .set('Authorization', baseController.idToken)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const promotions = res.body as Promotion[];
        expect(promotions).toHaveLength(0);
        done();
      });
  });

  test('DELETE /users/:id should cleanup resources of promotions uploaded by the user', async (done) => {
    const promotion1 = new PromotionFactory().generateWithRelatedEntities(
      baseController.authenticatedUser
    );
    const promotion2 = new PromotionFactory().generateWithRelatedEntities(
      baseController.authenticatedUser
    );
    const promotion3 = new PromotionFactory().generateWithRelatedEntities(
      baseController.authenticatedUser
    );

    await userRepository.save(baseController.authenticatedUser);
    await promotionRepository.save(promotion1);
    await promotionRepository.save(promotion2);
    await promotionRepository.save(promotion3);

    // create s3 objects
    const expectedObject1 = '{"hello": 1}';
    const expectedObject2 = '{"hello": 2}';
    const expectedObject3 = '{"hello": 3}';

    const expectedPromotions = [promotion1, promotion2, promotion3];
    const expectedObjects = [expectedObject1, expectedObject2, expectedObject3];

    for (let i = 0; i < expectedObjects.length; i++) {
      const promotion = expectedPromotions[i];
      const expectedObject = expectedObjects[i];

      // save to mock s3
      await baseController.mockS3
        .putObject({
          Key: promotion.id,
          Body: expectedObject,
          Bucket: S3_BUCKET,
        })
        .promise();
      // check object put correctly
      const object = await baseController.mockS3
        .getObject({ Key: promotion.id, Bucket: S3_BUCKET })
        .promise();
      expect(object.Body!.toString()).toEqual(expectedObject);
    }

    request(app)
      .delete(`/users/${baseController.authenticatedUser.id}`)
      .set('Authorization', baseController.idToken)
      .expect(204)
      .then(async () => {
        for (let i = 0; i < expectedObjects.length; i++) {
          try {
            const promotion = expectedPromotions[i];
            await baseController.mockS3
              .getObject({ Key: promotion.id, Bucket: S3_BUCKET })
              .promise();
            fail('Should have thrown error');
          } catch (e) {
            expect(e.code).toEqual('NoSuchKey');
          }
        }
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
            .into(Restaurant)
            .values(promotion.restaurant)
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
