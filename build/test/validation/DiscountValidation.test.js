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
const DiscountValidation_1 = require("../../main/validation/DiscountValidation");
describe('Unit tests for DiscountValidation', function () {
    let discountDTO;
    beforeEach(() => {
        discountDTO = {
            discountValue: 12.99,
            discountType: DiscountType_1.DiscountType.AMOUNT,
        };
    });
    test('Should return no errors for a valid discountDTO', () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield DiscountValidation_1.DiscountValidation.schema.validateAsync(discountDTO, {
                abortEarly: false,
            });
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Should fail if undefined', () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield DiscountValidation_1.DiscountValidation.schema.validateAsync(undefined, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"value" is required');
        }
    }));
    test('Should fail if given incorrect discount type', () => __awaiter(this, void 0, void 0, function* () {
        try {
            discountDTO.discountType = 'Invalid Discount Type';
            yield DiscountValidation_1.DiscountValidation.schema.validateAsync(discountDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"discountType" must be one of [%, $, Other]');
        }
    }));
    test('Should fail if given negative discountValue', () => __awaiter(this, void 0, void 0, function* () {
        try {
            discountDTO.discountValue = -1;
            yield DiscountValidation_1.DiscountValidation.schema.validateAsync(discountDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"discountValue" must be a positive number');
        }
    }));
    test('Should fail if given discountValue with more than two decimal places', () => __awaiter(this, void 0, void 0, function* () {
        try {
            discountDTO.discountValue = 10.999;
            yield DiscountValidation_1.DiscountValidation.schema.validateAsync(discountDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"discountValue" must have no more than 2 decimal places');
        }
    }));
    test('Should fail if any fields are the wrong type', () => __awaiter(this, void 0, void 0, function* () {
        try {
            discountDTO = {
                discountValue: '12.99',
                discountType: true,
            };
            yield DiscountValidation_1.DiscountValidation.schema.validateAsync(discountDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(3);
            expect(e.details[0].message).toEqual('"discountType" must be one of [%, $, Other]');
            expect(e.details[1].message).toEqual('"discountType" must be a string');
            expect(e.details[2].message).toEqual('"discountValue" must be a number');
        }
    }));
});
//# sourceMappingURL=DiscountValidation.test.js.map