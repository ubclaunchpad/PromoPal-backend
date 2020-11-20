import { UserValidation } from '../../main/validation/UserValidation';

describe('Unit tests for UserValidation', function () {
  let userDTO: UserValidation;

  beforeEach(() => {
    userDTO = {
      username: 'testusername',
      firstName: 'testfirstname',
      lastName: 'testlastname',
      email: 'test@sample.com',
      password: 'testpassword',
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

  test('Should fail if invalid password', async () => {
    try {
      userDTO.password = 'invalid';
      await UserValidation.schema.validateAsync(userDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual(
        '"password" length must be at least 8 characters long'
      );
    }
  });
});
