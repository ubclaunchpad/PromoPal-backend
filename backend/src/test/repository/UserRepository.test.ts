import { getConnection, getCustomRepository } from 'typeorm';
import { User } from '../../main/entity/User';
import { users_sample } from '../../main/resources/Data';
import { UserRepository } from '../../main/repository/UserRepository';
import { BaseRepositoryTest } from './BaseRepositoryTest';

describe('Unit tests for UserRepository', function () {
  beforeEach(() => {
    return BaseRepositoryTest.establishTestConnection();
  });

  afterEach(() => {
    const conn = getConnection();
    return conn.close();
  });

  test('store Joe and fetch it', async () => {
    const expectedUser: User = users_sample[0];
    const userRepository: UserRepository = getCustomRepository(UserRepository);
    await userRepository.save(expectedUser);
    const user = await userRepository.find({ where: { id: expectedUser.id } });
    expect(user?.length === 1);
    expect(user[0].firstName).toBe(expectedUser.firstName);
  });
});
