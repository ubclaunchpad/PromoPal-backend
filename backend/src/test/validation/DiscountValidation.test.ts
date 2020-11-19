import { DiscountType } from '../../main/data/DiscountType';
import { DiscountValidation } from '../../main/validation/DiscountValidation';

describe('Unit tests for DiscountValidation', function () {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  // mark these types as any so that we can make them improper
  let discountDTO: any;

  beforeEach(() => {
    discountDTO = {
      discountValue: 12.99,
      discountType: DiscountType.AMOUNT,
    };
  });

  test('Should return no errors for a valid discountDTO', async () => {
    try {
      await DiscountValidation.schema.validateAsync(discountDTO, {
        abortEarly: false,
      });
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Should fail if undefined', async () => {
    try {
      await DiscountValidation.schema.validateAsync(undefined, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual('"value" is required');
    }
  });

  test('Should fail if given incorrect discount type', async () => {
    try {
      discountDTO.discountType = 'Invalid Discount Type';
      await DiscountValidation.schema.validateAsync(discountDTO, {
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

  test('Should fail if given negative discountValue', async () => {
    try {
      discountDTO.discountValue = -1;
      await DiscountValidation.schema.validateAsync(discountDTO, {
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

  test('Should fail if given discountValue with more than two decimal places', async () => {
    try {
      discountDTO.discountValue = 10.999;
      await DiscountValidation.schema.validateAsync(discountDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual(
        '"discountValue" must have no more than 2 decimal places'
      );
    }
  });

  test('Should fail if any fields are the wrong type', async () => {
    try {
      discountDTO = {
        discountValue: '12.99',
        discountType: true,
      };
      await DiscountValidation.schema.validateAsync(discountDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(3);
      expect(e.details[0].message).toEqual(
        '"discountType" must be one of [%, $, Other]'
      );
      expect(e.details[1].message).toEqual('"discountType" must be a string');
      expect(e.details[2].message).toEqual('"discountValue" must be a number');
    }
  });
});
