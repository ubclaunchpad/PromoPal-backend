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
const BaseRepositoryTest_1 = __importDefault(require("./BaseRepositoryTest"));
const SavedPromotionRepository_1 = require("../../main/repository/SavedPromotionRepository");
const UserRepository_1 = require("../../main/repository/UserRepository");
const PromotionRepository_1 = require("../../main/repository/PromotionRepository");
const UserFactory_1 = require("../factory/UserFactory");
const PromotionFactory_1 = require("../factory/PromotionFactory");
describe('Unit tests for SavedPromotionRepository', function () {
    let savedPromotionRepository;
    let userRepository;
    let promotionRepository;
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        yield BaseRepositoryTest_1.default.create();
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        yield BaseRepositoryTest_1.default.close();
    }));
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        yield BaseRepositoryTest_1.default.clear();
        savedPromotionRepository = typeorm_1.getCustomRepository(SavedPromotionRepository_1.SavedPromotionRepository);
        userRepository = typeorm_1.getCustomRepository(UserRepository_1.UserRepository);
        promotionRepository = typeorm_1.getCustomRepository(PromotionRepository_1.PromotionRepository);
    }));
    test('Should be able to store a savedpromotion and successfully retrieve the saved promotion', () => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion);
        const savedUser = new UserFactory_1.UserFactory().generate();
        yield userRepository.save(savedUser);
        const savedPromotion = savedPromotionRepository.create({
            userId: savedUser.id,
            promotionId: promotion.id,
        });
        yield savedPromotionRepository.save(savedPromotion);
        const savedpromotion = yield savedPromotionRepository.findOne({
            user: savedUser,
            promotion: promotion,
        });
        expect(savedpromotion).toBeDefined();
        expect(savedpromotion.userId).toEqual(savedUser.id);
        expect(savedpromotion.promotionId).toEqual(promotion.id);
    }));
    test('Should not able to store two same promotion for one user', () => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion);
        const savedUser = new UserFactory_1.UserFactory().generate();
        yield userRepository.save(savedUser);
        yield savedPromotionRepository.addSavedPromotion(savedUser, promotion);
        try {
            yield savedPromotionRepository.addSavedPromotion(savedUser, promotion);
            fail('Should have failed');
        }
        catch (e) {
            expect(e.detail).toEqual(`Key ("userId", "promotionId")=(${savedUser.id}, ${promotion.id}) already exists.`);
        }
    }));
    test('Should be able to store a savedpromotion and successfully delete the saved promotion', () => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion);
        const savedUser = new UserFactory_1.UserFactory().generate();
        yield userRepository.save(savedUser);
        yield savedPromotionRepository.addSavedPromotion(savedUser, promotion);
        try {
            yield savedPromotionRepository.deleteSavedPromotion(savedUser, promotion);
        }
        catch (e) {
            fail('Should have succeeded to delete');
        }
        try {
            expect(yield savedPromotionRepository.find({
                user: savedUser,
                promotion: promotion,
            })).toEqual([]);
        }
        catch (e) {
            fail('Should not have failed');
        }
    }));
});
//# sourceMappingURL=SavedPromotionRepository.test.js.map