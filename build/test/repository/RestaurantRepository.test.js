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
const RestaurantRepository_1 = require("../../main/repository/RestaurantRepository");
const RestaurantFactory_1 = require("../factory/RestaurantFactory");
describe('Unit tests for RestaurantRepository', function () {
    let restaurantRepository;
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        yield BaseRepositoryTest_1.default.create();
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        yield BaseRepositoryTest_1.default.close();
    }));
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        yield BaseRepositoryTest_1.default.clear();
        restaurantRepository = typeorm_1.getCustomRepository(RestaurantRepository_1.RestaurantRepository);
    }));
    test('Should be able to save restaurant without promotion', () => __awaiter(this, void 0, void 0, function* () {
        const restaurant = new RestaurantFactory_1.RestaurantFactory().generate();
        try {
            yield restaurantRepository.save(restaurant);
        }
        catch (e) {
            fail('Should have failed');
        }
    }));
});
//# sourceMappingURL=RestaurantRepository.test.js.map