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
const ScheduleValidation_1 = require("../../main/validation/ScheduleValidation");
const Day_1 = require("../../main/data/Day");
describe('Unit tests for ScheduleValidation', function () {
    let scheduleDTO;
    beforeEach(() => {
        scheduleDTO = {
            startTime: '08:00',
            endTime: '10:00',
            dayOfWeek: Day_1.Day.THURSDAY,
            isRecurring: false,
        };
    });
    test('Should return no errors for a valid schedule', () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield ScheduleValidation_1.ScheduleValidation.schema.validateAsync(scheduleDTO, {
                abortEarly: false,
            });
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Should fail if undefined', () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield ScheduleValidation_1.ScheduleValidation.schema.validateAsync(undefined, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"value" is required');
        }
    }));
    test('Should fail if a schedule is not a day of the week', () => __awaiter(this, void 0, void 0, function* () {
        try {
            scheduleDTO.dayOfWeek = null;
            yield ScheduleValidation_1.ScheduleValidation.schema.validateAsync(scheduleDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(2);
            expect(e.details[0].message).toEqual('"dayOfWeek" must be one of [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]');
            expect(e.details[1].message).toEqual('"dayOfWeek" must be a string');
        }
    }));
    test('Should pass for valid start time', () => __awaiter(this, void 0, void 0, function* () {
        const times = [
            '01:00',
            '02:15',
            '03:59',
            '04:47',
            '11:59',
            '19:59',
            '20:01',
            '23:58',
        ];
        scheduleDTO.endTime = '23:59';
        for (const time of times) {
            try {
                scheduleDTO.startTime = time;
                yield ScheduleValidation_1.ScheduleValidation.schema.validateAsync(scheduleDTO, {
                    abortEarly: false,
                });
                yield ScheduleValidation_1.ScheduleValidation.schema.validateAsync(scheduleDTO, {
                    abortEarly: false,
                });
            }
            catch (e) {
                fail('Should not have failed');
            }
        }
    }));
    test('Should pass for valid end time', () => __awaiter(this, void 0, void 0, function* () {
        const times = [
            '1:00',
            '2:15',
            '3:59',
            '04:47',
            '11:59',
            '19:59',
            '20:01',
            '23:59',
        ];
        scheduleDTO.startTime = '00:00';
        for (const time of times) {
            try {
                scheduleDTO.endTime = time;
                yield ScheduleValidation_1.ScheduleValidation.schema.validateAsync(scheduleDTO, {
                    abortEarly: false,
                });
                yield ScheduleValidation_1.ScheduleValidation.schema.validateAsync(scheduleDTO, {
                    abortEarly: false,
                });
            }
            catch (e) {
                fail('Should not have failed');
            }
        }
    }));
    test('Should fail for any invalid start time', () => __awaiter(this, void 0, void 0, function* () {
        const times = ['1:60', '31:15', '24:01', '1:6'];
        scheduleDTO.endTime = '60:00';
        for (const time of times) {
            try {
                scheduleDTO.startTime = time;
                yield ScheduleValidation_1.ScheduleValidation.schema.validateAsync(scheduleDTO, {
                    abortEarly: false,
                });
                fail('Should have failed');
            }
            catch (e) {
                expect(e.details.length).toEqual(2);
                expect(e.details[0].message).toEqual(ScheduleValidation_1.START_TIME_FORMAT);
                expect(e.details[1].message).toEqual(ScheduleValidation_1.END_TIME_FORMAT);
            }
        }
    }));
    test('Should fail for any invalid end time', () => __awaiter(this, void 0, void 0, function* () {
        const times = ['1:60', '31:15', '24:01', '1:6'];
        scheduleDTO.startTime = '0:00';
        for (const time of times) {
            try {
                scheduleDTO.endTime = time;
                yield ScheduleValidation_1.ScheduleValidation.schema.validateAsync(scheduleDTO, {
                    abortEarly: false,
                });
                fail('Should have failed');
            }
            catch (e) {
                expect(e.details.length).toEqual(1);
                expect(e.details[0].message).toEqual(ScheduleValidation_1.END_TIME_FORMAT);
            }
        }
    }));
    test('Start time cannot be greater than end time', () => __awaiter(this, void 0, void 0, function* () {
        const startTimeEndTimePairs = [
            ['9:00', '8:00'],
            ['9:01', '9:00'],
            ['12:00', '11:59'],
        ];
        for (const startEndTimePair of startTimeEndTimePairs) {
            try {
                scheduleDTO.startTime = startEndTimePair[0];
                scheduleDTO.endTime = startEndTimePair[1];
                yield ScheduleValidation_1.ScheduleValidation.schema.validateAsync(scheduleDTO, {
                    abortEarly: false,
                });
                fail('Should have failed');
            }
            catch (e) {
                expect(e.details.length).toEqual(1);
                expect(e.details[0].message).toEqual(`Start time '${scheduleDTO.startTime}' must be less than end time '${scheduleDTO.endTime}'`);
            }
        }
    }));
    test('When time format is not the same, but is still valid should not fail', () => __awaiter(this, void 0, void 0, function* () {
        try {
            scheduleDTO.startTime = '08:00';
            scheduleDTO.endTime = '9:00';
            yield ScheduleValidation_1.ScheduleValidation.schema.validateAsync(scheduleDTO, {
                abortEarly: false,
            });
        }
        catch (e) {
            fail('Should not have failed');
        }
    }));
    test('When start time is valid, but end time is a different type, should not compare start and end time', () => __awaiter(this, void 0, void 0, function* () {
        try {
            scheduleDTO.startTime = '08:00';
            scheduleDTO.endTime = 8;
            yield ScheduleValidation_1.ScheduleValidation.schema.validateAsync(scheduleDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"endTime" must be a string');
        }
    }));
    test('When end time is valid, but start time is a different type, should not compare start and end time', () => __awaiter(this, void 0, void 0, function* () {
        try {
            scheduleDTO.startTime = false;
            scheduleDTO.endTime = '1:00';
            yield ScheduleValidation_1.ScheduleValidation.schema.validateAsync(scheduleDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"startTime" must be a string');
        }
    }));
    test('If start time greater than end time and end time invalid format, show both errors', () => __awaiter(this, void 0, void 0, function* () {
        try {
            scheduleDTO.startTime = '8:00';
            scheduleDTO.endTime = '1:72';
            yield ScheduleValidation_1.ScheduleValidation.schema.validateAsync(scheduleDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(2);
            expect(e.details[0].message).toEqual("Start time '8:00' must be less than end time '1:72'");
            expect(e.details[1].message).toEqual('Invalid 24 hour format for end time');
        }
    }));
    test('Should fail if incorrect types', () => __awaiter(this, void 0, void 0, function* () {
        try {
            scheduleDTO = {
                startTime: '138:00',
                endTime: -1,
                dayOfWeek: true,
                isRecurring: 'hello',
            };
            yield ScheduleValidation_1.ScheduleValidation.schema.validateAsync(scheduleDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(5);
            expect(e.details[0].message).toEqual('Invalid 24 hour format for start time');
            expect(e.details[1].message).toEqual('"endTime" must be a string');
            expect(e.details[2].message).toEqual('"isRecurring" must be a boolean');
            expect(e.details[3].message).toEqual('"dayOfWeek" must be one of [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]');
            expect(e.details[4].message).toEqual('"dayOfWeek" must be a string');
        }
    }));
});
//# sourceMappingURL=ScheduleValidation.test.js.map