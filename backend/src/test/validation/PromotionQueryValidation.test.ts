import { DiscountType } from '../../main/data/DiscountType';
import { PromotionQueryValidation } from '../../main/validation/PromotionQueryValidation';
import { CuisineType } from '../../main/data/CuisineType';
import { PromotionCategory } from '../../main/data/PromotionCategory';

describe('Unit tests for PromotionQueryValidation', function () {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  // mark these types as any so that we can make them improper
  let promotionQueryDTO: any;

  beforeEach(() => {
    promotionQueryDTO = {
      category: PromotionCategory.HAPPY_HOUR,
      cuisine: CuisineType.VIETNAMESE,
      discountType: DiscountType.AMOUNT,
      expirationDate: '2020-11-09 03:39:40.395843',
      name: 'promo',
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

  test('Should fail if given incorrect category type', async () => {
    try {
      promotionQueryDTO.category = 'Invalid Category';
      await PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual(
        '"category" must be one of [Bogo, Happy Hour, Other]'
      );
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
      expect(e.details[0].message).toEqual(
        '"cuisine" must be one of [Caribbean, Vietnamese, Korean, Japanese, Other]'
      );
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

  test('Should fail if any fields are the wrong type', async () => {
    try {
      promotionQueryDTO = {
        category: 1,
        cuisine: 'string',
        discountType: false,
        expirationDate: true,
        name: 1,
      };
      await PromotionQueryValidation.schema.validateAsync(promotionQueryDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(7);
      expect(e.details[0].message).toEqual('"name" must be a string');
      expect(e.details[1].message).toEqual(
        '"discountType" must be one of [%, $, Other]'
      );
      expect(e.details[2].message).toEqual('"discountType" must be a string');
      expect(e.details[3].message).toEqual(
        '"category" must be one of [Bogo, Happy Hour, Other]'
      );
      expect(e.details[4].message).toEqual('"category" must be a string');
      expect(e.details[5].message).toEqual(
        '"cuisine" must be one of [Caribbean, Vietnamese, Korean, Japanese, Other]'
      );
      expect(e.details[6].message).toEqual(
        '"expirationDate" must be a valid date'
      );
    }
  });
});
