import { PromotionType } from '../../main/data/PromotionType';
import { CuisineType } from '../../main/data/CuisineType';
import { DiscountType } from '../../main/data/DiscountType';
import { PromotionValidation } from '../../main/validation/PromotionValidation';

describe('Unit tests for PromotionValidation', function () {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  // mark these types as any so that we can make them improper
  let promotionDTO: any;
  let discountDTO: any;

  beforeEach(() => {
    discountDTO = {
      discountValue: 12.99,
      discountType: DiscountType.AMOUNT,
    };
    promotionDTO = {
      promotionType: PromotionType.BOGO,
      cuisine: CuisineType.VIETNAMESE,
      description: 'description',
      discount: discountDTO,
      expirationDate: '2020-11-09 03:39:40.395843',
      name: 'name',
      placeId: '123123123',
      userId: '56588b66-7bc3-4245-98c2-5e3d4e3bd2a6',
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

  test('Should fail if given invalid date format', async () => {
    try {
      promotionDTO.expirationDate = '2020-11-35 03:39:40.395843';
      await PromotionValidation.schema.validateAsync(promotionDTO, {
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

  test('Should fail if any fields are the wrong type', async () => {
    try {
      promotionDTO = {
        promotionType: 'string',
        cuisine: 'string',
        description: 1,
        discount: discountDTO,
        expirationDate: true,
        name: 3,
        placeId: 4,
        userId: false,
      };
      await PromotionValidation.schema.validateAsync(promotionDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(7);
      expect(e.details[0].message).toEqual('"userId" must be a string');
      expect(e.details[1].message).toEqual('"placeId" must be a string');
      expect(e.details[2].message).toContain('"promotionType" must be one of');
      expect(e.details[3].message).toContain('"cuisine" must be one of');
      expect(e.details[4].message).toEqual('"name" must be a string');
      expect(e.details[5].message).toEqual('"description" must be a string');
      expect(e.details[6].message).toEqual(
        '"expirationDate" must be a valid date'
      );
    }
  });
});
