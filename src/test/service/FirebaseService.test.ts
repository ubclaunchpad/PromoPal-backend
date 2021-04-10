import { BaseController } from '../controller/BaseController';
import { FirebaseService } from '../../main/service/FirebaseService';

describe('tests for Firebase Service', function () {
  let firebaseService: FirebaseService;

  beforeAll(() => {
    firebaseService = new FirebaseService(BaseController.createFirebaseMock());
  });

  test('Should be able to create a user successfully', async () => {
    try {
      const expectedUid = 'a46562e7-419f-475d-b989-f7555014f784';
      const expectedEmail = 'test@gmail.com';
      const expectedPassword = 'test password';
      const result = await firebaseService.createUserFromEmailAndPassword(
        expectedUid,
        expectedEmail,
        expectedPassword
      );
      expect(result.uid).toEqual(expectedUid);
      expect(result.email).toEqual(expectedEmail);
    } catch (e) {
      fail('Did not expect to fail: ' + e.message);
    }
  });
});
