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
const CustomAxiosMockAdapter_1 = require("../mock/CustomAxiosMockAdapter");
const RestaurantRepository_1 = require("../../main/repository/RestaurantRepository");
const RestaurantFactory_1 = require("../factory/RestaurantFactory");
const PromotionFactory_1 = require("../factory/PromotionFactory");
const PromotionRepository_1 = require("../../main/repository/PromotionRepository");
describe('Unit tests for RestaurantController', function () {
    let userRepository;
    let restaurantRepository;
    let promotionRepository;
    let app;
    let customAxiosMockAdapter;
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
        restaurantRepository = typeorm_1.getCustomRepository(RestaurantRepository_1.RestaurantRepository);
        promotionRepository = typeorm_1.getCustomRepository(PromotionRepository_1.PromotionRepository);
        customAxiosMockAdapter = new CustomAxiosMockAdapter_1.CustomAxiosMockAdapter(baseController.axiosInstance);
    }));
    test('GET /restaurants/:id/restaurantDetails/', (done) => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const restaurant = new RestaurantFactory_1.RestaurantFactory().generate();
        yield userRepository.save(user);
        yield restaurantRepository.save(restaurant);
        customAxiosMockAdapter.mockSuccessfulPlaceDetails(restaurant.placeId);
        supertest_1.default(app)
            .get(`/restaurants/${restaurant.id}/restaurantDetails`)
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            const restaurantDetails = res.body;
            expect(restaurantDetails.place_id).toEqual(restaurant.placeId);
            expect(restaurantDetails.name).toEqual('MOCK NAME');
            done();
        });
    }));
    test('GET /restaurants/:id/restaurantDetails/ should refresh placeId if not found', (done) => __awaiter(this, void 0, void 0, function* () {
        const expectedRefreshedPlaceId = 'new refreshed placeId';
        const user = new UserFactory_1.UserFactory().generate();
        const restaurant = new RestaurantFactory_1.RestaurantFactory().generate();
        yield userRepository.save(user);
        yield restaurantRepository.save(restaurant);
        customAxiosMockAdapter.mockNotFoundPlaceDetails(restaurant.placeId);
        customAxiosMockAdapter.mockSuccessfulRefreshRequest(restaurant.placeId, expectedRefreshedPlaceId);
        customAxiosMockAdapter.mockSuccessfulPlaceDetails(expectedRefreshedPlaceId);
        supertest_1.default(app)
            .get(`/restaurants/${restaurant.id}/restaurantDetails`)
            .expect(200)
            .end((err, res) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                return done(err);
            const restaurantDetails = res.body;
            expect(restaurantDetails.place_id).toEqual(expectedRefreshedPlaceId);
            expect(restaurantDetails.name).toEqual('MOCK NAME');
            const actualRestaurant = yield restaurantRepository.findOneOrFail(restaurant.id);
            expect(actualRestaurant.placeId).toEqual(expectedRefreshedPlaceId);
            done();
        }));
    }));
    test('GET /restaurants/:id/restaurantDetails/ should not fail if refresh placeId results in not found', (done) => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const restaurant = new RestaurantFactory_1.RestaurantFactory().generate();
        yield userRepository.save(user);
        yield restaurantRepository.save(restaurant);
        customAxiosMockAdapter.mockNotFoundPlaceDetails(restaurant.placeId);
        customAxiosMockAdapter.mockNotFoundRefreshRequest(restaurant.placeId);
        supertest_1.default(app)
            .get(`/restaurants/${restaurant.id}/restaurantDetails`)
            .expect(200)
            .end((err, res) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                return done(err);
            const restaurantDetails = res.body;
            expect(restaurantDetails).toEqual({});
            const actualRestaurant = yield restaurantRepository.findOneOrFail(restaurant.id);
            expect(actualRestaurant.placeId).toEqual('');
            done();
        }));
    }));
    test('GET /restaurants/:id/restaurantDetails/ should return empty object if placeId is empty string', (done) => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const restaurant = new RestaurantFactory_1.RestaurantFactory().generate();
        restaurant.placeId = '';
        yield userRepository.save(user);
        yield restaurantRepository.save(restaurant);
        supertest_1.default(app)
            .get(`/restaurants/${restaurant.id}/restaurantDetails`)
            .expect(200)
            .end((err, res) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                return done(err);
            const restaurantDetails = res.body;
            expect(restaurantDetails).toEqual({});
            done();
        }));
    }));
    test('GET /restaurants/:id/promotions should return all promotions for a specified restaurant', (done) => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const restaurant = new RestaurantFactory_1.RestaurantFactory().generate();
        const promotion1 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const promotion2 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const promotion3 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        promotion1.restaurant = restaurant;
        promotion2.restaurant = restaurant;
        yield userRepository.save(user);
        yield restaurantRepository.save(restaurant);
        yield promotionRepository.save(promotion1);
        yield promotionRepository.save(promotion2);
        yield promotionRepository.save(promotion3);
        const expectedPromotions = [promotion1, promotion2];
        supertest_1.default(app)
            .get(`/restaurants/${restaurant.id}/promotions`)
            .expect(200)
            .end((err, res) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                return done(err);
            const promotions = res.body;
            expect(promotions.length).toEqual(2);
            for (const expectedPromotion of expectedPromotions) {
                const p = promotions.find((promotion) => promotion.id === expectedPromotion.id);
                expect(p.discount).toBeDefined();
                expect(p.schedules).toBeDefined();
                expect(p.restaurant).not.toBeDefined();
            }
            done();
        }));
    }));
});
//# sourceMappingURL=RestaurantController.test.js.map