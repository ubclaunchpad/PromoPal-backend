import { getCustomRepository } from 'typeorm';
import { User } from '../../main/entity/User';
import { UserRepository } from '../../main/repository/UserRepository';
import connection from './BaseRepositoryTest';
import { UserFactory } from '../factory/UserFactory';

describe('Unit tests for UserRepository', function () {
  let userRepository: UserRepository;

  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await connection.clear();
    userRepository = getCustomRepository(UserRepository);
  });

  test('Should be able to store a user and successfully retrieve the same user', async () => {
    const expectedUser: User = new UserFactory().generate();
    await userRepository.save(expectedUser);
    const user = await userRepository.findOne(expectedUser.id);
    expect(user).toBeDefined();
    expect(user!.id).toEqual(expectedUser.id);
  });

  test('Should not be able to add two users with the same username', async () => {
    const userName = 'userName';
    const user1 = new UserFactory().generate();
    const user2 = new UserFactory().generate();
    user1.username = userName;
    user2.username = userName;
    await userRepository.save(user1);
    try {
      await userRepository.save(user2);
      fail('Should  have failed');
    } catch (e) {
      expect(e.detail).toEqual(`Key (username)=(${userName}) already exists.`);
    }
  });
});
