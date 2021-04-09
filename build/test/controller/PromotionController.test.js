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
const UserRepository_1 = require("../../main/repository/UserRepository");
const BaseRepositoryTest_1 = __importDefault(require("../repository/BaseRepositoryTest"));
const supertest_1 = __importDefault(require("supertest"));
const UserFactory_1 = require("../factory/UserFactory");
const BaseController_1 = require("./BaseController");
const PromotionFactory_1 = require("../factory/PromotionFactory");
const PromotionRepository_1 = require("../../main/repository/PromotionRepository");
const DiscountType_1 = require("../../main/data/DiscountType");
const VoteRecordRepository_1 = require("../../main/repository/VoteRecordRepository");
const VoteRecord_1 = require("../../main/entity/VoteRecord");
const RestaurantRepository_1 = require("../../main/repository/RestaurantRepository");
const Utility_1 = require("../utility/Utility");
const ResourceCleanupService_1 = require("../../main/service/ResourceCleanupService");
const ErrorMessages_1 = require("../../main/errors/ErrorMessages");
describe('Unit tests for PromotionController', function () {
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
    test('GET /promotions', (done) => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion);
        supertest_1.default(app)
            .get('/promotions')
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            const promotions = res.body;
            expect(promotions).toHaveLength(1);
            comparePromotions(promotions[0], promotion);
            done();
        });
    }));
    test('GET /promotions - query parameters without search query', (done) => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion1 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const promotion2 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        promotion1.discount.discountType = DiscountType_1.DiscountType.PERCENTAGE;
        promotion2.discount.discountType = DiscountType_1.DiscountType.AMOUNT;
        yield userRepository.save(user);
        yield promotionRepository.save(promotion1);
        yield promotionRepository.save(promotion2);
        supertest_1.default(app)
            .get('/promotions')
            .query({
            discountType: DiscountType_1.DiscountType.PERCENTAGE,
        })
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            const promotions = res.body;
            expect(promotions).toHaveLength(1);
            comparePromotions(promotions[0], promotion1);
            done();
        });
    }));
    test('GET /promotions - query parameters with search query', (done) => __awaiter(this, void 0, void 0, function* () {
        const searchKey = 'buffalo wings ';
        const user = new UserFactory_1.UserFactory().generate();
        const promotion1 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const promotion2 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const promotion3 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        promotion1.name = searchKey;
        promotion2.description = searchKey.repeat(3);
        promotion2.name = searchKey.repeat(3);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion1);
        yield promotionRepository.save(promotion2);
        yield promotionRepository.save(promotion3);
        supertest_1.default(app)
            .get('/promotions')
            .query({
            searchQuery: searchKey,
        })
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            const promotions = res.body;
            expect(promotions).toHaveLength(2);
            for (const promotion of promotions) {
                expect(promotion).toHaveProperty('rank');
                expect(promotion).toHaveProperty('boldDescription');
                expect(promotion).toHaveProperty('boldName');
            }
            done();
        });
    }));
    test('GET /promotions/:id', (done) => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const expectedPromotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(expectedPromotion);
        supertest_1.default(app)
            .get(`/promotions/${expectedPromotion.id}`)
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            const promotion = res.body;
            comparePromotions(promotion, expectedPromotion);
            done();
        });
    }));
    test('POST /promotions', (done) => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const expectedPromotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const inputtedPromotion = setAddress(expectedPromotion);
        yield userRepository.save(user);
        supertest_1.default(app)
            .post('/promotions')
            .send(Object.assign(Object.assign({}, inputtedPromotion), { user: undefined, userId: user.id, restaurant: undefined, placeId: expectedPromotion.restaurant.placeId }))
            .expect(201)
            .end((err, res) => {
            if (err)
                return done(err);
            const promotion = res.body;
            expect(promotion.restaurant.lat).toEqual(null);
            expect(promotion.restaurant.lon).toEqual(null);
            comparePromotions(promotion, expectedPromotion);
            done();
        });
    }));
    test('POST /promotions/ - invalid request body should be caught', (done) => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const inputtedPromotion = setAddress(promotion);
        yield userRepository.save(user);
        supertest_1.default(app)
            .post('/promotions')
            .send(Object.assign(Object.assign({}, inputtedPromotion), { user: undefined, userId: user.id, cuisine: 'nonexistentcuisinetype', restaurant: undefined, placeId: promotion.restaurant.placeId }))
            .expect(400)
            .end((err, res) => {
            const frontEndErrorObject = res.body;
            expect(frontEndErrorObject === null || frontEndErrorObject === void 0 ? void 0 : frontEndErrorObject.errorCode).toEqual('ValidationError');
            expect(frontEndErrorObject.message).toHaveLength(1);
            expect(frontEndErrorObject.message[0]).toContain('"cuisine" must be one of');
            done();
        });
    }));
    test('POST /promotions/ - should not be able to add promotion if user does not exist', (done) => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const inputtedPromotion = setAddress(promotion);
        supertest_1.default(app)
            .post('/promotions')
            .send(Object.assign(Object.assign({}, inputtedPromotion), { restaurant: undefined, user: undefined, userId: '65d7bc0a-6490-4e09-82e0-cb835a64e1b8', placeId: promotion.restaurant.placeId }))
            .expect(400)
            .end((err, res) => {
            const frontEndErrorObject = res.body;
            expect(frontEndErrorObject === null || frontEndErrorObject === void 0 ? void 0 : frontEndErrorObject.errorCode).toEqual('EntityNotFound');
            expect(frontEndErrorObject.message).toHaveLength(1);
            expect(frontEndErrorObject.message[0]).toContain('Could not find any entity of type "User"');
            done();
        });
    }));
    test('POST /promotions/ - should not be able to add promotion if address is an empty string', (done) => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const inputtedPromotion = Object.assign(Object.assign({}, promotion), { address: '' });
        yield userRepository.save(user);
        supertest_1.default(app)
            .post('/promotions')
            .send(Object.assign(Object.assign({}, inputtedPromotion), { restaurant: undefined, user: undefined, userId: '65d7bc0a-6490-4e09-82e0-cb835a64e1b8', placeId: promotion.restaurant.placeId }))
            .expect(400)
            .end((err, res) => {
            const frontEndErrorObject = res.body;
            expect(frontEndErrorObject === null || frontEndErrorObject === void 0 ? void 0 : frontEndErrorObject.errorCode).toEqual('ValidationError');
            expect(frontEndErrorObject.message).toHaveLength(1);
            expect(frontEndErrorObject.message[0]).toContain('"address" is not allowed to be empty');
            done();
        });
    }));
    test('POST /promotions/ - if restaurant with same placeId exists in DB, promotion should reference that restaurant', (done) => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const inputtedPromotion = setAddress(promotion);
        const existingPromotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const existingRestaurant = existingPromotion.restaurant;
        yield userRepository.save(user);
        yield promotionRepository.save(existingPromotion);
        supertest_1.default(app)
            .post('/promotions')
            .send(Object.assign(Object.assign({}, inputtedPromotion), { restaurant: undefined, user: undefined, userId: user.id, placeId: existingRestaurant.placeId }))
            .expect(201)
            .end((err, res) => {
            if (err)
                return done(err);
            const promotion = res.body;
            expect(promotion.restaurant).toEqual(existingRestaurant);
            done();
        });
    }));
    test('POST /promotions/ - if restaurant with placeId does not exist in DB, promotion should create new restaurant', (done) => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const inputtedPromotion = setAddress(promotion);
        yield userRepository.save(user);
        supertest_1.default(app)
            .post('/promotions')
            .send(Object.assign(Object.assign({}, inputtedPromotion), { restaurant: undefined, user: undefined, userId: user.id, placeId: promotion.restaurant.placeId }))
            .expect(201)
            .end((err, res) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                return done(err);
            return typeorm_1.getManager().transaction('READ UNCOMMITTED', (transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                const restaurants = yield transactionalEntityManager
                    .getCustomRepository(RestaurantRepository_1.RestaurantRepository)
                    .find();
                expect(restaurants).toHaveLength(1);
                const actualPromotion = res.body;
                expect(actualPromotion.restaurant.lat).toEqual(null);
                expect(actualPromotion.restaurant.lon).toEqual(null);
                comparePromotions(actualPromotion, promotion);
                done();
            }));
        }));
    }));
    test('POST /promotions/ - geocoder should create a new valid restaurant', (done) => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const inputtedPromotion = Object.assign(Object.assign({}, promotion), { address: '780 Bidwell St, Vancouver, BC V6G 2J6' });
        yield userRepository.save(user);
        supertest_1.default(app)
            .post('/promotions')
            .send(Object.assign(Object.assign({}, inputtedPromotion), { restaurant: undefined, user: undefined, userId: user.id, placeId: promotion.restaurant.placeId }))
            .expect(201)
            .end((err, res) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                return done(err);
            return typeorm_1.getManager().transaction('READ UNCOMMITTED', (transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                const restaurants = yield transactionalEntityManager
                    .getCustomRepository(RestaurantRepository_1.RestaurantRepository)
                    .find();
                expect(restaurants).toHaveLength(1);
                const actualPromotion = res.body;
                expect(actualPromotion.restaurant.lat).toEqual(49.2906033);
                expect(actualPromotion.restaurant.lon).toEqual(-123.1333902);
                comparePromotions(actualPromotion, promotion);
                done();
            }));
        }));
    }));
    test('DELETE /promotions/:id', (done) => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        user.firebaseId = baseController.firebaseId;
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion);
        supertest_1.default(app)
            .delete(`/promotions/${promotion.id}`)
            .set('Authorization', baseController.idToken)
            .expect(204)
            .then(() => {
            return typeorm_1.getManager().transaction('READ UNCOMMITTED', (transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                const promotionRepository = transactionalEntityManager.getCustomRepository(PromotionRepository_1.PromotionRepository);
                yield expect(promotionRepository.findOneOrFail({ id: promotion.id })).rejects.toThrowError();
                done();
            }));
        });
    }));
    test('DELETE /promotions/:id - should not be able to delete a promotion that is not uploaded by the user', (done) => __awaiter(this, void 0, void 0, function* () {
        const userWhoUploadedPromotion = new UserFactory_1.UserFactory().generate();
        const userWhoWantsToDeleteAnotherUsersPromotion = new UserFactory_1.UserFactory().generate();
        userWhoWantsToDeleteAnotherUsersPromotion.firebaseId =
            baseController.firebaseId;
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(userWhoUploadedPromotion);
        yield userRepository.save(userWhoWantsToDeleteAnotherUsersPromotion);
        yield userRepository.save(userWhoUploadedPromotion);
        yield promotionRepository.save(promotion);
        supertest_1.default(app)
            .delete(`/promotions/${promotion.id}`)
            .set('Authorization', baseController.idToken)
            .expect(204)
            .end((error, res) => {
            const frontEndErrorObject = res.body;
            expect(frontEndErrorObject === null || frontEndErrorObject === void 0 ? void 0 : frontEndErrorObject.errorCode).toEqual('ForbiddenError');
            expect(frontEndErrorObject.message).toHaveLength(1);
            expect(frontEndErrorObject.message[0]).toEqual(ErrorMessages_1.ErrorMessages.INSUFFICIENT_PRIVILEGES);
            done();
        });
    }));
    test('POST /promotions/:id/upVote', (done) => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion);
        const votingUser = new UserFactory_1.UserFactory().generate();
        yield userRepository.save(votingUser);
        supertest_1.default(app)
            .post(`/promotions/${promotion.id}/upVote`)
            .send({
            uid: votingUser.id,
        })
            .expect(204)
            .then(() => {
            return typeorm_1.getManager().transaction('READ UNCOMMITTED', (transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                const promotionRepository = transactionalEntityManager.getCustomRepository(PromotionRepository_1.PromotionRepository);
                const voteRecordRepository = transactionalEntityManager.getCustomRepository(VoteRecordRepository_1.VoteRecordRepository);
                const newPromotion = yield promotionRepository.findOneOrFail(promotion.id);
                const newVoteRecord = yield voteRecordRepository.findOneOrFail({
                    userId: votingUser.id,
                    promotionId: promotion.id,
                });
                expect(newPromotion.votes).toEqual(1);
                expect(newVoteRecord).toBeDefined();
                expect(newVoteRecord.voteState).toEqual(VoteRecord_1.VoteState.UP);
                done();
            }));
        });
    }));
    test('POST /promotions/:id/downVote', (done) => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion);
        const votingUser = new UserFactory_1.UserFactory().generate();
        yield userRepository.save(votingUser);
        supertest_1.default(app)
            .post(`/promotions/${promotion.id}/downVote`)
            .send({
            uid: votingUser.id,
        })
            .expect(204)
            .then(() => {
            return typeorm_1.getManager().transaction('READ UNCOMMITTED', (transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                const promotionRepository = transactionalEntityManager.getCustomRepository(PromotionRepository_1.PromotionRepository);
                const voteRecordRepository = transactionalEntityManager.getCustomRepository(VoteRecordRepository_1.VoteRecordRepository);
                const newPromotion = yield promotionRepository.findOneOrFail(promotion.id);
                const newVoteRecord = yield voteRecordRepository.findOneOrFail({
                    userId: votingUser.id,
                    promotionId: promotion.id,
                });
                expect(newPromotion.votes).toEqual(-1);
                expect(newVoteRecord).toBeDefined();
                expect(newVoteRecord.voteState).toEqual(VoteRecord_1.VoteState.DOWN);
                done();
            }));
        });
    }));
    test('POST /promotions/:id/upVote - voting to become INIT', (done) => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion);
        const votingUser = new UserFactory_1.UserFactory().generate();
        yield userRepository.save(votingUser);
        yield supertest_1.default(app)
            .post(`/promotions/${promotion.id}/upVote`)
            .send({
            uid: votingUser.id,
        })
            .expect(204);
        supertest_1.default(app)
            .post(`/promotions/${promotion.id}/upVote`)
            .send({
            uid: votingUser.id,
        })
            .expect(204)
            .then(() => {
            return typeorm_1.getManager().transaction('READ UNCOMMITTED', (transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                const promotionRepository = transactionalEntityManager.getCustomRepository(PromotionRepository_1.PromotionRepository);
                const voteRecordRepository = transactionalEntityManager.getCustomRepository(VoteRecordRepository_1.VoteRecordRepository);
                const newPromotion = yield promotionRepository.findOneOrFail(promotion.id);
                const newVoteRecord = yield voteRecordRepository.findOneOrFail({
                    userId: votingUser.id,
                    promotionId: promotion.id,
                });
                expect(newPromotion.votes).toEqual(0);
                expect(newVoteRecord).toBeDefined();
                expect(newVoteRecord.voteState).toEqual(VoteRecord_1.VoteState.INIT);
                done();
            }));
        });
    }));
    test('POST /promotions/:id/downVote - voting to become INIT', (done) => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion);
        const votingUser = new UserFactory_1.UserFactory().generate();
        yield userRepository.save(votingUser);
        yield supertest_1.default(app)
            .post(`/promotions/${promotion.id}/downVote`)
            .send({
            uid: votingUser.id,
        })
            .expect(204);
        supertest_1.default(app)
            .post(`/promotions/${promotion.id}/downVote`)
            .send({
            uid: votingUser.id,
        })
            .expect(204)
            .then(() => {
            return typeorm_1.getManager().transaction('READ UNCOMMITTED', (transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                const promotionRepository = transactionalEntityManager.getCustomRepository(PromotionRepository_1.PromotionRepository);
                const voteRecordRepository = transactionalEntityManager.getCustomRepository(VoteRecordRepository_1.VoteRecordRepository);
                const newPromotion = yield promotionRepository.findOneOrFail(promotion.id);
                const newVoteRecord = yield voteRecordRepository.findOneOrFail({
                    userId: votingUser.id,
                    promotionId: promotion.id,
                });
                expect(newPromotion.votes).toEqual(0);
                expect(newVoteRecord).toBeDefined();
                expect(newVoteRecord.voteState).toEqual(VoteRecord_1.VoteState.INIT);
                done();
            }));
        });
    }));
    test('POST /promotions/:id/upVote - voting to become DOWN from UP', (done) => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion);
        const votingUser = new UserFactory_1.UserFactory().generate();
        yield userRepository.save(votingUser);
        yield supertest_1.default(app)
            .post(`/promotions/${promotion.id}/upVote`)
            .send({
            uid: votingUser.id,
        })
            .expect(204);
        supertest_1.default(app)
            .post(`/promotions/${promotion.id}/downVote`)
            .send({
            uid: votingUser.id,
        })
            .expect(204)
            .then(() => {
            return typeorm_1.getManager().transaction('READ UNCOMMITTED', (transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                const promotionRepository = transactionalEntityManager.getCustomRepository(PromotionRepository_1.PromotionRepository);
                const voteRecordRepository = transactionalEntityManager.getCustomRepository(VoteRecordRepository_1.VoteRecordRepository);
                const newPromotion = yield promotionRepository.findOneOrFail(promotion.id);
                const newVoteRecord = yield voteRecordRepository.findOneOrFail({
                    userId: votingUser.id,
                    promotionId: promotion.id,
                });
                expect(newPromotion.votes).toEqual(-1);
                expect(newVoteRecord).toBeDefined();
                expect(newVoteRecord.voteState).toEqual(VoteRecord_1.VoteState.DOWN);
                done();
            }));
        });
    }));
    test('POST /promotions/:id/downVote - voting to become UP from DOWN', (done) => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion);
        const votingUser = new UserFactory_1.UserFactory().generate();
        yield userRepository.save(votingUser);
        yield supertest_1.default(app)
            .post(`/promotions/${promotion.id}/downVote`)
            .send({
            uid: votingUser.id,
        })
            .expect(204);
        supertest_1.default(app)
            .post(`/promotions/${promotion.id}/upVote`)
            .send({
            uid: votingUser.id,
        })
            .expect(204)
            .then(() => {
            return typeorm_1.getManager().transaction('READ UNCOMMITTED', (transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                const promotionRepository = transactionalEntityManager.getCustomRepository(PromotionRepository_1.PromotionRepository);
                const voteRecordRepository = transactionalEntityManager.getCustomRepository(VoteRecordRepository_1.VoteRecordRepository);
                const newPromotion = yield promotionRepository.findOneOrFail(promotion.id);
                const newVoteRecord = yield voteRecordRepository.findOneOrFail({
                    userId: votingUser.id,
                    promotionId: promotion.id,
                });
                expect(newPromotion.votes).toEqual(1);
                expect(newVoteRecord).toBeDefined();
                expect(newVoteRecord.voteState).toEqual(VoteRecord_1.VoteState.UP);
                done();
            }));
        });
    }));
    test('DELETE /promotions/:id should cleanup external resources of a promotion such as s3 object', (done) => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        user.firebaseId = baseController.firebaseId;
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const expectedObject = '{"hello": false}';
        yield userRepository.save(user);
        yield promotionRepository.save(promotion);
        yield baseController.mockS3
            .putObject({ Key: promotion.id, Body: expectedObject, Bucket: ResourceCleanupService_1.S3_BUCKET })
            .promise();
        const object = yield baseController.mockS3
            .getObject({ Key: promotion.id, Bucket: ResourceCleanupService_1.S3_BUCKET })
            .promise();
        expect(object.Body.toString()).toEqual(expectedObject);
        supertest_1.default(app)
            .delete(`/promotions/${promotion.id}`)
            .set('Authorization', baseController.idToken)
            .expect(204)
            .then(() => __awaiter(this, void 0, void 0, function* () {
            try {
                yield baseController.mockS3
                    .getObject({ Key: promotion.id, Bucket: ResourceCleanupService_1.S3_BUCKET })
                    .promise();
                fail('Should have thrown error');
            }
            catch (e) {
                expect(e.code).toEqual('NoSuchKey');
                done();
            }
        }));
    }));
    function comparePromotions(actualPromotion, expectedPromotion) {
        const promotionObject = {
            name: expectedPromotion.name,
            description: expectedPromotion.description,
            expirationDate: expectedPromotion.expirationDate.toISOString(),
            startDate: expectedPromotion.startDate.toISOString(),
        };
        if (!expectedPromotion.id) {
            delete promotionObject.id;
        }
        if (expectedPromotion.dateAdded) {
            promotionObject.dateAdded = expectedPromotion.dateAdded.toISOString();
        }
        expect(actualPromotion).toMatchObject(promotionObject);
        if (expectedPromotion.discount) {
            const discountObject = Object.assign({}, expectedPromotion.discount);
            if (!expectedPromotion.discount.id) {
                delete discountObject.id;
            }
            expect(actualPromotion.discount).toMatchObject(discountObject);
        }
        if (expectedPromotion.restaurant) {
            const restaurantObject = Object.assign({}, expectedPromotion.restaurant);
            if (!expectedPromotion.restaurant.id) {
                delete restaurantObject.id;
            }
            delete restaurantObject.lat;
            delete restaurantObject.lon;
            expect(actualPromotion.restaurant).toMatchObject(restaurantObject);
        }
        if (expectedPromotion.schedules && expectedPromotion.schedules.length > 0) {
            const result = [];
            for (const schedule of expectedPromotion.schedules) {
                const scheduleObject = Object.assign({}, schedule);
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
    function setAddress(promotion) {
        const result = Object.assign({}, promotion);
        result.address = Utility_1.randomString(30);
        return result;
    }
});
//# sourceMappingURL=PromotionController.test.js.map