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
const PromotionType_1 = require("../../main/data/PromotionType");
const CuisineType_1 = require("../../main/data/CuisineType");
const DiscountType_1 = require("../../main/data/DiscountType");
const PromotionValidation_1 = require("../../main/validation/PromotionValidation");
const Day_1 = require("../../main/data/Day");
const ScheduleFactory_1 = require("../factory/ScheduleFactory");
describe('Unit tests for PromotionValidation', function () {
    let promotionDTO;
    let discountDTO;
    let schedulesDTO;
    beforeEach(() => {
        discountDTO = {
            discountValue: 12.99,
            discountType: DiscountType_1.DiscountType.AMOUNT,
        };
        schedulesDTO = [
            {
                startTime: '08:00',
                endTime: '10:00',
                dayOfWeek: Day_1.Day.THURSDAY,
                isRecurring: false,
            },
            {
                startTime: '1:59',
                endTime: '23:59',
                dayOfWeek: Day_1.Day.MONDAY,
                isRecurring: true,
            },
        ];
        promotionDTO = {
            promotionType: PromotionType_1.PromotionType.BOGO,
            cuisine: CuisineType_1.CuisineType.VIETNAMESE,
            description: 'description',
            discount: discountDTO,
            schedules: schedulesDTO,
            startDate: '2020-11-09 03:39:40.395843',
            expirationDate: '2020-11-09 03:39:40.395843',
            name: 'name',
            placeId: '123123123',
            userId: '56588b66-7bc3-4245-98c2-5e3d4e3bd2a6',
            address: '3094 Random Ave, Vancouver BC V1M0M4',
        };
    });
    test('Should return no errors for a valid promotionDTO', () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield PromotionValidation_1.PromotionValidation.schema.validateAsync(promotionDTO, {
                abortEarly: false,
            });
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Should fail if undefined', () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield PromotionValidation_1.PromotionValidation.schema.validateAsync(undefined, {
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
            promotionDTO.promotionType = 'Invalid Promotion Type';
            yield PromotionValidation_1.PromotionValidation.schema.validateAsync(promotionDTO, {
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
            promotionDTO.cuisine = 'Invalid Cuisine';
            yield PromotionValidation_1.PromotionValidation.schema.validateAsync(promotionDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toContain('"cuisine" must be one of');
        }
    }));
    test('Should fail if given invalid date format for expiration date', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionDTO.expirationDate = '2020-11-35 03:39:40.395843';
            yield PromotionValidation_1.PromotionValidation.schema.validateAsync(promotionDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(2);
            expect(e.details[0].message).toEqual('"expirationDate" must be a valid date');
            expect(e.details[1].message).toEqual('"startDate" date references "ref:expirationDate" which must have a valid date format');
        }
    }));
    test('Should fail if given invalid date format for start date', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionDTO.startDate = '2020-11-35 03:39:40.395843';
            yield PromotionValidation_1.PromotionValidation.schema.validateAsync(promotionDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"startDate" must be a valid date');
        }
    }));
    test('If start date is undefined, then default to current date', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionDTO.startDate = undefined;
            const result = yield PromotionValidation_1.PromotionValidation.schema.validateAsync(promotionDTO, {
                abortEarly: false,
            });
            expect(result.startDate).toBeDefined();
            expect(result.startDate).toBeInstanceOf(Date);
        }
        catch (e) {
            fail('Should not have failed');
        }
    }));
    test('If start date is null, then default to current date', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionDTO.startDate = null;
            const result = yield PromotionValidation_1.PromotionValidation.schema.validateAsync(promotionDTO, {
                abortEarly: false,
            });
            expect(result.startDate).toBeDefined();
            expect(result.startDate).toBeInstanceOf(Date);
        }
        catch (e) {
            fail('Should not have failed');
        }
    }));
    test('Start date cannot be greater than expiration date', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionDTO.startDate = '2020-11-20T07:51:45.822Z';
            promotionDTO.expirationDate = '2020-11-20T07:51:44.822Z';
            yield PromotionValidation_1.PromotionValidation.schema.validateAsync(promotionDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"startDate" must be less than or equal to "ref:expirationDate"');
        }
    }));
    test('Start date can be equal to expiration date', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionDTO.startDate = '2020-11-20T07:51:44.822Z';
            promotionDTO.expirationDate = '2020-11-20T07:51:44.822Z';
            yield PromotionValidation_1.PromotionValidation.schema.validateAsync(promotionDTO, {
                abortEarly: false,
            });
        }
        catch (e) {
            fail('Should not have failed');
        }
    }));
    test('Start date can be less than expiration date', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionDTO.startDate = '2020-11-20T07:51:43.822Z';
            promotionDTO.expirationDate = '2020-11-20T07:51:44.822Z';
            yield PromotionValidation_1.PromotionValidation.schema.validateAsync(promotionDTO, {
                abortEarly: false,
            });
        }
        catch (e) {
            fail('Should not have failed');
        }
    }));
    test('Should fail if given invalid userId', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionDTO.userId = '56588b66-7bc3-4245-98c2-5e3d4e3bd2a';
            yield PromotionValidation_1.PromotionValidation.schema.validateAsync(promotionDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"userId" must be a valid GUID');
        }
    }));
    test('Should fail if promotion.discount is invalid', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionDTO.discount = {
                discountType: 'Invalid Type',
                discountValue: -1,
            };
            yield PromotionValidation_1.PromotionValidation.schema.validateAsync(promotionDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(2);
            expect(e.details[0].message).toEqual('"discount.discountType" must be one of [%, $, Other]');
            expect(e.details[1].message).toEqual('"discount.discountValue" must be a positive number');
        }
    }));
    test('Should fail if promotion schedules is undefined', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionDTO.schedules = undefined;
            yield PromotionValidation_1.PromotionValidation.schema.validateAsync(promotionDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"schedules" is required');
        }
    }));
    test('Should fail if promotion schedules is an empty array', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionDTO.schedules = [];
            yield PromotionValidation_1.PromotionValidation.schema.validateAsync(promotionDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(2);
            expect(e.details[0].message).toEqual('"schedules" does not contain 1 required value(s)');
            expect(e.details[1].message).toEqual('"schedules" must contain at least 1 items');
        }
    }));
    test('Should not fail if promotion schedules contains at least one schedule', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionDTO.schedules = [promotionDTO.schedules[0]];
            yield PromotionValidation_1.PromotionValidation.schema.validateAsync(promotionDTO, {
                abortEarly: false,
            });
        }
        catch (e) {
            fail('Should not have failed');
        }
    }));
    test('Should fail if promotions schedules contains more than 7 schedules', () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const sourceSchedule = promotionDTO.schedules[0];
            promotionDTO.schedules = [];
            for (let i = 0; i <= 7; i++) {
                const newSchedule = {};
                Object.assign(newSchedule, sourceSchedule);
                promotionDTO.schedules.push(newSchedule);
            }
            expect((_a = promotionDTO.schedules) === null || _a === void 0 ? void 0 : _a.length).toEqual(8);
            yield PromotionValidation_1.PromotionValidation.schema.validateAsync(promotionDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(2);
            expect(e.details[0].message).toEqual('"schedules[1]" contains a duplicate value');
            expect(e.details[1].message).toEqual('"schedules" must contain less than or equal to 7 items');
        }
    }));
    test('Should be valid if promotions schedules contains 7 schedules', () => __awaiter(this, void 0, void 0, function* () {
        var _b;
        try {
            const sourceSchedule = promotionDTO.schedules[0];
            promotionDTO.schedules = [];
            const days = Object.values(Day_1.Day);
            for (let i = 0; i <= 6; i++) {
                const newSchedule = { dayOfWeek: '' };
                Object.assign(newSchedule, sourceSchedule);
                newSchedule.dayOfWeek = days[i];
                promotionDTO.schedules.push(newSchedule);
            }
            expect((_b = promotionDTO.schedules) === null || _b === void 0 ? void 0 : _b.length).toEqual(7);
            yield PromotionValidation_1.PromotionValidation.schema.validateAsync(promotionDTO, {
                abortEarly: false,
            });
        }
        catch (e) {
            fail('Should not have failed');
        }
    }));
    test('Should fail if property inside promotion schedules is invalid', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionDTO.schedules[0].isRecurring = 'Should be a boolean';
            yield PromotionValidation_1.PromotionValidation.schema.validateAsync(promotionDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"schedules[0].isRecurring" must be a boolean');
        }
    }));
    test('Should fail if promotion.schedules is not array of ScheduleDTO', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionDTO.schedules = [1, 2];
            yield PromotionValidation_1.PromotionValidation.schema.validateAsync(promotionDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(3);
            expect(e.details[0].message).toEqual('"schedules[0]" must be of type object');
            expect(e.details[1].message).toEqual('"schedules[1]" must be of type object');
            expect(e.details[2].message).toEqual('"schedules" does not contain 1 required value(s)');
        }
    }));
    test('Should fail if save promotion.schedules contains two schedules with the same dayOfWeek', () => __awaiter(this, void 0, void 0, function* () {
        try {
            const schedule1 = new ScheduleFactory_1.ScheduleFactory().generate();
            const schedule2 = new ScheduleFactory_1.ScheduleFactory().generate();
            schedule1.dayOfWeek = schedule2.dayOfWeek;
            promotionDTO.schedules = [schedule1, schedule2];
            yield PromotionValidation_1.PromotionValidation.schema.validateAsync(promotionDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"schedules[1]" contains a duplicate value');
        }
    }));
    test('Should fail if address is undefined', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionDTO.address = undefined;
            yield PromotionValidation_1.PromotionValidation.schema.validateAsync(promotionDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"address" is required');
        }
    }));
    test('Should fail if any fields are the wrong type', () => __awaiter(this, void 0, void 0, function* () {
        try {
            promotionDTO = {
                promotionType: 'string',
                cuisine: 'string',
                description: 1,
                discount: discountDTO,
                schedules: '1231823',
                startDate: true,
                expirationDate: true,
                name: 3,
                placeId: 4,
                userId: false,
                address: 5,
            };
            yield PromotionValidation_1.PromotionValidation.schema.validateAsync(promotionDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(10);
            expect(e.details[0].message).toEqual('"userId" must be a string');
            expect(e.details[1].message).toEqual('"placeId" must be a string');
            expect(e.details[2].message).toEqual('"schedules" must be an array');
            expect(e.details[3].message).toContain('"promotionType" must be one of');
            expect(e.details[4].message).toContain('"cuisine" must be one of');
            expect(e.details[5].message).toEqual('"name" must be a string');
            expect(e.details[6].message).toEqual('"description" must be a string');
            expect(e.details[7].message).toEqual('"expirationDate" must be a valid date');
            expect(e.details[8].message).toEqual('"startDate" must be a valid date');
            expect(e.details[9].message).toEqual('"address" must be a string');
        }
    }));
});
//# sourceMappingURL=PromotionValidation.test.js.map