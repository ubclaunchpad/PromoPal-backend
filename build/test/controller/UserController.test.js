"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = require("../../main/entity/User");
const UserRepository_1 = require("../../main/repository/UserRepository");
const BaseRepositoryTest_1 = __importDefault(require("../repository/BaseRepositoryTest"));
const supertest_1 = __importDefault(require("supertest"));
const UserFactory_1 = require("../factory/UserFactory");
const BaseController_1 = require("./BaseController");
const PromotionFactory_1 = require("../factory/PromotionFactory");
const PromotionRepository_1 = require("../../main/repository/PromotionRepository");
const SavedPromotion_1 = require("../../main/entity/SavedPromotion");
const Promotion_1 = require("../../main/entity/Promotion");
const Restaurant_1 = require("../../main/entity/Restaurant");
const ResourceCleanupService_1 = require("../../main/service/ResourceCleanupService");
const ErrorMessages_1 = require("../../main/errors/ErrorMessages");
describe('Unit tests for UserController', function () {
    let userRepository;
    let promotionRepository;
    let app;
    let baseController;
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        yield BaseRepositoryTest_1.default.create();
        baseController = new BaseController_1.BaseController();
        app = yield baseController.registerTestApplication();
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        yield BaseRepositoryTest_1.default.close();
        yield baseController.quit();
    }));
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        yield BaseRepositoryTest_1.default.clear();
        userRepository = typeorm_1.getCustomRepository(UserRepository_1.UserRepository);
        promotionRepository = typeorm_1.getCustomRepository(PromotionRepository_1.PromotionRepository);
    }));
    test('GET /users', (done) => __awaiter(this, void 0, void 0, function* () {
        const expectedUser = new UserFactory_1.UserFactory().generate();
        yield userRepository.save(expectedUser);
        supertest_1.default(app)
            .get('/users')
            .set('Authorization', baseController.idToken)
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            const users = res.body;
            expect(users).toHaveLength(1);
            compareUsers(users[0], expectedUser);
            done();
        });
    }));
    test('GET /users - invalid request without idToken on request header', (done) => __awaiter(this, void 0, void 0, function* () {
        const expectedUser = new UserFactory_1.UserFactory().generate();
        yield userRepository.save(expectedUser);
        supertest_1.default(app)
            .get('/users')
            .expect(401)
            .end((err, res) => {
            expect(res.status).toEqual(401);
            expect(res.text).toEqual('You are not authorized!');
            done();
        });
    }));
    test('GET /users/:id', (done) => __awaiter(this, void 0, void 0, function* () {
        const expectedUser = new UserFactory_1.UserFactory().generate();
        yield userRepository.save(expectedUser);
        supertest_1.default(app)
            .get(`/users/${expectedUser.id}`)
            .set('Authorization', baseController.idToken)
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            const user = res.body;
            compareUsers(user, expectedUser);
            done();
        });
    }));
    test('GET /users/firebase/:firebaseId', (done) => __awaiter(this, void 0, void 0, function* () {
        const expectedUser = new UserFactory_1.UserFactory().generate();
        expectedUser.firebaseId = baseController.firebaseId;
        yield userRepository.save(expectedUser);
        supertest_1.default(app)
            .get(`/users/firebase/${expectedUser.firebaseId}`)
            .set('Authorization', baseController.idToken)
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            const user = res.body;
            compareUsers(user, expectedUser);
            done();
        });
    }));
    test('POST /users', (done) => __awaiter(this, void 0, void 0, function* () {
        const expectedUser = new UserFactory_1.UserFactory().generate();
        expectedUser.firebaseId = baseController.firebaseId;
        const sentObj = Object.assign({}, expectedUser);
        delete sentObj['id'];
        supertest_1.default(app)
            .post('/users')
            .set('Authorization', baseController.idToken)
            .send(sentObj)
            .expect(201)
            .end((err, res) => {
            if (err)
                return done(err);
            const user = res.body;
            compareUsers(user, expectedUser);
            done();
        });
    }));
    test('POST /users/ - invalid request body should be caught', (done) => __awaiter(this, void 0, void 0, function* () {
        const expectedUser = new UserFactory_1.UserFactory().generate();
        supertest_1.default(app)
            .post('/users')
            .set('Authorization', baseController.idToken)
            .send(Object.assign(Object.assign({}, expectedUser), { id: undefined, email: 'invalid email' }))
            .expect(400)
            .end((err, res) => {
            const frontEndErrorObject = res.body;
            expect(frontEndErrorObject === null || frontEndErrorObject === void 0 ? void 0 : frontEndErrorObject.errorCode).toEqual('ValidationError');
            expect(frontEndErrorObject.message).toHaveLength(1);
            expect(frontEndErrorObject.message[0]).toEqual('"email" must be a valid email');
            done();
        });
    }));
    test('PATCH /users/:id', (done) => __awaiter(this, void 0, void 0, function* () {
        const changedProperties = {
            firstName: 'Diff firstName',
            lastName: 'Diff lastName',
            email: 'Diffemail@gmail.com',
        };
        const expectedUser = new UserFactory_1.UserFactory().generate();
        yield userRepository.save(expectedUser);
        supertest_1.default(app)
            .patch(`/users/${expectedUser.id}`)
            .set('Authorization', baseController.idToken)
            .send(Object.assign({}, changedProperties))
            .expect(204)
            .then(() => {
            return typeorm_1.getManager().transaction('READ UNCOMMITTED', (transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                const userRepository = transactionalEntityManager.getCustomRepository(UserRepository_1.UserRepository);
                const user = yield userRepository.findOneOrFail({
                    id: expectedUser.id,
                });
                expect(user).toMatchObject(changedProperties);
                done();
            }));
        });
    }));
    test('PATCH /users/:id - invalid request body should be caught', (done) => __awaiter(this, void 0, void 0, function* () {
        const changedProperties = {
            email: 'Invalid email',
        };
        const expectedUser = new UserFactory_1.UserFactory().generate();
        yield userRepository.save(expectedUser);
        supertest_1.default(app)
            .patch(`/users/${expectedUser.id}`)
            .set('Authorization', baseController.idToken)
            .send(Object.assign({}, changedProperties))
            .expect(400)
            .end((err, res) => {
            const frontEndErrorObject = res.body;
            expect(frontEndErrorObject === null || frontEndErrorObject === void 0 ? void 0 : frontEndErrorObject.errorCode).toEqual('ValidationError');
            expect(frontEndErrorObject.message).toHaveLength(1);
            expect(frontEndErrorObject.message[0]).toEqual('"email" must be a valid email');
            done();
        });
    }));
    test('DELETE /users/:id - Should not be able to delete another user', (done) => __awaiter(this, void 0, void 0, function* () {
        const userToDelete = new UserFactory_1.UserFactory().generate();
        userToDelete.firebaseId = 'randomfirebaseId';
        const authenticatedUser = new UserFactory_1.UserFactory().generate();
        authenticatedUser.firebaseId = baseController.firebaseId;
        yield userRepository.save(userToDelete);
        yield userRepository.save(authenticatedUser);
        supertest_1.default(app)
            .delete(`/users/${userToDelete.id}`)
            .set('Authorization', baseController.idToken)
            .expect(403)
            .end((err, res) => {
            const frontEndErrorObject = res.body;
            expect(frontEndErrorObject === null || frontEndErrorObject === void 0 ? void 0 : frontEndErrorObject.errorCode).toEqual('ForbiddenError');
            expect(frontEndErrorObject.message).toHaveLength(1);
            expect(frontEndErrorObject.message[0]).toEqual(ErrorMessages_1.ErrorMessages.INSUFFICIENT_PRIVILEGES);
            done();
        });
    }));
    test('DELETE /users/:id - Authenticated user that does not exist in our DB should not be able to delete another user', (done) => __awaiter(this, void 0, void 0, function* () {
        const userToDelete = new UserFactory_1.UserFactory().generate();
        userToDelete.firebaseId = 'randomfirebaseId';
        yield userRepository.save(userToDelete);
        supertest_1.default(app)
            .delete(`/users/${userToDelete.id}`)
            .set('Authorization', baseController.idToken)
            .expect(404)
            .end((err, res) => {
            const frontEndErrorObject = res.body;
            expect(frontEndErrorObject === null || frontEndErrorObject === void 0 ? void 0 : frontEndErrorObject.errorCode).toEqual('ForbiddenError');
            expect(frontEndErrorObject.message).toHaveLength(1);
            expect(frontEndErrorObject.message[0]).toEqual(ErrorMessages_1.ErrorMessages.INSUFFICIENT_PRIVILEGES);
            done();
        });
    }));
    test('DELETE /users/:id - should be successful', (done) => __awaiter(this, void 0, void 0, function* () {
        const userToDelete = new UserFactory_1.UserFactory().generate();
        userToDelete.firebaseId = baseController.firebaseId;
        yield userRepository.save(userToDelete);
        supertest_1.default(app)
            .delete(`/users/${userToDelete.id}`)
            .set('Authorization', baseController.idToken)
            .expect(204)
            .then(() => {
            return typeorm_1.getManager().transaction('READ UNCOMMITTED', (transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                const userRepository = transactionalEntityManager.getCustomRepository(UserRepository_1.UserRepository);
                yield expect(userRepository.findOneOrFail({ id: userToDelete.id })).rejects.toThrowError();
                done();
            }));
        });
    }));
    test('GET /users/:id/savedPromotions', (done) => __awaiter(this, void 0, void 0, function* () {
        const expectedUser = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(expectedUser);
        yield addSavedPromotion(expectedUser, promotion);
        supertest_1.default(app)
            .get(`/users/${expectedUser.id}/savedPromotions`)
            .set('Authorization', baseController.idToken)
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            const promotions = res.body;
            expect(promotions).toHaveLength(1);
            expect(promotions[0].id).toEqual(promotion.id);
            done();
        });
    }));
    test('GET /users/:id/savedPromotions - should return empty list if user has no saved promotions', (done) => __awaiter(this, void 0, void 0, function* () {
        const expectedUser = new UserFactory_1.UserFactory().generate();
        yield addSavedPromotion(expectedUser);
        supertest_1.default(app)
            .get(`/users/${expectedUser.id}/savedPromotions`)
            .set('Authorization', baseController.idToken)
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            const promotions = res.body;
            expect(promotions).toHaveLength(0);
            done();
        });
    }));
    test('POST /users/:id/savedPromotions/:pid', (done) => __awaiter(this, void 0, void 0, function* () {
        const expectedUser = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(expectedUser);
        yield userRepository.save(expectedUser);
        yield promotionRepository.save(promotion);
        supertest_1.default(app)
            .post(`/users/${expectedUser.id}/savedPromotions/${promotion.id}`)
            .set('Authorization', baseController.idToken)
            .expect(201)
            .end((err, res) => {
            if (err)
                return done(err);
            const savedPromotion = res.body;
            expect(savedPromotion).toMatchObject({
                userId: expectedUser.id,
                promotionId: promotion.id,
            });
            done();
        });
    }));
    test('DELETE /users/:id/savedPromotions/:pid', (done) => __awaiter(this, void 0, void 0, function* () {
        const expectedUser = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(expectedUser);
        yield addSavedPromotion(expectedUser, promotion);
        supertest_1.default(app)
            .delete(`/users/${expectedUser.id}/savedPromotions/${promotion.id}`)
            .set('Authorization', baseController.idToken)
            .expect(204, done);
    }));
    test('DELETE /users/:id/savedPromotions/:pid - should not fail if promotion was never saved by user', (done) => __awaiter(this, void 0, void 0, function* () {
        const expectedUser = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(expectedUser);
        yield userRepository.save(expectedUser);
        yield promotionRepository.save(promotion);
        supertest_1.default(app)
            .delete(`/users/${expectedUser.id}/savedPromotions/${promotion.id}`)
            .set('Authorization', baseController.idToken)
            .expect(204, done);
    }));
    test('Adding a user, promotion, and savedPromotion should not deadlock', () => __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < 10; i++) {
            const expectedUser = new UserFactory_1.UserFactory().generate();
            const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(expectedUser);
            yield addSavedPromotion(expectedUser, promotion);
            yield BaseRepositoryTest_1.default.clear();
        }
    }), 10000);
    test('DELETE /users/:id/savedPromotions/:pid - should not fail if promotion and user do not exist', (done) => __awaiter(this, void 0, void 0, function* () {
        const nonExistentPid = '65d7bc0a-6490-4e09-82e0-cb835a64e1b8';
        const nonExistentUid = '65d7bc0a-6490-4e09-82e0-cb835a64e1b9';
        supertest_1.default(app)
            .delete(`/users/${nonExistentUid}/savedPromotions/${nonExistentPid}`)
            .set('Authorization', baseController.idToken)
            .expect(204, done);
    }));
    test('GET /users/:id/uploadedPromotions', (done) => __awaiter(this, void 0, void 0, function* () {
        const expectedUser = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(expectedUser);
        yield userRepository.save(expectedUser);
        yield promotionRepository.save(promotion);
        supertest_1.default(app)
            .get(`/users/${expectedUser.id}/uploadedPromotions`)
            .set('Authorization', baseController.idToken)
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
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
    }));
    test('GET /users/:id/uploadedPromotions - should return empty list if user has no uploaded promotions', (done) => __awaiter(this, void 0, void 0, function* () {
        const expectedUser = new UserFactory_1.UserFactory().generate();
        yield userRepository.save(expectedUser);
        supertest_1.default(app)
            .get(`/users/${expectedUser.id}/uploadedPromotions`)
            .set('Authorization', baseController.idToken)
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            const user = res.body;
            expect(user).toHaveProperty('uploadedPromotions');
            compareUsers(user, expectedUser);
            expect(user.uploadedPromotions).toHaveLength(0);
            done();
        });
    }));
    test('DELETE /users/:id should cleanup resources of promotions uploaded by the user', (done) => __awaiter(this, void 0, void 0, function* () {
        const expectedUser = new UserFactory_1.UserFactory().generate();
        expectedUser.firebaseId = baseController.firebaseId;
        const promotion1 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(expectedUser);
        const promotion2 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(expectedUser);
        const promotion3 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(expectedUser);
        yield userRepository.save(expectedUser);
        yield promotionRepository.save(promotion1);
        yield promotionRepository.save(promotion2);
        yield promotionRepository.save(promotion3);
        const expectedObject1 = '{"hello": 1}';
        const expectedObject2 = '{"hello": 2}';
        const expectedObject3 = '{"hello": 3}';
        const expectedPromotions = [promotion1, promotion2, promotion3];
        const expectedObjects = [expectedObject1, expectedObject2, expectedObject3];
        for (let i = 0; i < expectedObjects.length; i++) {
            const promotion = expectedPromotions[i];
            const expectedObject = expectedObjects[i];
            yield baseController.mockS3
                .putObject({
                Key: promotion.id,
                Body: expectedObject,
                Bucket: ResourceCleanupService_1.S3_BUCKET,
            })
                .promise();
            const object = yield baseController.mockS3
                .getObject({ Key: promotion.id, Bucket: ResourceCleanupService_1.S3_BUCKET })
                .promise();
            expect(object.Body.toString()).toEqual(expectedObject);
        }
        supertest_1.default(app)
            .delete(`/users/${expectedUser.id}`)
            .set('Authorization', baseController.idToken)
            .expect(204)
            .then(() => __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < expectedObjects.length; i++) {
                try {
                    const promotion = expectedPromotions[i];
                    yield baseController.mockS3
                        .getObject({ Key: promotion.id, Bucket: ResourceCleanupService_1.S3_BUCKET })
                        .promise();
                    fail('Should have thrown error');
                }
                catch (e) {
                    expect(e.code).toEqual('NoSuchKey');
                }
            }
            done();
        }));
    }));
    function compareUsers(actualUser, expectedUser) {
        const expectedObject = Object.assign({}, expectedUser);
        if (actualUser.firebaseId) {
            fail('Http request should not return uid of firebase user');
        }
        delete expectedObject['firebaseId'];
        if (!expectedUser.id) {
            delete expectedObject.id;
        }
        expect(actualUser).toMatchObject(expectedObject);
    }
    function addSavedPromotion(user, promotion) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getManager().transaction('SERIALIZABLE', (entityManager) => __awaiter(this, void 0, void 0, function* () {
                return entityManager
                    .createQueryBuilder()
                    .setLock('pessimistic_write')
                    .insert()
                    .into(User_1.User)
                    .values(user)
                    .execute();
            }));
            if (promotion) {
                yield typeorm_1.getManager().transaction('SERIALIZABLE', (entityManager) => __awaiter(this, void 0, void 0, function* () {
                    return entityManager
                        .createQueryBuilder()
                        .setLock('pessimistic_write')
                        .insert()
                        .into(Restaurant_1.Restaurant)
                        .values(promotion.restaurant)
                        .execute();
                }));
                yield typeorm_1.getManager().transaction('SERIALIZABLE', (entityManager) => __awaiter(this, void 0, void 0, function* () {
                    return entityManager
                        .createQueryBuilder()
                        .setLock('pessimistic_write')
                        .insert()
                        .into(Promotion_1.Promotion)
                        .values(promotion)
                        .execute();
                }));
                yield typeorm_1.getManager().transaction('SERIALIZABLE', (entityManager) => __awaiter(this, void 0, void 0, function* () {
                    return entityManager
                        .createQueryBuilder()
                        .setLock('pessimistic_write')
                        .insert()
                        .into(SavedPromotion_1.SavedPromotion)
                        .values([
                        {
                            promotionId: promotion.id,
                            userId: user.id,
                        },
                    ])
                        .execute();
                }));
            }
            yield new Promise((resolve) => setTimeout(resolve, 500));
        });
    }
});
//# sourceMappingURL=UserController.test.js.map