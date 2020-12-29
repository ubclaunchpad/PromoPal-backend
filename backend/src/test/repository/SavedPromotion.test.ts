import { getCustomRepository} from 'typeorm';
import connection from './BaseRepositoryTest';
import { SavedPromotionRepository } from '../../main/repository/SavedPromotionRepository';
import { UserRepository } from '../../main/repository/UserRepository';
import { PromotionRepository } from '../../main/repository/PromotionRepository';
import { User } from '../../main/entity/User';
import { Promotion } from '../../main/entity/Promotion';
import { UserFactory } from '../factory/UserFactory';
import { PromotionFactory } from '../factory/PromotionFactory';
import { Discount } from '../../main/entity/Discount';
import { DiscountFactory } from '../factory/DiscountFactory';
import { Schedule } from '../../main/entity/Schedule';
import { ScheduleFactory } from '../factory/ScheduleFactory';

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
    // make a promotion
    const user: User = new UserFactory().generate();
    const discount: Discount = new DiscountFactory().generate();
    const schedule: Schedule = new ScheduleFactory().generate();
    const promotion: Promotion = new PromotionFactory().generate(user, discount, [schedule]);
    await userRepository.save(user);
    await promotionRepository.save(promotion);
    
    // save the promotion
    const saved_user: User = new UserFactory().generate();
    const savedPromotion = savedPromotionRepository.create({userId: saved_user.id, promotionId: promotion.id});
    await savedPromotionRepository.save(savedPromotion);
    const savedpromotion = await savedPromotionRepository.findOne({
      user: saved_user,
      promotion: promotion,
    });
    expect(savedpromotion).toBeDefined();
    expect(savedpromotion!.userId).toEqual(saved_user.id);
    expect(savedpromotion!.promotionId).toEqual(promotion.id);
  });

  test('Should not able to store two same promotion for one user', async () => {
    // make a promotion
    const user: User = new UserFactory().generate();
    const discount: Discount = new DiscountFactory().generate();
    const schedule: Schedule = new ScheduleFactory().generate();
    const promotion: Promotion = new PromotionFactory().generate(user, discount, [schedule]);
    await userRepository.save(user);
    await promotionRepository.save(promotion);
    // save the promotion
    const saved_user: User = new UserFactory().generate();
    await savedPromotionRepository.addSavedPromotion(saved_user, promotion);
    try {
      await savedPromotionRepository.addSavedPromotion(saved_user, promotion);
      fail('Should have failed');
    } catch (e) {
      expect(e.detail).toEqual(
        `Key (\"userId\", \"promotionId\")=(${saved_user.id}, ${promotion.id}) already exists.`
      );
    }
  });

  test('Should be able to store a savedpromotion and successfully delete the saved promotion', async () => {
    // make a promotion
    const user: User = new UserFactory().generate();
    const discount: Discount = new DiscountFactory().generate();
    const schedule: Schedule = new ScheduleFactory().generate();
    const promotion: Promotion = new PromotionFactory().generate(user, discount, [schedule]);
    await userRepository.save(user);
    await promotionRepository.save(promotion);
    // save the promotion
    const saved_user: User = new UserFactory().generate();
    await savedPromotionRepository.addSavedPromotion(saved_user, promotion);
    try {
      await savedPromotionRepository.deleteSavedPromotion(saved_user, promotion);
    } catch (e) {
      fail('Should have succeeded to delete');
    }
    try {
      expect(await savedPromotionRepository.find({
        user: saved_user,
        promotion: promotion,
      })).toEqual([]);
    } catch (e) {
      fail('Should not have failed');
    }
  });
});
