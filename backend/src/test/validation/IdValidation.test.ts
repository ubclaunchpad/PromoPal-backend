import { IdValidation } from '../../main/validation/IdValidation';

describe('Unit tests for IdValidation', function () {
  // mark these types as any so that we can make them improper
  let id: any;

  beforeEach(() => {
    id = '4aa10542-8441-427b-be51-1e5a4096aea9';
  });

  test('Should return no errors for a valid id', async () => {
    try {
      await IdValidation.schema.validateAsync(id, {
        abortEarly: false,
      });
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Should fail if undefined', async () => {
    try {
      await IdValidation.schema.validateAsync(undefined, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual('"value" is required');
    }
  });

  test('Should fail if given id is incorrect', async () => {
    try {
      id = 'Invalid Id';
      await IdValidation.schema.validateAsync(id, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual('"value" must be a valid GUID');
    }
  });
});
