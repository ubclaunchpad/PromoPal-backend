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
const BaseRepositoryTest_1 = __importDefault(require("./BaseRepositoryTest"));
const PromotionRepository_1 = require("../../main/repository/PromotionRepository");
const DiscountRepository_1 = require("../../main/repository/DiscountRepository");
const SavedPromotionRepository_1 = require("../../main/repository/SavedPromotionRepository");
const PromotionType_1 = require("../../main/data/PromotionType");
const DiscountType_1 = require("../../main/data/DiscountType");
const ScheduleRepository_1 = require("../../main/repository/ScheduleRepository");
const PromotionFactory_1 = require("../factory/PromotionFactory");
const DiscountFactory_1 = require("../factory/DiscountFactory");
const ScheduleFactory_1 = require("../factory/ScheduleFactory");
const UserFactory_1 = require("../factory/UserFactory");
const SavedPromotionFactory_1 = require("../factory/SavedPromotionFactory");
const CuisineType_1 = require("../../main/data/CuisineType");
const Day_1 = require("../../main/data/Day");
const RestaurantFactory_1 = require("../factory/RestaurantFactory");
const RestaurantRepository_1 = require("../../main/repository/RestaurantRepository");
const SavedPromotion_1 = require("../../main/entity/SavedPromotion");
const VoteRecordRepository_1 = require("../../main/repository/VoteRecordRepository");
const VoteRecord_1 = require("../../main/entity/VoteRecord");
describe('Integration tests for all entities', function () {
    const SAMPLE_SEARCH_QUERY = 'beef cafe';
    let userRepository;
    let promotionRepository;
    let discountRepository;
    let restaurantRepository;
    let savedPromotionRepository;
    let scheduleRepository;
    let voteRecordRepository;
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        yield BaseRepositoryTest_1.default.create();
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        yield BaseRepositoryTest_1.default.close();
    }));
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        yield BaseRepositoryTest_1.default.clear();
        userRepository = typeorm_1.getCustomRepository(UserRepository_1.UserRepository);
        promotionRepository = typeorm_1.getCustomRepository(PromotionRepository_1.PromotionRepository);
        discountRepository = typeorm_1.getCustomRepository(DiscountRepository_1.DiscountRepository);
        restaurantRepository = typeorm_1.getCustomRepository(RestaurantRepository_1.RestaurantRepository);
        savedPromotionRepository = typeorm_1.getCustomRepository(SavedPromotionRepository_1.SavedPromotionRepository);
        scheduleRepository = typeorm_1.getCustomRepository(ScheduleRepository_1.ScheduleRepository);
        voteRecordRepository = typeorm_1.getCustomRepository(VoteRecordRepository_1.VoteRecordRepository);
    }));
    test('Should not be able to save a promotion if user is not saved', () => __awaiter(this, void 0, void 0, function* () {
        const unSavedUser = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(unSavedUser);
        const users = yield userRepository.find();
        expect(users.length).toBe(0);
        try {
            yield promotionRepository.save(promotion);
            fail('Should have failed');
        }
        catch (e) {
            expect(e.message).toContain('violates not-null constraint');
        }
    }));
    test('Cascade delete - deleting a promotion should delete its discount', () => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion);
        try {
            const discounts = yield discountRepository.find();
            expect(discounts).toBeDefined();
            expect(discounts[0].discountType).toEqual(promotion.discount.discountType);
            yield promotionRepository.delete(promotion.id);
            expect(yield promotionRepository.find()).toEqual([]);
            expect(yield discountRepository.find()).toEqual([]);
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Cascade delete - deleting a promotion should delete its restaurant', () => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion);
        try {
            const restaurants = yield restaurantRepository.find();
            expect(restaurants).toBeDefined();
            expect(restaurants[0].lat).toEqual(promotion.restaurant.lat);
            yield promotionRepository.delete(promotion.id);
            expect(yield promotionRepository.find()).toEqual([]);
            expect(yield restaurantRepository.find()).toEqual([]);
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Cascade delete - deleting a user should delete any of the users uploaded promotions', () => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion1 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const promotion2 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion1);
        yield promotionRepository.save(promotion2);
        try {
            yield userRepository.delete(user);
            expect(yield userRepository.find()).toEqual([]);
            expect(yield promotionRepository.find()).toEqual([]);
            expect(yield discountRepository.find()).toEqual([]);
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test("Cascade delete - deleting a user should not delete saved promotions that aren't uploaded by the user", () => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const user1 = new UserFactory_1.UserFactory().generate();
        const user2 = new UserFactory_1.UserFactory().generate();
        const promotion1 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user1);
        const promotion2 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user2);
        const savedPromotion = new SavedPromotionFactory_1.SavedPromotionFactory().generate(user1, promotion2);
        yield userRepository.save(user1);
        yield userRepository.save(user2);
        yield promotionRepository.save(promotion1);
        yield promotionRepository.save(promotion2);
        yield savedPromotionRepository.save(savedPromotion);
        try {
            yield userRepository.delete(user1.id);
            const user = yield userRepository.findOne(user2.id, {
                relations: [
                    'uploadedPromotions',
                    'uploadedPromotions.discount',
                    'savedPromotions',
                    'savedPromotions.promotion',
                ],
            });
            expect((_a = user === null || user === void 0 ? void 0 : user.uploadedPromotions[0]) === null || _a === void 0 ? void 0 : _a.id).toEqual(promotion2.id);
            expect((_b = user === null || user === void 0 ? void 0 : user.uploadedPromotions[0]) === null || _b === void 0 ? void 0 : _b.discount).toEqual(promotion2.discount);
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Cascade delete - deleting a promotion should remove it from any users saved and uploaded promotions', () => __awaiter(this, void 0, void 0, function* () {
        const user1 = new UserFactory_1.UserFactory().generate();
        const user2 = new UserFactory_1.UserFactory().generate();
        const promotion1 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user1);
        const promotion2 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user2);
        yield userRepository.save(user1);
        yield userRepository.save(user2);
        yield promotionRepository.save(promotion1);
        yield promotionRepository.save(promotion2);
        yield savedPromotionRepository.addSavedPromotions(user1, [
            promotion1,
            promotion2,
        ]);
        try {
            yield promotionRepository.delete([promotion1.id, promotion2.id]);
            const user = yield userRepository.findOne(user1.id, {
                relations: [
                    'uploadedPromotions',
                    'savedPromotions',
                    'savedPromotions.promotion',
                ],
            });
            expect(user === null || user === void 0 ? void 0 : user.uploadedPromotions).toEqual([]);
            expect(user === null || user === void 0 ? void 0 : user.savedPromotions).toEqual([]);
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test("Should be able to remove a user's saved promotion without deleting the promotion and user", () => __awaiter(this, void 0, void 0, function* () {
        var _c;
        const user = new UserFactory_1.UserFactory().generate();
        const promotion1 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const promotion2 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion1);
        yield promotionRepository.save(promotion2);
        yield savedPromotionRepository.addSavedPromotions(user, [
            promotion1,
            promotion2,
        ]);
        try {
            yield savedPromotionRepository.delete({ userId: user.id });
            const persistedUser = yield userRepository.findOne(user.id, {
                relations: ['uploadedPromotions', 'savedPromotions'],
            });
            expect(persistedUser === null || persistedUser === void 0 ? void 0 : persistedUser.savedPromotions).toEqual([]);
            expect((_c = persistedUser === null || persistedUser === void 0 ? void 0 : persistedUser.uploadedPromotions) === null || _c === void 0 ? void 0 : _c.length).toEqual(2);
            expect(persistedUser === null || persistedUser === void 0 ? void 0 : persistedUser.uploadedPromotions[0].id).toEqual(promotion1.id);
            expect(persistedUser === null || persistedUser === void 0 ? void 0 : persistedUser.uploadedPromotions[1].id).toEqual(promotion2.id);
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Should see discounts loaded when getting promotions (not lazy loaded) regardless of having search query or not', () => __awaiter(this, void 0, void 0, function* () {
        const promotionQueryDTOWithSearchQuery = {
            searchQuery: SAMPLE_SEARCH_QUERY,
        };
        const promotionQueryDTOWithoutSearchQuery = {
            promotionType: PromotionType_1.PromotionType.BOGO,
            discountType: DiscountType_1.DiscountType.PERCENTAGE,
        };
        const user1 = new UserFactory_1.UserFactory().generate();
        const user2 = new UserFactory_1.UserFactory().generate();
        const promotion1 = new PromotionFactory_1.PromotionFactory().generate(user1, new DiscountFactory_1.DiscountFactory().generate(), new RestaurantFactory_1.RestaurantFactory().generate(), [new ScheduleFactory_1.ScheduleFactory().generate()]);
        promotion1.name = SAMPLE_SEARCH_QUERY;
        const promotion2 = new PromotionFactory_1.PromotionFactory().generate(user2, new DiscountFactory_1.DiscountFactory().generate(DiscountType_1.DiscountType.PERCENTAGE), new RestaurantFactory_1.RestaurantFactory().generate(), [new ScheduleFactory_1.ScheduleFactory().generate()], PromotionType_1.PromotionType.BOGO);
        yield userRepository.save(user1);
        yield userRepository.save(user2);
        yield promotionRepository.save(promotion1);
        yield promotionRepository.save(promotion2);
        try {
            const promotionsWithQuery = yield promotionRepository.getAllPromotions(promotionQueryDTOWithSearchQuery);
            const promotionsWithoutSearchQuery = yield promotionRepository.getAllPromotions(promotionQueryDTOWithoutSearchQuery);
            const promotionsWithoutQuery = yield promotionRepository.getAllPromotions();
            expect(promotionsWithQuery.length).toBeGreaterThan(0);
            expect(promotionsWithoutSearchQuery.length).toBeGreaterThan(0);
            expect(promotionsWithoutQuery.length).toBeGreaterThan(0);
            for (const promotion of promotionsWithQuery) {
                expect(!promotion.discount);
                expect(promotion.discount.discountType).toBeDefined();
                expect(promotion.discount.discountValue).toBeDefined();
            }
            for (const promotion of promotionsWithoutSearchQuery) {
                expect(!promotion.discount);
                expect(promotion.discount.discountType).toBeDefined();
                expect(promotion.discount.discountValue).toBeDefined();
            }
            for (const promotion of promotionsWithoutQuery) {
                expect(!promotion.discount);
                expect(promotion.discount.discountType).toBeDefined();
                expect(promotion.discount.discountValue).toBeDefined();
            }
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('When apply filter options, results should only contain values that match all filters', () => __awaiter(this, void 0, void 0, function* () {
        const promotionQueryDTO = {
            promotionType: PromotionType_1.PromotionType.BOGO,
            discountType: DiscountType_1.DiscountType.PERCENTAGE,
        };
        const user1 = new UserFactory_1.UserFactory().generate();
        const user2 = new UserFactory_1.UserFactory().generate();
        const promotion1 = new PromotionFactory_1.PromotionFactory().generate(user2, new DiscountFactory_1.DiscountFactory().generate(DiscountType_1.DiscountType.PERCENTAGE), new RestaurantFactory_1.RestaurantFactory().generate(), [new ScheduleFactory_1.ScheduleFactory().generate()], PromotionType_1.PromotionType.BOGO);
        const promotion2 = new PromotionFactory_1.PromotionFactory().generate(user2, new DiscountFactory_1.DiscountFactory().generate(DiscountType_1.DiscountType.PERCENTAGE), new RestaurantFactory_1.RestaurantFactory().generate(), [new ScheduleFactory_1.ScheduleFactory().generate()], PromotionType_1.PromotionType.BOGO);
        yield userRepository.save(user1);
        yield userRepository.save(user2);
        yield promotionRepository.save(promotion1);
        yield promotionRepository.save(promotion2);
        try {
            const promotions = yield promotionRepository.getAllPromotions(promotionQueryDTO);
            expect(promotions.length).toBeGreaterThan(0);
            for (const promotion of promotions) {
                expect(promotion.promotionType).toEqual(promotionQueryDTO.promotionType);
                expect(promotion.discount.discountType).toEqual(promotionQueryDTO.discountType);
            }
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('When apply filter options without search query, results should not contain rank, boldDescription, and boldName', () => __awaiter(this, void 0, void 0, function* () {
        const promotionQueryDTO = {
            promotionType: PromotionType_1.PromotionType.BOGO,
            discountType: DiscountType_1.DiscountType.PERCENTAGE,
        };
        const user1 = new UserFactory_1.UserFactory().generate();
        const user2 = new UserFactory_1.UserFactory().generate();
        const promotion1 = new PromotionFactory_1.PromotionFactory().generate(user2, new DiscountFactory_1.DiscountFactory().generate(DiscountType_1.DiscountType.PERCENTAGE), new RestaurantFactory_1.RestaurantFactory().generate(), [new ScheduleFactory_1.ScheduleFactory().generate()], PromotionType_1.PromotionType.BOGO);
        const promotion2 = new PromotionFactory_1.PromotionFactory().generate(user2, new DiscountFactory_1.DiscountFactory().generate(DiscountType_1.DiscountType.PERCENTAGE), new RestaurantFactory_1.RestaurantFactory().generate(), [new ScheduleFactory_1.ScheduleFactory().generate()], PromotionType_1.PromotionType.BOGO);
        yield userRepository.save(user1);
        yield userRepository.save(user2);
        yield promotionRepository.save(promotion1);
        yield promotionRepository.save(promotion2);
        try {
            const promotions = yield promotionRepository.getAllPromotions(promotionQueryDTO);
            expect(promotions.length).toBeGreaterThan(0);
            for (const promotion of promotions) {
                expect(promotion.rank).not.toBeDefined();
                expect(promotion.boldDescription).not.toBeDefined();
                expect(promotion.boldName).not.toBeDefined();
            }
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('When apply search query, results should contain rank and is ordered by rank', () => __awaiter(this, void 0, void 0, function* () {
        const promotionQueryDTO = {
            searchQuery: SAMPLE_SEARCH_QUERY,
        };
        const user1 = new UserFactory_1.UserFactory().generate();
        const user2 = new UserFactory_1.UserFactory().generate();
        const promotion1 = new PromotionFactory_1.PromotionFactory().generate(user2, new DiscountFactory_1.DiscountFactory().generate(DiscountType_1.DiscountType.PERCENTAGE), new RestaurantFactory_1.RestaurantFactory().generate(), [new ScheduleFactory_1.ScheduleFactory().generate()], PromotionType_1.PromotionType.BOGO);
        promotion1.name = SAMPLE_SEARCH_QUERY;
        promotion1.description = SAMPLE_SEARCH_QUERY.repeat(2);
        const promotion2 = new PromotionFactory_1.PromotionFactory().generate(user2, new DiscountFactory_1.DiscountFactory().generate(DiscountType_1.DiscountType.PERCENTAGE), new RestaurantFactory_1.RestaurantFactory().generate(), [new ScheduleFactory_1.ScheduleFactory().generate()], PromotionType_1.PromotionType.BOGO);
        promotion2.name = SAMPLE_SEARCH_QUERY;
        yield userRepository.save(user1);
        yield userRepository.save(user2);
        yield promotionRepository.save(promotion1);
        yield promotionRepository.save(promotion2);
        try {
            const promotions = yield promotionRepository.getAllPromotions(promotionQueryDTO);
            expect(promotions.length).toBeGreaterThan(0);
            let currRank = 1;
            for (const promotion of promotions) {
                if (promotion.rank) {
                    expect(promotion.rank).toBeLessThanOrEqual(currRank);
                    currRank = promotion.rank;
                }
                else {
                    fail('promotion rank should be defined');
                }
            }
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('When apply search query, should return the promotion with bolded names and descriptions for relevant areas that match the search query', () => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        promotion.name =
            'The Old Spaghetti Factory - Buy a $25 Gift Card Get $10 Bonus Card';
        promotion.description =
            "From now until December 31st, for every $25 in Gift Cards purchased, get a FREE $10 Bonus Card. Click 'ORDER NOW', or purchase in-store! *Gift Cards valid in Canada only. Gift Cards are not valid on date of purchase. Bonus Cards are valid from January 1st to March 15th, 2021. One Bonus Card redemption per table visit.";
        const promotionQueryDTO = {
            searchQuery: 'spaghetti card',
        };
        yield userRepository.save(user);
        yield promotionRepository.save(promotion);
        try {
            const promotions = yield promotionRepository.getAllPromotions(promotionQueryDTO);
            expect(promotions === null || promotions === void 0 ? void 0 : promotions.length).toEqual(1);
            expect(promotions[0].boldName).toContain('<b>Spaghetti</b>');
            expect(promotions[0].boldDescription).toContain('<b>Card</b>');
            expect(promotions[0].boldDescription).toContain('<b>Cards</b>');
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Cascade delete - deleting a promotion will delete its schedules', () => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion);
        try {
            const schedules = yield scheduleRepository.find();
            expect(schedules).toBeDefined();
            expect(schedules.length).toEqual(promotion.schedules.length);
            yield promotionRepository.delete(promotion.id);
            expect(yield promotionRepository.find()).toEqual([]);
            expect(yield scheduleRepository.find()).toEqual([]);
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Unique constraint - should not be able to save schedules with the same day', () => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const schedule1 = new ScheduleFactory_1.ScheduleFactory().generate();
        const schedule2 = new ScheduleFactory_1.ScheduleFactory().generate();
        schedule1.dayOfWeek = schedule2.dayOfWeek;
        const promotion = new PromotionFactory_1.PromotionFactory().generate(user, new DiscountFactory_1.DiscountFactory().generate(), new RestaurantFactory_1.RestaurantFactory().generate(), [schedule1, schedule2]);
        try {
            yield userRepository.save(user);
            yield promotionRepository.save(promotion);
            fail('Should have failed');
        }
        catch (e) {
            expect(e.message).toContain('duplicate key value violates unique constraint');
        }
    }));
    test('Should be able to get all promotions with specific discount type', () => __awaiter(this, void 0, void 0, function* () {
        const promotionQueryDTO = {
            discountType: DiscountType_1.DiscountType.PERCENTAGE,
        };
        const user = new UserFactory_1.UserFactory().generate();
        const promotion1 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const promotion2 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        promotion1.discount.discountType = DiscountType_1.DiscountType.PERCENTAGE;
        promotion2.discount.discountType = DiscountType_1.DiscountType.PERCENTAGE;
        yield userRepository.save(user);
        yield promotionRepository.save(promotion1);
        yield promotionRepository.save(promotion2);
        try {
            const promotions = yield promotionRepository.getAllPromotions(promotionQueryDTO);
            expect(promotions).toBeDefined();
            expect(promotions.length).toBeGreaterThan(0);
            for (const promotion of promotions) {
                expect(promotion === null || promotion === void 0 ? void 0 : promotion.discount.discountType).toEqual(promotionQueryDTO.discountType);
            }
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Should be able to get all promotions with specific discount type and greater than a percentage discount type', () => __awaiter(this, void 0, void 0, function* () {
        const promotionQueryDTO = {
            discountType: DiscountType_1.DiscountType.PERCENTAGE,
            discountValue: 5.6,
        };
        const user1 = new UserFactory_1.UserFactory().generate();
        const user2 = new UserFactory_1.UserFactory().generate();
        const promotion1 = new PromotionFactory_1.PromotionFactory().generate(user2, new DiscountFactory_1.DiscountFactory().generate(DiscountType_1.DiscountType.PERCENTAGE, 18), new RestaurantFactory_1.RestaurantFactory().generate(), [new ScheduleFactory_1.ScheduleFactory().generate()]);
        const promotion2 = new PromotionFactory_1.PromotionFactory().generate(user2, new DiscountFactory_1.DiscountFactory().generate(DiscountType_1.DiscountType.PERCENTAGE, 4.9), new RestaurantFactory_1.RestaurantFactory().generate(), [new ScheduleFactory_1.ScheduleFactory().generate()]);
        yield userRepository.save(user1);
        yield userRepository.save(user2);
        yield promotionRepository.save(promotion1);
        yield promotionRepository.save(promotion2);
        try {
            const promotions = yield promotionRepository.getAllPromotions(promotionQueryDTO);
            expect(promotions).toBeDefined();
            expect(promotions.length).toEqual(1);
            expect(promotions[0].discount.discountType).toEqual(promotionQueryDTO.discountType);
            expect(promotions[0].discount.discountValue).toBeGreaterThanOrEqual(promotionQueryDTO.discountValue);
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Should be able to get all promotions with specific discount type and greater than a dollar discount type', () => __awaiter(this, void 0, void 0, function* () {
        const promotionQueryDTO = {
            discountType: DiscountType_1.DiscountType.AMOUNT,
            discountValue: 5.6,
        };
        const user1 = new UserFactory_1.UserFactory().generate();
        const user2 = new UserFactory_1.UserFactory().generate();
        const promotion1 = new PromotionFactory_1.PromotionFactory().generate(user2, new DiscountFactory_1.DiscountFactory().generate(DiscountType_1.DiscountType.AMOUNT, 18), new RestaurantFactory_1.RestaurantFactory().generate(), [new ScheduleFactory_1.ScheduleFactory().generate()], PromotionType_1.PromotionType.BOGO);
        const promotion2 = new PromotionFactory_1.PromotionFactory().generate(user2, new DiscountFactory_1.DiscountFactory().generate(DiscountType_1.DiscountType.AMOUNT, 4.9), new RestaurantFactory_1.RestaurantFactory().generate(), [new ScheduleFactory_1.ScheduleFactory().generate()], PromotionType_1.PromotionType.BOGO);
        yield userRepository.save(user1);
        yield userRepository.save(user2);
        yield promotionRepository.save(promotion1);
        yield promotionRepository.save(promotion2);
        try {
            const promotions = yield promotionRepository.getAllPromotions(promotionQueryDTO);
            expect(promotions).toBeDefined();
            expect(promotions.length).toEqual(1);
            expect(promotions[0].discount.discountType).toEqual(promotionQueryDTO.discountType);
            expect(promotions[0].discount.discountValue).toBeGreaterThanOrEqual(promotionQueryDTO.discountValue);
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Should be able to get all promotions that are available a specific day of the week', () => __awaiter(this, void 0, void 0, function* () {
        const promotionQueryDTO = {
            dayOfWeek: Day_1.Day.MONDAY,
        };
        const user1 = new UserFactory_1.UserFactory().generate();
        const user2 = new UserFactory_1.UserFactory().generate();
        const promotion1 = new PromotionFactory_1.PromotionFactory().generate(user1, new DiscountFactory_1.DiscountFactory().generate(), new RestaurantFactory_1.RestaurantFactory().generate(), [new ScheduleFactory_1.ScheduleFactory().generate('8:00', '9:00', Day_1.Day.MONDAY)]);
        const promotion2 = new PromotionFactory_1.PromotionFactory().generate(user2, new DiscountFactory_1.DiscountFactory().generate(), new RestaurantFactory_1.RestaurantFactory().generate(), [new ScheduleFactory_1.ScheduleFactory().generate('8:00', '9:00', Day_1.Day.TUESDAY)]);
        const promotion3 = new PromotionFactory_1.PromotionFactory().generate(user2, new DiscountFactory_1.DiscountFactory().generate(), new RestaurantFactory_1.RestaurantFactory().generate(), [
            new ScheduleFactory_1.ScheduleFactory().generate('8:00', '9:00', Day_1.Day.FRIDAY),
            new ScheduleFactory_1.ScheduleFactory().generate('8:00', '9:00', Day_1.Day.MONDAY),
            new ScheduleFactory_1.ScheduleFactory().generate('8:00', '9:00', Day_1.Day.SATURDAY),
        ]);
        yield userRepository.save(user1);
        yield userRepository.save(user2);
        yield promotionRepository.save(promotion1);
        yield promotionRepository.save(promotion2);
        yield promotionRepository.save(promotion3);
        try {
            const promotions = yield promotionRepository.getAllPromotions(promotionQueryDTO);
            expect(promotions).toBeDefined();
            expect(promotions.length).toEqual(2);
            const expectedPromotions = [promotion1, promotion3];
            for (const expectedPromotion of expectedPromotions) {
                const p = promotions.find((promotion) => promotion.id === expectedPromotion.id);
                expect(p).toBeDefined();
                expect(p.schedules.length).toEqual(expectedPromotion.schedules.length);
                expect(p.schedules.find((schedule) => schedule.dayOfWeek === promotionQueryDTO.dayOfWeek)).toBeDefined();
            }
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Should be able to get all promotions that belong to either one of the specified cuisines', () => __awaiter(this, void 0, void 0, function* () {
        const promotionQueryDTO = {
            cuisine: [CuisineType_1.CuisineType.CAJUN, CuisineType_1.CuisineType.CARIBBEAN],
        };
        const user1 = new UserFactory_1.UserFactory().generate();
        const user2 = new UserFactory_1.UserFactory().generate();
        const promotion1 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user1);
        const promotion2 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user2);
        const promotion3 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user2);
        promotion1.cuisine = CuisineType_1.CuisineType.CAJUN;
        promotion2.cuisine = CuisineType_1.CuisineType.CARIBBEAN;
        promotion3.cuisine = CuisineType_1.CuisineType.CHECHEN;
        yield userRepository.save(user1);
        yield userRepository.save(user2);
        yield promotionRepository.save(promotion1);
        yield promotionRepository.save(promotion2);
        yield promotionRepository.save(promotion3);
        try {
            const promotions = yield promotionRepository.getAllPromotions(promotionQueryDTO);
            expect(promotions).toBeDefined();
            expect(promotions.length).toEqual(2);
            for (const promotion of promotions) {
                expect(promotionQueryDTO.cuisine).toContain(promotion.cuisine);
            }
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Should get all promotions when querying an empty array of cuisines', () => __awaiter(this, void 0, void 0, function* () {
        const promotionQueryDTO = {
            cuisine: [],
        };
        const user = new UserFactory_1.UserFactory().generate();
        const promotion1 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const promotion2 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const promotion3 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        promotion1.cuisine = CuisineType_1.CuisineType.CAJUN;
        promotion2.cuisine = CuisineType_1.CuisineType.CARIBBEAN;
        promotion3.cuisine = CuisineType_1.CuisineType.CHECHEN;
        yield userRepository.save(user);
        yield promotionRepository.save(promotion1);
        yield promotionRepository.save(promotion2);
        yield promotionRepository.save(promotion3);
        try {
            const promotions = yield promotionRepository.getAllPromotions(promotionQueryDTO);
            expect(promotions).toBeDefined();
            expect(promotions.length).toEqual(3);
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Test DeleteRestaurant migration - Deleting a promotion should delete restaurant respectively if restaurant is only referencing one promotion', () => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion1 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const promotion2 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        promotion2.restaurant = promotion1.restaurant;
        yield userRepository.save(user);
        yield promotionRepository.save(promotion1);
        yield promotionRepository.save(promotion2);
        try {
            yield promotionRepository.delete(promotion1.id);
            yield restaurantRepository.findOneOrFail(promotion2.restaurant.id);
            yield promotionRepository.delete(promotion2.id);
            const restaurants = yield restaurantRepository.find();
            expect(restaurants).toHaveLength(0);
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Deleting a restaurant should fail if promotion is referencing the restaurant', () => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion);
        try {
            yield restaurantRepository.delete(promotion.restaurant.id);
            fail('Should have failed');
        }
        catch (e) {
            expect(e.message).toContain('update or delete on table "restaurant" violates foreign key constraint');
        }
    }));
    test('Promotions should tell whether user has saved the promotion or not if userId is provided to query', () => __awaiter(this, void 0, void 0, function* () {
        var _d, _e, _f;
        const user = new UserFactory_1.UserFactory().generate();
        const promotion1 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const promotion2 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const promotion3 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion1);
        yield promotionRepository.save(promotion2);
        yield promotionRepository.save(promotion3);
        yield savedPromotionRepository.save(new SavedPromotion_1.SavedPromotion(user, promotion1));
        yield savedPromotionRepository.save(new SavedPromotion_1.SavedPromotion(user, promotion2));
        const promotionQueryDTO = {
            userId: user.id,
        };
        try {
            const promotions = yield promotionRepository.getAllPromotions(promotionQueryDTO);
            expect(promotions).toBeDefined();
            expect(promotions.length).toEqual(3);
            expect((_d = promotions.find((promotion) => promotion.id === promotion1.id)) === null || _d === void 0 ? void 0 : _d.isSavedByUser).toEqual(true);
            expect((_e = promotions.find((promotion) => promotion.id === promotion2.id)) === null || _e === void 0 ? void 0 : _e.isSavedByUser).toEqual(true);
            expect((_f = promotions.find((promotion) => promotion.id === promotion3.id)) === null || _f === void 0 ? void 0 : _f.isSavedByUser).toEqual(false);
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Finding promotions saved by user with search query should not fail', () => __awaiter(this, void 0, void 0, function* () {
        var _g, _h;
        const user = new UserFactory_1.UserFactory().generate();
        const promotion1 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const promotion2 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const promotion3 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        promotion1.name = SAMPLE_SEARCH_QUERY;
        promotion2.name = SAMPLE_SEARCH_QUERY;
        yield userRepository.save(user);
        yield promotionRepository.save(promotion1);
        yield promotionRepository.save(promotion2);
        yield promotionRepository.save(promotion3);
        yield savedPromotionRepository.save(new SavedPromotion_1.SavedPromotion(user, promotion1));
        const promotionQueryDTO = {
            userId: user.id,
            searchQuery: SAMPLE_SEARCH_QUERY,
        };
        try {
            const promotions = yield promotionRepository.getAllPromotions(promotionQueryDTO);
            expect(promotions).toBeDefined();
            expect(promotions.length).toEqual(2);
            expect((_g = promotions.find((promotion) => promotion.id === promotion1.id)) === null || _g === void 0 ? void 0 : _g.isSavedByUser).toEqual(true);
            expect((_h = promotions.find((promotion) => promotion.id === promotion2.id)) === null || _h === void 0 ? void 0 : _h.isSavedByUser).toEqual(false);
            for (const promotion of promotions) {
                expect(promotion.rank).toBeGreaterThan(0);
                expect(promotion.boldName).toBeDefined();
                expect(promotion.boldDescription).toBeDefined();
            }
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Getting promotions without userId query param should not define isSavedByUser', () => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion1 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const promotion2 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const promotion3 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion1);
        yield promotionRepository.save(promotion2);
        yield promotionRepository.save(promotion3);
        try {
            const promotions = yield promotionRepository.getAllPromotions({});
            expect(promotions).toBeDefined();
            expect(promotions.length).toEqual(3);
            for (const promotion of promotions) {
                expect(promotion.isSavedByUser).toBeUndefined();
            }
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Promotions should tell whether user has voted the promotion or not if userId is provided to query', () => __awaiter(this, void 0, void 0, function* () {
        var _j, _k, _l;
        const user = new UserFactory_1.UserFactory().generate();
        const promotion1 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const promotion2 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        const promotion3 = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion1);
        yield promotionRepository.save(promotion2);
        yield promotionRepository.save(promotion3);
        let voteRecord = new VoteRecord_1.VoteRecord(user, promotion1);
        yield voteRecordRepository.save(voteRecord);
        voteRecord.voteState = VoteRecord_1.VoteState.UP;
        yield promotionRepository.increment({ id: promotion1.id }, 'votes', 1);
        yield voteRecordRepository.save(voteRecord);
        voteRecord = new VoteRecord_1.VoteRecord(user, promotion2);
        yield voteRecordRepository.save(voteRecord);
        voteRecord.voteState = VoteRecord_1.VoteState.DOWN;
        yield promotionRepository.decrement({ id: promotion2.id }, 'votes', 1);
        yield voteRecordRepository.save(voteRecord);
        const promotionQueryDTO = {
            userId: user.id,
        };
        try {
            const promotions = yield promotionRepository.getAllPromotions(promotionQueryDTO);
            expect(promotions).toBeDefined();
            expect(promotions.length).toEqual(3);
            expect((_j = promotions.find((promotion) => promotion.id === promotion1.id)) === null || _j === void 0 ? void 0 : _j.voteState).toEqual(1);
            expect((_k = promotions.find((promotion) => promotion.id === promotion2.id)) === null || _k === void 0 ? void 0 : _k.voteState).toEqual(VoteRecord_1.VoteState.DOWN);
            expect((_l = promotions.find((promotion) => promotion.id === promotion3.id)) === null || _l === void 0 ? void 0 : _l.voteState).toEqual(VoteRecord_1.VoteState.INIT);
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
});
//# sourceMappingURL=EntityIntegration.test.js.map