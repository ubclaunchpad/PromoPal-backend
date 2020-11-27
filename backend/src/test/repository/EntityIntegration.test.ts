import { getCustomRepository } from 'typeorm';
import { promotions_sample, users_sample } from '../../main/resources/Data';
import { UserRepository } from '../../main/repository/UserRepository';
import connection from './BaseRepositoryTest';
import {
  PromotionRepository,
  PromotionWithRank,
} from '../../main/repository/PromotionRepository';
import assert from 'assert';
import { DiscountRepository } from '../../main/repository/DiscountRepository';
import { SavedPromotionRepository } from '../../main/repository/SavedPromotionRepository';
import { SavedPromotion } from '../../main/entity/SavedPromotion';
import { Promotion } from '../../main/entity/Promotion';
import { PromotionQueryDTO } from '../../main/validation/PromotionQueryValidation';
import { PromotionType } from '../../main/data/PromotionType';
import { DiscountType } from '../../main/data/DiscountType';

describe('Integration tests for all entities', function () {
  let userRepository: UserRepository;
  let promotionRepository: PromotionRepository;
  let discountRepository: DiscountRepository;
  let savedPromotionRepository: SavedPromotionRepository;

  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await connection.clear();
    userRepository = getCustomRepository(UserRepository);
    promotionRepository = getCustomRepository(PromotionRepository);
    discountRepository = getCustomRepository(DiscountRepository);
    savedPromotionRepository = getCustomRepository(SavedPromotionRepository);
  });

  test('Should not be able to save a promotion if user is not saved', async () => {
    const promotion = promotions_sample[0];

    // check that no user exists first
    const users = await userRepository.find();
    expect(users.length).toBe(0);

    try {
      await promotionRepository.save(promotion);
      fail('Should have failed');
    } catch (e) {
      expect(e.message).toBe(
        'null value in column "userId" violates not-null constraint'
      );
    }
  });

  test('Cascade delete - deleting a promotion should delete its discount', async () => {
    const promotion = promotions_sample[0];
    assert(promotion.discount !== null);

    // persist into db
    await userRepository.save(promotion.user);
    await promotionRepository.save(promotion);

    try {
      await promotionRepository.delete(promotion.id);
      expect(await promotionRepository.find()).toEqual([]);
      expect(await discountRepository.find()).toEqual([]);
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Cascade delete - deleting a user should delete any of the users uploaded promotions', async () => {
    const user = users_sample[0];
    const promotion1 = promotions_sample[0];
    const promotion2 = promotions_sample[1];
    promotion1.user = user;
    promotion2.user = user;

    // persist into db
    await userRepository.save(user);
    await promotionRepository.save(promotion1);
    await promotionRepository.save(promotion2);

    try {
      await userRepository.delete(user);
      expect(await userRepository.find()).toEqual([]);
      expect(await promotionRepository.find()).toEqual([]);
      expect(await discountRepository.find()).toEqual([]);
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Cascade delete - deleting a user should not delete saved promotions that aren\'t uploaded by the user', async () => {
    const user1 = users_sample[0];
    const user2 = users_sample[1];
    const promotion1 = promotions_sample[0];
    const promotion2 = promotions_sample[1];

    promotion1.user = user1;
    promotion2.user = user2;

    // persist into db
    await userRepository.save(user1);
    await userRepository.save(user2);
    await promotionRepository.save(promotion1);
    await promotionRepository.save(promotion2);

    // add promotion2 to user's saved promotion
    // we expect that deleting user1 should not delete promotion2, since promotion2 is uploaded by a different user
    await savedPromotionRepository.save(new SavedPromotion(user1, promotion2));

    try {
      await userRepository.delete(user1.id);
      const user = await userRepository.findOne(user2.id, {
        relations: [
          'uploadedPromotions',
          'uploadedPromotions.discount',
          'savedPromotions',
          'savedPromotions.promotion',
        ],
      });
      // should not have deleted promotion2 or discount associated with promotion2
      expect(user?.uploadedPromotions[0]?.id).toEqual(promotion2.id);
      expect(user?.uploadedPromotions[0]?.discount).toEqual(
        promotion2.discount
      );
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Cascade delete - deleting a promotion should remove it from any users saved and uploaded promotions', async () => {
    const user1 = users_sample[0];
    const user2 = users_sample[1];
    const promotion1 = promotions_sample[0];
    const promotion2 = promotions_sample[1];

    // persist into db & configure such that user1 has created uploaded promotion1 and saved promotion1 & promotion2
    promotion1.user = user1;
    promotion2.user = user2;
    await userRepository.save(user1);
    await userRepository.save(user2);
    await promotionRepository.save(promotion1);
    await promotionRepository.save(promotion2);
    await savedPromotionRepository.addSavedPromotions(user1, [
      promotion1,
      promotion2,
    ]);

    try {
      await promotionRepository.delete([promotion1.id, promotion2.id]);
      const user = await userRepository.findOne(user1.id, {
        relations: [
          'uploadedPromotions',
          'savedPromotions',
          'savedPromotions.promotion',
        ],
      });
      expect(user?.uploadedPromotions).toEqual([]);
      expect(user?.savedPromotions).toEqual([]);
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Should be able to remove a user\'s saved promotion without deleting the promotion and user', async () => {
    const user = users_sample[0];
    const promotion1 = promotions_sample[0];
    const promotion2 = promotions_sample[1];

    // persist into db & configure such that user1 has saved promotion1 and promotion2
    promotion1.user = user;
    promotion2.user = user;
    await userRepository.save(user);
    await promotionRepository.save(promotion1);
    await promotionRepository.save(promotion2);
    await savedPromotionRepository.addSavedPromotions(user, [
      promotion1,
      promotion2,
    ]);

    try {
      await savedPromotionRepository.delete({ userId: user.id });
      const persistedUser = await userRepository.findOne(user.id, {
        relations: ['uploadedPromotions', 'savedPromotions'],
      });
      expect(persistedUser?.savedPromotions).toEqual([]);
      expect(persistedUser?.uploadedPromotions?.length).toEqual(2);
      expect(persistedUser?.uploadedPromotions[0].id).toEqual(promotion1.id);
      expect(persistedUser?.uploadedPromotions[1].id).toEqual(promotion2.id);
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Should see discounts loaded when getting promotions (not lazy loaded) regardless of having query or not', async () => {
    const promotionQueryDTOWithSearchQuery: PromotionQueryDTO = {
      promotionType: PromotionType.BOGO,
      discountType: DiscountType.PERCENTAGE,
      searchQuery: 'promo2 description1 promo1 description13',
    };

    const promotionQueryDTOWithoutSearchQuery: PromotionQueryDTO = {
      promotionType: PromotionType.BOGO,
      discountType: DiscountType.PERCENTAGE,
    };

    for (const user of users_sample) {
      await userRepository.save(user);
    }

    for (const promotion of promotions_sample) {
      await promotionRepository.save(promotion);
    }

    try {
      const promotionsWithQuery: Promotion[] = await promotionRepository.getAllPromotions(
        promotionQueryDTOWithSearchQuery
      );

      const promotionsWithoutSerachQuery: Promotion[] = await promotionRepository.getAllPromotions(
        promotionQueryDTOWithoutSearchQuery
      );
      const promotionsWithoutQuery: Promotion[] = await promotionRepository.getAllPromotions();

      for (const promotion of promotionsWithQuery) {
        expect(!promotion.discount);
        expect(promotion.discount.discountType).toBeDefined();
        expect(promotion.discount.discountValue).toBeDefined();
      }

      for (const promotion of promotionsWithoutSerachQuery) {
        expect(!promotion.discount);
        expect(promotion.discount.discountType).toBeDefined();
        expect(promotion.discount.discountValue).toBeDefined();
      }

      for (const promotion of promotionsWithoutQuery) {
        expect(!promotion.discount);
        expect(promotion.discount.discountType).toBeDefined();
        expect(promotion.discount.discountValue).toBeDefined();
      }
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Should be able to apply query options when getting promotions', async () => {
    const promotionQueryDTO: PromotionQueryDTO = {
      promotionType: PromotionType.BOGO,
      discountType: DiscountType.PERCENTAGE,
      searchQuery: 'promo2 description1 promo1 description13',
    };

    for (const user of users_sample) {
      await userRepository.save(user);
    }

    for (const promotion of promotions_sample) {
      await promotionRepository.save(promotion);
    }

    try {
      const promotions: PromotionWithRank[] = await promotionRepository.getAllPromotions(
        promotionQueryDTO
      );
      // expecting 2 promotions
      expect(promotions?.length).toEqual(2);

      // check that rank exists on the promotion and is decreasing
      let currRank = 1;
      for (const promotion of promotions) {
        if (promotion.rank) {
          expect(promotion.rank).toBeLessThanOrEqual(currRank);
          currRank = promotion.rank;
        } else {
          fail('promotion rank should be defined');
        }
      }

      // assert values of promotionQueryDTO are found in promotions
      for (const promotion of promotions) {
        expect(promotion.promotionType).toEqual(
          promotionQueryDTO.promotionType
        );
        expect(promotion.discount.discountType).toEqual(
          promotionQueryDTO.discountType
        );
      }
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });
});
