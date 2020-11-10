import { getConnection, getCustomRepository } from 'typeorm';
import { discounts_sample } from '../../main/resources/Data';
import { BaseRepositoryTest } from './BaseRepositoryTest';
import { Discount } from '../../main/entity/Discount';
import { DiscountRepository } from '../../main/repository/DiscountRepository';

describe('Unit tests for DiscountRepository', function () {
  let discountRepository: DiscountRepository;
  beforeEach(() => {
    return BaseRepositoryTest.establishTestConnection().then(() => {
      discountRepository = getCustomRepository(DiscountRepository);
    });
  });

  afterEach(() => {
    const conn = getConnection();
    return conn.close();
  });

  test('Should not be able to save a discount by itself', async () => {
    const discount: Discount = discounts_sample[0];
    try {
      await discountRepository.save(discount);
      fail('Should have failed');
    } catch (e) {
      expect(e.message).toBe(
        'null value in column "promotionId" violates not-null constraint'
      );
    }
  });
});
