import { UserUpdateValidation } from '../../main/validation/UserUpdateValidation';

describe('Unit tests for UserUpdateValidation', function () {
  let userUpdateDTO: any;

  beforeEach(() => {
    userUpdateDTO = {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
    };
  });

  test('Should not return no errors for a valid userDTO', async () => {
    try {
      userUpdateDTO.username = 'testusername';
      await UserUpdateValidation.schema.validateAsync(userUpdateDTO, {
        abortEarly: false,
      });
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Should fail if undefined', async () => {
    try {
      await UserUpdateValidation.schema.validateAsync(undefined, {
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
      userUpdateDTO.email = 'invalid-email';
      await UserUpdateValidation.schema.validateAsync(userUpdateDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual('"email" must be a valid email');
    }
  });
});
