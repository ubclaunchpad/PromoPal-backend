import { DiscountType } from '../../main/data/DiscountType';
import { PromotionQueryValidation } from '../../main/validation/PromotionQueryValidation';
import { CuisineType } from '../../main/data/CuisineType';
import { PromotionType } from '../../main/data/PromotionType';
import { Day } from '../../main/data/Day';
import { SortOptions } from '../../main/data/SortOptions';

describe('Unit tests for PromotionQueryValidation', function () {
  // mark these types as any so that we can make them improper
  let promotionQueryDTO: any;

  beforeEach(() => {
    promotionQueryDTO = {
      promotionType: PromotionType.HAPPY_HOUR,
      cuisine: CuisineType.VIETNAMESE,
      discountType: DiscountType.AMOUNT,
      discountValue: 2,
      expirationDate: '2020-11-09 03:39:40.395843',
      dayOfWeek: Day.THURSDAY,
      searchQuery: 'promo',
      userId: 'b271dde4-c938-4dd4-aba6-cdcd23b9194d',
    };
  });

  test('Should return no errors for a valid promotionQueryDTO', async () => {
    try {
      await PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
        abortEarly: false,
      });
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Should fail if undefined', async () => {
    try {
      await PromotionQueryValidation.schema.validateAsync(undefined, {
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
      promotionQueryDTO.promotionType = 'Invalid Promotion Type';
      await PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
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
      promotionQueryDTO.cuisine = 'Invalid Cuisine';
      await PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toContain('"cuisine" must be one of');
    }
  });

  test('Should pass for valid cuisine type', async () => {
    try {
      promotionQueryDTO.cuisine = CuisineType.AFGHAN;
      await PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
        abortEarly: false,
      });
    } catch (e) {
      fail('Should not have failed');
    }
  });

  test('Should pass for array of cuisine types', async () => {
    try {
      promotionQueryDTO.cuisine = [
        CuisineType.CARIBBEAN,
        CuisineType.CAJUN,
        CuisineType.AINU,
      ];
      await PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
        abortEarly: false,
      });
    } catch (e) {
      fail('Should not have failed');
    }
  });

  test('Should pass for single cuisine in array', async () => {
    try {
      promotionQueryDTO.cuisine = [CuisineType.CARIBBEAN];
      await PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
        abortEarly: false,
      });
    } catch (e) {
      fail('Should not have failed');
    }
  });

  test('Should fail for empty cuisine array', async () => {
    try {
      promotionQueryDTO.cuisine = [];
      await PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toContain(
        '"cuisine" does not match any of the allowed types'
      );
    }
  });

  test('Should fail if element in array is not valid cuisine', async () => {
    try {
      promotionQueryDTO.cuisine = [
        CuisineType.CARIBBEAN,
        'Non-existent cuisine type',
      ];
      await PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toContain(
        '"cuisine" does not match any of the allowed types'
      );
    }
  });

  test('Should fail if cuisine is unparsed json', async () => {
    try {
      promotionQueryDTO.cuisine = JSON.stringify([
        CuisineType.CARIBBEAN,
        CuisineType.CAJUN,
      ]);
      await PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toContain('"cuisine" must be one of');
    }
  });

  test('Should fail if given incorrect discount type', async () => {
    try {
      promotionQueryDTO.discountType = 'Invalid Discount Type';
      await PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual(
        '"discountType" must be one of [%, $, Other]'
      );
    }
  });

  test('Should fail if given incorrect date', async () => {
    try {
      promotionQueryDTO.expirationDate = 'Invalid Date';
      await PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual(
        '"expirationDate" must be a valid date'
      );
    }
  });

  test('Should fail if discountValue is negative', async () => {
    try {
      promotionQueryDTO.discountValue = -1;
      await PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual(
        '"discountValue" must be a positive number'
      );
    }
  });

  test('Should be valid if discountValue is more than 2 decimals and should round as well', async () => {
    try {
      promotionQueryDTO.discountValue = 1.8123;
      const result = await PromotionQueryValidation.schema.validateAsync(
        promotionQueryDTO,
        {
          abortEarly: false,
        }
      );
      expect(result.discountValue).toEqual(1.81);
    } catch (e) {
      fail('Should not have failed');
    }
  });

  test('Should fail if discountValue is present, but discountType is not', async () => {
    try {
      promotionQueryDTO.discountValue = 1.88;
      promotionQueryDTO.discountType = undefined;
      await PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual(
        '"discountValue" missing required peer "discountType"'
      );
    }
  });

  test('If discountValue is improper format and discountType is missing, report both errors', async () => {
    try {
      promotionQueryDTO.discountValue = -1;
      promotionQueryDTO.discountType = undefined;
      await PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(2);
      expect(e.details[0].message).toEqual(
        '"discountValue" must be a positive number'
      );
      expect(e.details[1].message).toEqual(
        '"discountValue" missing required peer "discountType"'
      );
    }
  });

  test('Should fail if given incorrect dayOfWeek', async () => {
    try {
      promotionQueryDTO.dayOfWeek = 'Invalid Day Of Week';
      await PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual(
        '"dayOfWeek" must be one of [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]'
      );
    }
  });

  test('Should be valid if given correct dayOfWeek', async () => {
    try {
      promotionQueryDTO.dayOfWeek = Day.MONDAY;
      await PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
        abortEarly: false,
      });
    } catch (e) {
      fail('Should not have failed');
    }
  });

  test('Should fail if userId is not uuid', async () => {
    try {
      promotionQueryDTO.userId = 'b271dde4-c938-4dd4-aba6-cdcd23b9194d0000';
      await PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual('"userId" must be a valid GUID');
    }
  });

  test('Should fail specify an unsupported sort option', async () => {
    try {
      promotionQueryDTO.sort = 'Non-existent-sort-option';
      await PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toContain('"sort" must be one of');
    }
  });

  test('Should fail if specify sort by distance, but lat and lon are missing', async () => {
    try {
      promotionQueryDTO.sort = SortOptions.DISTANCE;
      promotionQueryDTO.lat = undefined;
      promotionQueryDTO.lon = undefined;
      await PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(2);
      expect(e.details[0].message).toContain('"lat" is required');
      expect(e.details[1].message).toContain('"lon" is required');
    }
  });

  test('Should not fail if specify sort that is not distance and lat/lon are missing', async () => {
    try {
      promotionQueryDTO.sort = SortOptions.RECENCY;
      promotionQueryDTO.lat = undefined;
      promotionQueryDTO.lon = undefined;
      await PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
        abortEarly: false,
      });
    } catch (e) {
      fail('Should not have failed');
    }
  });

  test('Should fail if any fields are the wrong type', async () => {
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
      await PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(11);
      expect(e.details[0].message).toEqual('"searchQuery" must be a string');
      expect(e.details[1].message).toEqual(
        '"discountType" must be one of [%, $, Other]'
      );
      expect(e.details[2].message).toEqual('"discountType" must be a string');
      expect(e.details[3].message).toEqual('"discountValue" must be a number');
      expect(e.details[4].message).toContain('"promotionType" must be one of');
      expect(e.details[5].message).toEqual('"promotionType" must be a string');
      expect(e.details[6].message).toContain('"cuisine" must be one of');
      expect(e.details[7].message).toEqual(
        '"expirationDate" must be a valid date'
      );
      expect(e.details[8].message).toContain('"dayOfWeek" must be one of');
      expect(e.details[9].message).toEqual('"dayOfWeek" must be a string');
      expect(e.details[10].message).toEqual('"userId" must be a string');
    }
  });
});
