import { getCustomRepository } from 'typeorm';
import connection from './BaseRepositoryTest';
import { RestaurantRepository } from '../../main/repository/RestaurantRepository';
import { RestaurantFactory } from '../factory/RestaurantFactory';

describe('Unit tests for RestaurantRepository', function () {
  let restaurantRepository: RestaurantRepository;

  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await connection.clear();
    restaurantRepository = getCustomRepository(RestaurantRepository);
  });

  test('Should not be able to create restaurant without promotion', async () => {
    const restaurant = new RestaurantFactory().generate();
    try {
      await restaurantRepository.save(restaurant);
      fail('Should have failed');
    } catch (e) {
      expect(e.message).toContain('violates not-null constraint');
    }
  });
});
