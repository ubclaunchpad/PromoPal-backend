import { UserValidation } from '../../main/validation/UserValidation';

describe('Unit tests for UserValidation', function () {
  let userDTO: any;

  beforeEach(() => {
    userDTO = {
      username: 'testusername',
      firstName: 'testfirstname',
      lastName: 'testlastname',
      email: 'test@sample.com',
      firebaseId: 'testidfirebase',
    };
  });

  test('Should not return no errors for a valid userDTO', async () => {
    try {
      await UserValidation.schema.validateAsync(userDTO, {
        abortEarly: false,
      });
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Should fail if undefined', async () => {
    try {
      await UserValidation.schema.validateAsync(undefined, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual('"value" is required');
    }
  });

  test('Should fail if invalid email', async () => {
    try {
      userDTO.email = 'invalid-email';
      await UserValidation.schema.validateAsync(userDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual('"email" must be a valid email');
    }
  });
});
