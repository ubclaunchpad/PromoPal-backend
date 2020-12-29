import { getConnection, getCustomRepository, Connection } from 'typeorm';
import { users_sample, promotions_sample } from '../../main/resources/Data';
import connection from './BaseRepositoryTest';
import { SavedPromotionRepository } from '../../main/repository/SavedPromotionRepository';
import { UserRepository } from '../../main/repository/UserRepository';
import { PromotionRepository } from '../../main/repository/PromotionRepository';
import { User } from '../..//main/entity/User';
import { Promotion } from '../../main/entity/Promotion';

describe('Unit tests for SavedPromotionRepository', function () {
  let savedPromotionRepository: SavedPromotionRepository;
  let userRepository: UserRepository;
  let promotionRepository: PromotionRepository;
  beforeAll( async () => {
    await connection.create();
  });

  afterAll( async () => {
    await connection.close();
  });

  beforeEach( async () => {
    await connection.clear();
    savedPromotionRepository = getCustomRepository(SavedPromotionRepository);
    userRepository = getCustomRepository(UserRepository);
    promotionRepository = getCustomRepository(PromotionRepository);
  });

  test('Should be able to store a savedpromotion and successfully retrieve the saved promotion', async () => {
    const user: User = users_sample[0];
    const promotion: Promotion = promotions_sample[0];
    await userRepository.save(user);
    await promotionRepository.save(promotion);

    await savedPromotionRepository.addSavedPromotion(user, promotion);
    const savedpromotion = await savedPromotionRepository.findOne({
      user: user,
      promotion: promotion,
    });
    expect(savedpromotion).toBeDefined();
    expect(savedpromotion!.userId).toEqual(user.id);
    expect(savedpromotion!.promotionId).toEqual(promotion.id);
  });

  test('Should not able to store two same promotion for one user', async () => {
    const user: User = users_sample[0];
    const promotion: Promotion = promotions_sample[0];
    await userRepository.save(user);
    await promotionRepository.save(promotion);
    await savedPromotionRepository.addSavedPromotion(user, promotion);
    try {
      await savedPromotionRepository.addSavedPromotion(user, promotion);
      fail('Should have failed');
    } catch (e) {
      expect(e.detail).toEqual(
        `Key (\"userId\", \"promotionId\")=(${user.id}, ${promotion.id}) already exists.`
      );
    }
  });

  test('Should be able to store a savedpromotion and successfully delete the saved promotion', async () => {
    const user: User = users_sample[0];
    const promotion: Promotion = promotions_sample[0];
    await userRepository.save(user);
    await promotionRepository.save(promotion);
    await savedPromotionRepository.addSavedPromotion(user, promotion);
    try {
      await savedPromotionRepository.deleteSavedPromotion(user, promotion);
    } catch (e) {
      fail('Should have succeeded to delete');
    }
    try {
      expect(await savedPromotionRepository.find({
        user: user,
        promotion: promotion,
      })).toEqual([]);
    } catch (e) {
      fail('Should not have failed');
    }
  });
});
