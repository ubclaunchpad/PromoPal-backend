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
const BaseRepositoryTest_1 = __importDefault(require("../repository/BaseRepositoryTest"));
const supertest_1 = __importDefault(require("supertest"));
const BaseController_1 = require("./BaseController");
const DiscountType_1 = require("../../main/data/DiscountType");
const PromotionType_1 = require("../../main/data/PromotionType");
const CuisineType_1 = require("../../main/data/CuisineType");
const Day_1 = require("../../main/data/Day");
describe('Unit tests for PromotionController', function () {
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
    }));
    test('GET /enums - get values of all supported enums', () => __awaiter(this, void 0, void 0, function* () {
        const supportedEnumStrings = [
            'DiscountType',
            'PromotionType',
            'CuisineType',
            'Day',
        ];
        const supportedEnums = [DiscountType_1.DiscountType, PromotionType_1.PromotionType, CuisineType_1.CuisineType, Day_1.Day];
        const promises = [];
        for (let i = 0; i < supportedEnums.length; i++) {
            const bodyFunction = (res) => {
                const values = res.body;
                expect(values).toMatchObject(Object.values(supportedEnums[i]));
            };
            promises.push(supertest_1.default(app)
                .get(`/enums/${supportedEnumStrings[i]}`)
                .expect(200)
                .expect(bodyFunction));
        }
        yield Promise.all(promises);
    }));
});
//# sourceMappingURL=EnumController.test.js.map