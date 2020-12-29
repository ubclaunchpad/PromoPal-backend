import { getCustomRepository } from 'typeorm';
import { User } from '../../main/entity/User';
import { UserRepository } from '../../main/repository/UserRepository';
import connection from '../repository/BaseRepositoryTest';
import { Express } from 'express';
import request from 'supertest';
import { UserFactory } from '../factory/UserFactory';
import { registerTestApplication } from './BaseController';
import { PromotionFactory } from '../factory/PromotionFactory';
import { DiscountFactory } from '../factory/DiscountFactory';
import { ScheduleFactory } from '../factory/ScheduleFactory';
import { PromotionRepository } from '../../main/repository/PromotionRepository';
import { SavedPromotionRepository } from '../../main/repository/SavedPromotionRepository';
import { SavedPromotionFactory } from '../factory/SavedPromotionFactory';

describe('Unit tests for UserController', function () {
  let userRepository: UserRepository;
  let promotionRepository: PromotionRepository;
  let savedPromotionRepository: SavedPromotionRepository;
  let app: Express;

  beforeAll(async () => {
    await connection.create();
    app = registerTestApplication();
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await connection.clear();
    userRepository = getCustomRepository(UserRepository);
    promotionRepository = getCustomRepository(PromotionRepository);
    savedPromotionRepository = getCustomRepository(SavedPromotionRepository);
  });

  test('GET /users', async (done) => {
    const expectedUser: User = new UserFactory().generate();
    await userRepository.save(expectedUser);
    request(app)
      .get('/users')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const users = res.body;
        expect(users).toHaveLength(1);
        compareUsers(users[0], expectedUser);
        done();
      });
  });

  test('GET /users/:id', async (done) => {
    const expectedUser: User = new UserFactory().generate();
    await userRepository.save(expectedUser);
    request(app)
      .get(`/users/${expectedUser.id}`)
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
    request(app)
      .post('/users')
      .send(expectedUser)
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
      .send({
        ...expectedUser,
        id: undefined, // POST request to users should not contain id
        email: 'invalid email',
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

  test('PATCH /users/:id', async () => {
    const changedProperties = {
      firstName: 'Diff firstName',
      lastName: 'Diff lastName',
      email: 'Diffemail@gmail.com',
    };
    const expectedUser: User = new UserFactory().generate();
    await userRepository.save(expectedUser);
    await request(app)
      .patch(`/users/${expectedUser.id}`)
      .send({
        ...changedProperties,
      })
      .expect(204);

    // check properties of user have changed
    const user = await userRepository.findOneOrFail({ id: expectedUser.id });
    expect(user).toMatchObject(changedProperties);
  });

  test('PATCH /users/:id - invalid request body should be caught', async (done) => {
    const changedProperties = {
      email: 'Invalid email',
    };
    const expectedUser: User = new UserFactory().generate();
    await userRepository.save(expectedUser);
    request(app)
      .patch(`/users/${expectedUser.id}`)
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

  test('DELETE /users/:id', async () => {
    const expectedUser: User = new UserFactory().generate();
    await userRepository.save(expectedUser);
    await request(app).delete(`/users/${expectedUser.id}`).expect(204);

    // check that user no longer exists
    await expect(
      userRepository.findOneOrFail({ id: expectedUser.id })
    ).rejects.toThrowError();
  });

  test('GET /users/:id/savedPromotions', async (done) => {
    const expectedUser: User = new UserFactory().generate();
    const promotion1 = new PromotionFactory().generate(
      expectedUser,
      new DiscountFactory().generate(),
      [new ScheduleFactory().generate()]
    );
    const promotion2 = new PromotionFactory().generate(
      expectedUser,
      new DiscountFactory().generate(),
      [new ScheduleFactory().generate()]
    );
    const promotion3 = new PromotionFactory().generate(
      expectedUser,
      new DiscountFactory().generate(),
      [new ScheduleFactory().generate()]
    );

    await userRepository.save(expectedUser);
    await promotionRepository.save(promotion1);
    await promotionRepository.save(promotion2);
    await promotionRepository.save(promotion3);

    // create saved promotions
    await savedPromotionRepository.save(
      new SavedPromotionFactory().generate(expectedUser, promotion1)
    );
    await savedPromotionRepository.save(
      new SavedPromotionFactory().generate(expectedUser, promotion2)
    );
    await savedPromotionRepository.save(
      new SavedPromotionFactory().generate(expectedUser, promotion3)
    );

    request(app)
      .get(`/users/${expectedUser.id}/savedPromotions`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const user = res.body;
        expect(user).toHaveProperty('savedPromotions');
        compareUsers(user, expectedUser);
        expect(user.savedPromotions).toHaveLength(3);
        expect(user.savedPromotions[0]).toMatchObject({
          userId: expectedUser.id,
          promotionId: promotion1.id,
          promotion: { id: promotion1.id, name: promotion1.name },
        });
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

  test('DELETE /users/:id/savedPromotions/:pid', async () => {
    const expectedUser: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generate(
      expectedUser,
      new DiscountFactory().generate(),
      [new ScheduleFactory().generate()]
    );
    const savedPromotion = new SavedPromotionFactory().generate(
      expectedUser,
      promotion
    );

    await userRepository.save(expectedUser);
    await promotionRepository.save(promotion);
    await savedPromotionRepository.save(savedPromotion);

    await request(app)
      .delete(`/users/${expectedUser.id}/savedPromotions/${promotion.id}`)
      .expect(204);

    // check that saved promotion no longer exists
    await expect(
      savedPromotionRepository.findOneOrFail({
        userId: expectedUser.id,
        promotionId: promotion.id,
      })
    ).rejects.toThrowError();
  });

  test('GET /users/:id/uploadedPromotions', async (done) => {
    const expectedUser: User = new UserFactory().generate();
    const promotion1 = new PromotionFactory().generate(
      expectedUser,
      new DiscountFactory().generate(),
      [new ScheduleFactory().generate()]
    );
    const promotion2 = new PromotionFactory().generate(
      expectedUser,
      new DiscountFactory().generate(),
      [new ScheduleFactory().generate()]
    );

    await userRepository.save(expectedUser);
    await promotionRepository.save(promotion1);
    await promotionRepository.save(promotion2);

    request(app)
      .get(`/users/${expectedUser.id}/uploadedPromotions`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const user = res.body;
        expect(user).toHaveProperty('uploadedPromotions');
        compareUsers(user, expectedUser);
        expect(user.uploadedPromotions).toHaveLength(2);
        expect(user.uploadedPromotions[0]).toMatchObject({
          id: promotion1.id,
          name: promotion1.name,
          description: promotion1.description,
        });
        done();
      });
  });

  /**
   * Compare actual user against expected user
   * */
  function compareUsers(actualUser: User, expectedUser: User) {
    const expectedObject: any = { ...expectedUser };

    if (actualUser.password) {
      fail('Http request should not return password');
    }
    // since password isn't returned from http requests
    delete expectedObject.password;

    // since id is undefined in POST requests
    if (!expectedUser.id) {
      delete expectedObject.id;
    }

    expect(actualUser).toMatchObject(expectedObject);
  }
});
