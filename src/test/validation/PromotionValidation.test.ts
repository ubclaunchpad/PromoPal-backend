import { PromotionType } from '../../main/data/PromotionType';
import { CuisineType } from '../../main/data/CuisineType';
import { DiscountType } from '../../main/data/DiscountType';
import { PromotionValidation } from '../../main/validation/PromotionValidation';
import { Day } from '../../main/data/Day';
import { ScheduleFactory } from '../factory/ScheduleFactory';

describe('Unit tests for PromotionValidation', function () {
  // mark these types as any so that we can make them improper
  let promotionDTO: any;
  let discountDTO: any;
  let schedulesDTO: any;

  beforeEach(() => {
    discountDTO = {
      discountValue: 12.99,
      discountType: DiscountType.AMOUNT,
    };
    schedulesDTO = [
      {
        startTime: '08:00',
        endTime: '10:00',
        dayOfWeek: Day.THURSDAY,
        isRecurring: false,
      },
      {
        startTime: '1:59',
        endTime: '23:59',
        dayOfWeek: Day.MONDAY,
        isRecurring: true,
      },
    ];
    promotionDTO = {
      promotionType: PromotionType.BOGO,
      cuisine: CuisineType.VIETNAMESE,
      description: 'description',
      discount: discountDTO,
      schedules: schedulesDTO,
      startDate: '2020-11-09 03:39:40.395843',
      expirationDate: '2020-11-09 03:39:40.395843',
      name: 'name',
      placeId: '123123123',
      userId: '56588b66-7bc3-4245-98c2-5e3d4e3bd2a6',
      lat: 34.0,
      lon: -43.2,
      restaurantName: 'restaurantName',
    };
  });

  test('Should return no errors for a valid promotionDTO', async () => {
    try {
      await PromotionValidation.schema.validateAsync(promotionDTO, {
        abortEarly: false,
      });
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Should fail if undefined', async () => {
    try {
      await PromotionValidation.schema.validateAsync(undefined, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual('"value" is required');
    }
  });

  test('Should fail if given incorrect promotion type', async () => {
    try {
      promotionDTO.promotionType = 'Invalid Promotion Type';
      await PromotionValidation.schema.validateAsync(promotionDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toContain('"promotionType" must be one of');
    }
  });

  test('Should fail if given incorrect cuisine type', async () => {
    try {
      promotionDTO.cuisine = 'Invalid Cuisine';
      await PromotionValidation.schema.validateAsync(promotionDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toContain('"cuisine" must be one of');
    }
  });

  test('Should fail if given invalid date format for expiration date', async () => {
    try {
      promotionDTO.expirationDate = '2020-11-35 03:39:40.395843';
      await PromotionValidation.schema.validateAsync(promotionDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(2);
      expect(e.details[0].message).toEqual(
        '"expirationDate" must be a valid date'
      );
      expect(e.details[1].message).toEqual(
        '"startDate" date references "ref:expirationDate" which must have a valid date format'
      );
    }
  });

  test('Should fail if given invalid date format for start date', async () => {
    try {
      promotionDTO.startDate = '2020-11-35 03:39:40.395843';
      await PromotionValidation.schema.validateAsync(promotionDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual('"startDate" must be a valid date');
    }
  });

  test('If start date is undefined, then default to current date', async () => {
    try {
      promotionDTO.startDate = undefined;
      const result = await PromotionValidation.schema.validateAsync(
        promotionDTO,
        {
          abortEarly: false,
        }
      );
      expect(result.startDate).toBeDefined();
      expect(result.startDate).toBeInstanceOf(Date);
    } catch (e) {
      fail('Should not have failed');
    }
  });

  test('If start date is null, then default to current date', async () => {
    try {
      promotionDTO.startDate = null;
      const result = await PromotionValidation.schema.validateAsync(
        promotionDTO,
        {
          abortEarly: false,
        }
      );
      expect(result.startDate).toBeDefined();
      expect(result.startDate).toBeInstanceOf(Date);
    } catch (e) {
      fail('Should not have failed');
    }
  });

  test('Start date cannot be greater than expiration date', async () => {
    try {
      promotionDTO.startDate = '2020-11-20T07:51:45.822Z'; // greater by 1 second
      promotionDTO.expirationDate = '2020-11-20T07:51:44.822Z';
      await PromotionValidation.schema.validateAsync(promotionDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual(
        '"startDate" must be less than or equal to "ref:expirationDate"'
      );
    }
  });

  test('Start date can be equal to expiration date', async () => {
    try {
      promotionDTO.startDate = '2020-11-20T07:51:44.822Z';
      promotionDTO.expirationDate = '2020-11-20T07:51:44.822Z';
      await PromotionValidation.schema.validateAsync(promotionDTO, {
        abortEarly: false,
      });
    } catch (e) {
      fail('Should not have failed');
    }
  });

  test('Start date can be less than expiration date', async () => {
    try {
      promotionDTO.startDate = '2020-11-20T07:51:43.822Z'; // less by 1 second
      promotionDTO.expirationDate = '2020-11-20T07:51:44.822Z';
      await PromotionValidation.schema.validateAsync(promotionDTO, {
        abortEarly: false,
      });
    } catch (e) {
      fail('Should not have failed');
    }
  });

  test('Should fail if given invalid userId', async () => {
    try {
      promotionDTO.userId = '56588b66-7bc3-4245-98c2-5e3d4e3bd2a'; // missing digit at end
      await PromotionValidation.schema.validateAsync(promotionDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual('"userId" must be a valid GUID');
    }
  });

  test('Should fail if promotion.discount is invalid', async () => {
    try {
      promotionDTO.discount = {
        discountType: 'Invalid Type',
        discountValue: -1,
      };
      await PromotionValidation.schema.validateAsync(promotionDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(2);
      expect(e.details[0].message).toEqual(
        '"discount.discountType" must be one of [%, $, Other]'
      );
      expect(e.details[1].message).toEqual(
        '"discount.discountValue" must be a positive number'
      );
    }
  });

  test('Should fail if promotion schedules is undefined', async () => {
    try {
      promotionDTO.schedules = undefined;
      await PromotionValidation.schema.validateAsync(promotionDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual('"schedules" is required');
    }
  });

  test('Should fail if promotion schedules is an empty array', async () => {
    try {
      promotionDTO.schedules = [];
      await PromotionValidation.schema.validateAsync(promotionDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(2);
      expect(e.details[0].message).toEqual(
        '"schedules" does not contain 1 required value(s)'
      );
      expect(e.details[1].message).toEqual(
        '"schedules" must contain at least 1 items'
      );
    }
  });

  test('Should not fail if promotion schedules contains at least one schedule', async () => {
    try {
      promotionDTO.schedules = [promotionDTO.schedules[0]];
      await PromotionValidation.schema.validateAsync(promotionDTO, {
        abortEarly: false,
      });
    } catch (e) {
      fail('Should not have failed');
    }
  });

  test('Should fail if promotions schedules contains more than 7 schedules', async () => {
    try {
      const sourceSchedule = promotionDTO.schedules[0];
      promotionDTO.schedules = [];
      for (let i = 0; i <= 7; i++) {
        const newSchedule = {};
        Object.assign(newSchedule, sourceSchedule);
        promotionDTO.schedules.push(newSchedule);
      }
      expect(promotionDTO.schedules?.length).toEqual(8);
      await PromotionValidation.schema.validateAsync(promotionDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(2);
      expect(e.details[0].message).toEqual(
        '"schedules[1]" contains a duplicate value'
      );
      expect(e.details[1].message).toEqual(
        '"schedules" must contain less than or equal to 7 items'
      );
    }
  });

  test('Should be valid if promotions schedules contains 7 schedules', async () => {
    try {
      const sourceSchedule = promotionDTO.schedules[0];
      promotionDTO.schedules = [];
      const days = Object.values(Day);
      for (let i = 0; i <= 6; i++) {
        const newSchedule = { dayOfWeek: '' };
        Object.assign(newSchedule, sourceSchedule);
        newSchedule.dayOfWeek = days[i];
        promotionDTO.schedules.push(newSchedule);
      }
      expect(promotionDTO.schedules?.length).toEqual(7);
      await PromotionValidation.schema.validateAsync(promotionDTO, {
        abortEarly: false,
      });
    } catch (e) {
      fail('Should not have failed');
    }
  });

  test('Should fail if property inside promotion schedules is invalid', async () => {
    try {
      promotionDTO.schedules[0].isRecurring = 'Should be a boolean';
      await PromotionValidation.schema.validateAsync(promotionDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual(
        '"schedules[0].isRecurring" must be a boolean'
      );
    }
  });

  test('Should fail if promotion.schedules is not array of ScheduleDTO', async () => {
    try {
      promotionDTO.schedules = [1, 2];
      await PromotionValidation.schema.validateAsync(promotionDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(3);
      expect(e.details[0].message).toEqual(
        '"schedules[0]" must be of type object'
      );
      expect(e.details[1].message).toEqual(
        '"schedules[1]" must be of type object'
      );
      expect(e.details[2].message).toEqual(
        '"schedules" does not contain 1 required value(s)'
      );
    }
  });

  test('Should fail if save promotion.schedules contains two schedules with the same dayOfWeek', async () => {
    try {
      const schedule1 = new ScheduleFactory().generate();
      const schedule2 = new ScheduleFactory().generate();
      schedule1.dayOfWeek = schedule2.dayOfWeek;
      promotionDTO.schedules = [schedule1, schedule2];
      await PromotionValidation.schema.validateAsync(promotionDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual(
        '"schedules[1]" contains a duplicate value'
      );
    }
  });

  test('Should fail if any fields are the wrong type', async () => {
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
        lat: '34.0',
        lon: '-43.2',
        restaurantName: 4,
      };
      await PromotionValidation.schema.validateAsync(promotionDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(12);
      expect(e.details[0].message).toEqual('"userId" must be a string');
      expect(e.details[1].message).toEqual('"placeId" must be a string');
      expect(e.details[2].message).toEqual('"schedules" must be an array');
      expect(e.details[3].message).toContain('"promotionType" must be one of');
      expect(e.details[4].message).toContain('"cuisine" must be one of');
      expect(e.details[5].message).toEqual('"name" must be a string');
      expect(e.details[6].message).toEqual('"description" must be a string');
      expect(e.details[7].message).toEqual(
        '"expirationDate" must be a valid date'
      );
      expect(e.details[8].message).toEqual('"startDate" must be a valid date');
      expect(e.details[9].message).toEqual('"lat" must be a number');
      expect(e.details[10].message).toEqual('"lon" must be a number');
      expect(e.details[11].message).toEqual(
        '"restaurantName" must be a string'
      );
    }
  });
});
