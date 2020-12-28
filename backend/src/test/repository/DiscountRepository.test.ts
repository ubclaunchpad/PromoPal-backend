import { getCustomRepository } from 'typeorm';
import connection from './BaseRepositoryTest';
import { Discount } from '../../main/entity/Discount';
import { DiscountRepository } from '../../main/repository/DiscountRepository';
import { DiscountFactory } from '../factory/DiscountFactory';

describe('Unit tests for DiscountRepository', function () {
  let discountRepository: DiscountRepository;

  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await connection.clear();
    discountRepository = getCustomRepository(DiscountRepository);
  });

  test('Should not be able to create discount without promotion', async () => {
    const discount: Discount = new DiscountFactory().generate();
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
