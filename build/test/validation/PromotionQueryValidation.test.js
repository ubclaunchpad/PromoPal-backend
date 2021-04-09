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
Object.defineProperty(exports, "__esModule", { value: true });
const DiscountType_1 = require("../../main/data/DiscountType");
const PromotionQueryValidation_1 = require("../../main/validation/PromotionQueryValidation");
const CuisineType_1 = require("../../main/data/CuisineType");
const PromotionType_1 = require("../../main/data/PromotionType");
const Day_1 = require("../../main/data/Day");
describe('Unit tests for PromotionQueryValidation', function () {
    let promotionQueryDTO;
    beforeEach(() => {
        promotionQueryDTO = {
            promotionType: PromotionType_1.PromotionType.HAPPY_HOUR,
            cuisine: CuisineType_1.CuisineType.VIETNAMESE,
            discountType: DiscountType_1.DiscountType.AMOUNT,
            discountValue: 2,
            expirationDate: '2020-11-09 03:39:40.395843',
            dayOfWeek: Day_1.Day.THURSDAY,
            searchQuery: 'promo',
            userId: 'b271dde4-c938-4dd4-aba6-cdcd23b9194d',
        };
    });
    test('Should return no errors for a valid promotionQueryDTO', () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield PromotionQueryValidation_1.PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
                abortEarly: false,
            });
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Should fail if undefined', () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield PromotionQueryValidation_1.PromotionQueryValidation.schema.validateAsync(undefined, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"value" is required');
        }
    }));
    test('Should fail if given incorrect promotion type', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionQueryDTO.promotionType = 'Invalid Promotion Type';
            yield PromotionQueryValidation_1.PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toContain('"promotionType" must be one of');
        }
    }));
    test('Should fail if given incorrect cuisine type', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionQueryDTO.cuisine = 'Invalid Cuisine';
            yield PromotionQueryValidation_1.PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toContain('"cuisine" must be one of');
        }
    }));
    test('Should pass for valid cuisine type', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionQueryDTO.cuisine = CuisineType_1.CuisineType.AFGHAN;
            yield PromotionQueryValidation_1.PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
                abortEarly: false,
            });
        }
        catch (e) {
            fail('Should not have failed');
        }
    }));
    test('Should pass for array of cuisine types', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionQueryDTO.cuisine = [
                CuisineType_1.CuisineType.CARIBBEAN,
                CuisineType_1.CuisineType.CAJUN,
                CuisineType_1.CuisineType.AINU,
            ];
            yield PromotionQueryValidation_1.PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
                abortEarly: false,
            });
        }
        catch (e) {
            fail('Should not have failed');
        }
    }));
    test('Should pass for single cuisine in array', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionQueryDTO.cuisine = [CuisineType_1.CuisineType.CARIBBEAN];
            yield PromotionQueryValidation_1.PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
                abortEarly: false,
            });
        }
        catch (e) {
            fail('Should not have failed');
        }
    }));
    test('Should fail for empty cuisine array', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionQueryDTO.cuisine = [];
            yield PromotionQueryValidation_1.PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toContain('"cuisine" does not match any of the allowed types');
        }
    }));
    test('Should fail if element in array is not valid cuisine', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionQueryDTO.cuisine = [
                CuisineType_1.CuisineType.CARIBBEAN,
                'Non-existent cuisine type',
            ];
            yield PromotionQueryValidation_1.PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toContain('"cuisine" does not match any of the allowed types');
        }
    }));
    test('Should fail if cuisine is unparsed json', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionQueryDTO.cuisine = JSON.stringify([
                CuisineType_1.CuisineType.CARIBBEAN,
                CuisineType_1.CuisineType.CAJUN,
            ]);
            yield PromotionQueryValidation_1.PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toContain('"cuisine" must be one of');
        }
    }));
    test('Should fail if given incorrect discount type', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionQueryDTO.discountType = 'Invalid Discount Type';
            yield PromotionQueryValidation_1.PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"discountType" must be one of [%, $, Other]');
        }
    }));
    test('Should fail if given incorrect date', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionQueryDTO.expirationDate = 'Invalid Date';
            yield PromotionQueryValidation_1.PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"expirationDate" must be a valid date');
        }
    }));
    test('Should fail if discountValue is negative', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionQueryDTO.discountValue = -1;
            yield PromotionQueryValidation_1.PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"discountValue" must be a positive number');
        }
    }));
    test('Should be valid if discountValue is more than 2 decimals and should round as well', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionQueryDTO.discountValue = 1.8123;
            const result = yield PromotionQueryValidation_1.PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
                abortEarly: false,
            });
            expect(result.discountValue).toEqual(1.81);
        }
        catch (e) {
            fail('Should not have failed');
        }
    }));
    test('Should fail if discountValue is present, but discountType is not', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionQueryDTO.discountValue = 1.88;
            promotionQueryDTO.discountType = undefined;
            yield PromotionQueryValidation_1.PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"discountValue" missing required peer "discountType"');
        }
    }));
    test('If discountValue is improper format and discountType is missing, report both errors', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionQueryDTO.discountValue = -1;
            promotionQueryDTO.discountType = undefined;
            yield PromotionQueryValidation_1.PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(2);
            expect(e.details[0].message).toEqual('"discountValue" must be a positive number');
            expect(e.details[1].message).toEqual('"discountValue" missing required peer "discountType"');
        }
    }));
    test('Should fail if given incorrect dayOfWeek', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionQueryDTO.dayOfWeek = 'Invalid Day Of Week';
            yield PromotionQueryValidation_1.PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"dayOfWeek" must be one of [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]');
        }
    }));
    test('Should be valid if given correct dayOfWeek', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionQueryDTO.dayOfWeek = Day_1.Day.MONDAY;
            yield PromotionQueryValidation_1.PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
                abortEarly: false,
            });
        }
        catch (e) {
            fail('Should not have failed');
        }
    }));
    test('Should fail if userId is not uuid', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionQueryDTO.userId = 'b271dde4-c938-4dd4-aba6-cdcd23b9194d0000';
            yield PromotionQueryValidation_1.PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"userId" must be a valid GUID');
        }
    }));
    test('Should fail if any fields are the wrong type', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionQueryDTO = {
                promotionType: 1,
                cuisine: 'string',
                discountType: false,
                discountValue: 'hi',
                expirationDate: true,
                dayOfWeek: 123,
                searchQuery: 1,
                userId: true,
            };
            yield PromotionQueryValidation_1.PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(11);
            expect(e.details[0].message).toEqual('"searchQuery" must be a string');
            expect(e.details[1].message).toEqual('"discountType" must be one of [%, $, Other]');
            expect(e.details[2].message).toEqual('"discountType" must be a string');
            expect(e.details[3].message).toEqual('"discountValue" must be a number');
            expect(e.details[4].message).toContain('"promotionType" must be one of');
            expect(e.details[5].message).toEqual('"promotionType" must be a string');
            expect(e.details[6].message).toContain('"cuisine" must be one of');
            expect(e.details[7].message).toEqual('"expirationDate" must be a valid date');
            expect(e.details[8].message).toContain('"dayOfWeek" must be one of');
            expect(e.details[9].message).toEqual('"dayOfWeek" must be a string');
            expect(e.details[10].message).toEqual('"userId" must be a string');
        }
    }));
});
//# sourceMappingURL=PromotionQueryValidation.test.js.map