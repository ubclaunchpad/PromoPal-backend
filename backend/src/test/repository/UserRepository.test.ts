import { getConnection, getCustomRepository } from 'typeorm';
import { User } from '../../main/entity/User';
import { promotions_sample, saved_promotions_mapping, users_sample } from '../../main/resources/Data';
import { UserRepository } from '../../main/repository/UserRepository';
import { BaseRepositoryTest } from './BaseRepositoryTest';

describe('Unit tests for UserRepository', function () {
  let userRepository: UserRepository;
  beforeEach(() => {
    return BaseRepositoryTest.establishTestConnection().then(() => {
      userRepository = getCustomRepository(UserRepository);
    });
  });

  afterEach(() => {
    const conn = getConnection();
    return conn.close();
  });

  test('Should be able to store a user and successfully retrieve the same user', async () => {
    const expectedUser: User = users_sample[0];
    await userRepository.save(expectedUser);
    const user = await userRepository.findOne(expectedUser.id);
    expect(user).toEqual(expectedUser);
  });

  test('Should not be able to add two users with the same username', async () => {
    users_sample[1].username = users_sample[0].username;
    await userRepository.save(users_sample[0]);
    try {
      await userRepository.save(users_sample[1]);
      fail('Should  have failed');
    } catch (e) {
      expect(e.detail).toEqual(
        `Key (username)=(${users_sample[0].username}) already exists.`
      );
    }
  });

  test('Should not be able to add two users with the same email', async () => {
    users_sample[1].email = users_sample[0].email;
    await userRepository.save(users_sample[0]);
    try {
      await userRepository.save(users_sample[1]);
      fail('Should  have failed');
    } catch (e) {
      expect(e.detail).toEqual(
        `Key (email)=(${users_sample[0].email}) already exists.`
      );
    }
  });

  test('Should not be able to add two users with the same password', async () => {
    users_sample[1].password = users_sample[0].password;
    await userRepository.save(users_sample[0]);
    try {
      await userRepository.save(users_sample[1]);
      fail('Should  have failed');
    } catch (e) {
      expect(e.detail).toEqual(
        `Key (password)=(${users_sample[0].password}) already exists.`
      );
    }
  });

  test('Should be able to add promotion into saved promotion', async () => {
    const before_add_saved = saved_promotions_mapping.get(users_sample[2])?.length;
    let result;
    try {
      await userRepository.save(users_sample[2]);
      result = await userRepository.addSavedPromotion(users_sample[2], promotions_sample[2]);
    } catch(e) {
      fail('Shouh have added');
    }
    const after_add_saved = saved_promotions_mapping.get(users_sample[2])?.length;
    if (before_add_saved) expect(after_add_saved).toEqual(before_add_saved + 1);
  });
  test('Should not be able to add promotion into saved promotion', async () => {
    const before_add_saved = saved_promotions_mapping.get(users_sample[2])?.length;
    let result;
    try {
      await userRepository.save(users_sample[2]);
      result = await userRepository.addSavedPromotion(users_sample[2], promotions_sample[0]);
      fail("Should have failed");
    } catch(e) {
      const after_add_saved = saved_promotions_mapping.get(users_sample[2])?.length;
      if (before_add_saved) expect(after_add_saved).toEqual(before_add_saved);
    }
  });
});
