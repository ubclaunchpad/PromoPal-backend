import { getConnection, getCustomRepository } from 'typeorm';
import { User } from '../../main/entity/User';
import { users_sample } from '../../main/resources/Data';
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
});
