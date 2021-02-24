import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../../main/repository/UserRepository';
import connection from './BaseRepositoryTest';
import {
  PromotionFullTextSearch,
  PromotionRepository,
} from '../../main/repository/PromotionRepository';
import { DiscountRepository } from '../../main/repository/DiscountRepository';
import { SavedPromotionRepository } from '../../main/repository/SavedPromotionRepository';
import { Promotion } from '../../main/entity/Promotion';
import { PromotionQueryDTO } from '../../main/validation/PromotionQueryValidation';
import { PromotionType } from '../../main/data/PromotionType';
import { DiscountType } from '../../main/data/DiscountType';
import { ScheduleRepository } from '../../main/repository/ScheduleRepository';
import { PromotionFactory } from '../factory/PromotionFactory';
import { DiscountFactory } from '../factory/DiscountFactory';
import { ScheduleFactory } from '../factory/ScheduleFactory';
import { UserFactory } from '../factory/UserFactory';
import { SavedPromotionFactory } from '../factory/SavedPromotionFactory';
import { CuisineType } from '../../main/data/CuisineType';
import { Day } from '../../main/data/Day';
import { RestaurantFactory } from '../factory/RestaurantFactory';
import { RestaurantRepository } from '../../main/repository/RestaurantRepository';

describe('Integration tests for all entities', function () {
  const SAMPLE_SEARCH_QUERY = 'beef cafe';

  let userRepository: UserRepository;
  let promotionRepository: PromotionRepository;
  let discountRepository: DiscountRepository;
  let restaurantRepository: RestaurantRepository;
  let savedPromotionRepository: SavedPromotionRepository;
  let scheduleRepository: ScheduleRepository;

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
    restaurantRepository = getCustomRepository(RestaurantRepository);
    savedPromotionRepository = getCustomRepository(SavedPromotionRepository);
    scheduleRepository = getCustomRepository(ScheduleRepository);
  });

  test('Should not be able to save a promotion if user is not saved', async () => {
    const unSavedUser = new UserFactory().generate();
    const promotion = new PromotionFactory().generateWithRelatedEntities(
      unSavedUser
    );

    // check that no user exists first
    const users = await userRepository.find();
    expect(users.length).toBe(0);

    try {
      await promotionRepository.save(promotion);
      fail('Should have failed');
    } catch (e) {
      expect(e.message).toContain('violates not-null constraint');
    }
  });

  test('Cascade delete - deleting a promotion should delete its discount', async () => {
    const user = new UserFactory().generate();
    const promotion = new PromotionFactory().generateWithRelatedEntities(user);

    // persist into db
    await userRepository.save(user);
    await promotionRepository.save(promotion);

    try {
      const discounts = await discountRepository.find();
      expect(discounts).toBeDefined();
      expect(discounts[0].discountType).toEqual(
        promotion.discount.discountType
      );
      await promotionRepository.delete(promotion.id);
      expect(await promotionRepository.find()).toEqual([]);
      expect(await discountRepository.find()).toEqual([]);
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Cascade delete - deleting a promotion should delete its restaurant', async () => {
    const user = new UserFactory().generate();
    const promotion = new PromotionFactory().generateWithRelatedEntities(user);

    // persist into db
    await userRepository.save(user);
    await promotionRepository.save(promotion);

    try {
      const restaurants = await restaurantRepository.find();
      expect(restaurants).toBeDefined();
      expect(restaurants[0].address).toEqual(promotion.restaurant.address);
      await promotionRepository.delete(promotion.id);
      expect(await promotionRepository.find()).toEqual([]);
      expect(await restaurantRepository.find()).toEqual([]);
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Cascade delete - deleting a user should delete any of the users uploaded promotions', async () => {
    const user = new UserFactory().generate();
    const promotion1 = new PromotionFactory().generateWithRelatedEntities(user);
    const promotion2 = new PromotionFactory().generateWithRelatedEntities(user);

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

  test("Cascade delete - deleting a user should not delete saved promotions that aren't uploaded by the user", async () => {
    const user1 = new UserFactory().generate();
    const user2 = new UserFactory().generate();
    const promotion1 = new PromotionFactory().generateWithRelatedEntities(
      user1
    );
    const promotion2 = new PromotionFactory().generateWithRelatedEntities(
      user2
    );
    const savedPromotion = new SavedPromotionFactory().generate(
      user1,
      promotion2
    );

    // persist into db
    await userRepository.save(user1);
    await userRepository.save(user2);
    await promotionRepository.save(promotion1);
    await promotionRepository.save(promotion2);

    // add promotion2 to user's saved promotion
    // we expect that deleting user1 should not delete promotion2, since promotion2 is uploaded by a different user
    await savedPromotionRepository.save(savedPromotion);

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
    const user1 = new UserFactory().generate();
    const user2 = new UserFactory().generate();
    const promotion1 = new PromotionFactory().generateWithRelatedEntities(
      user1
    );
    const promotion2 = new PromotionFactory().generateWithRelatedEntities(
      user2
    );

    // persist into db & configure such that user1 has created uploaded promotion1 and saved promotion1 & promotion2
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

  test("Should be able to remove a user's saved promotion without deleting the promotion and user", async () => {
    const user = new UserFactory().generate();
    const promotion1 = new PromotionFactory().generateWithRelatedEntities(user);
    const promotion2 = new PromotionFactory().generateWithRelatedEntities(user);

    // persist into db & configure such that user1 has saved promotion1 and promotion2
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

  test('Should see discounts loaded when getting promotions (not lazy loaded) regardless of having search query or not', async () => {
    const promotionQueryDTOWithSearchQuery: PromotionQueryDTO = {
      searchQuery: SAMPLE_SEARCH_QUERY,
    };

    const promotionQueryDTOWithoutSearchQuery: PromotionQueryDTO = {
      promotionType: PromotionType.BOGO,
      discountType: DiscountType.PERCENTAGE,
    };

    const user1 = new UserFactory().generate();
    const user2 = new UserFactory().generate();
    const promotion1 = new PromotionFactory().generate(
      user1,
      new DiscountFactory().generate(),
      new RestaurantFactory().generate(),
      [new ScheduleFactory().generate()]
    );
    promotion1.name = SAMPLE_SEARCH_QUERY;
    const promotion2 = new PromotionFactory().generate(
      user2,
      new DiscountFactory().generate(DiscountType.PERCENTAGE),
      new RestaurantFactory().generate(),
      [new ScheduleFactory().generate()],
      '',
      PromotionType.BOGO
    );

    await userRepository.save(user1);
    await userRepository.save(user2);
    await promotionRepository.save(promotion1);
    await promotionRepository.save(promotion2);

    try {
      const promotionsWithQuery: Promotion[] = await promotionRepository.getAllPromotions(
        promotionQueryDTOWithSearchQuery
      );

      const promotionsWithoutSearchQuery: Promotion[] = await promotionRepository.getAllPromotions(
        promotionQueryDTOWithoutSearchQuery
      );
      const promotionsWithoutQuery: Promotion[] = await promotionRepository.getAllPromotions();

      expect(promotionsWithQuery.length).toBeGreaterThan(0);
      expect(promotionsWithoutSearchQuery.length).toBeGreaterThan(0);
      expect(promotionsWithoutQuery.length).toBeGreaterThan(0);

      for (const promotion of promotionsWithQuery) {
        expect(!promotion.discount);
        expect(promotion.discount.discountType).toBeDefined();
        expect(promotion.discount.discountValue).toBeDefined();
      }

      for (const promotion of promotionsWithoutSearchQuery) {
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

  test('When apply filter options, results should only contain values that match all filters', async () => {
    const promotionQueryDTO: PromotionQueryDTO = {
      promotionType: PromotionType.BOGO,
      discountType: DiscountType.PERCENTAGE,
    };

    const user1 = new UserFactory().generate();
    const user2 = new UserFactory().generate();
    const promotion1 = new PromotionFactory().generate(
      user2,
      new DiscountFactory().generate(DiscountType.PERCENTAGE),
      new RestaurantFactory().generate(),
      [new ScheduleFactory().generate()],
      '',
      PromotionType.BOGO
    );
    const promotion2 = new PromotionFactory().generate(
      user2,
      new DiscountFactory().generate(DiscountType.PERCENTAGE),
      new RestaurantFactory().generate(),
      [new ScheduleFactory().generate()],
      '',
      PromotionType.BOGO
    );

    await userRepository.save(user1);
    await userRepository.save(user2);
    await promotionRepository.save(promotion1);
    await promotionRepository.save(promotion2);

    try {
      const promotions: PromotionFullTextSearch[] = await promotionRepository.getAllPromotions(
        promotionQueryDTO
      );

      expect(promotions.length).toBeGreaterThan(0);
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

  test('When apply filter options without search query, results should not contain rank, boldDescription, and boldName', async () => {
    const promotionQueryDTO: PromotionQueryDTO = {
      promotionType: PromotionType.BOGO,
      discountType: DiscountType.PERCENTAGE,
    };

    const user1 = new UserFactory().generate();
    const user2 = new UserFactory().generate();
    const promotion1 = new PromotionFactory().generate(
      user2,
      new DiscountFactory().generate(DiscountType.PERCENTAGE),
      new RestaurantFactory().generate(),
      [new ScheduleFactory().generate()],
      '',
      PromotionType.BOGO
    );
    const promotion2 = new PromotionFactory().generate(
      user2,
      new DiscountFactory().generate(DiscountType.PERCENTAGE),
      new RestaurantFactory().generate(),
      [new ScheduleFactory().generate()],
      '',
      PromotionType.BOGO
    );

    await userRepository.save(user1);
    await userRepository.save(user2);
    await promotionRepository.save(promotion1);
    await promotionRepository.save(promotion2);

    try {
      const promotions: PromotionFullTextSearch[] = await promotionRepository.getAllPromotions(
        promotionQueryDTO
      );

      expect(promotions.length).toBeGreaterThan(0);
      for (const promotion of promotions) {
        expect(promotion.rank).not.toBeDefined();
        expect(promotion.boldDescription).not.toBeDefined();
        expect(promotion.boldName).not.toBeDefined();
      }
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('When apply search query, results should contain rank and is ordered by rank', async () => {
    const promotionQueryDTO: PromotionQueryDTO = {
      searchQuery: SAMPLE_SEARCH_QUERY,
    };

    const user1 = new UserFactory().generate();
    const user2 = new UserFactory().generate();
    const promotion1 = new PromotionFactory().generate(
      user2,
      new DiscountFactory().generate(DiscountType.PERCENTAGE),
      new RestaurantFactory().generate(),
      [new ScheduleFactory().generate()],
      '',
      PromotionType.BOGO
    );
    promotion1.name = SAMPLE_SEARCH_QUERY;
    promotion1.description = SAMPLE_SEARCH_QUERY.repeat(2);
    const promotion2 = new PromotionFactory().generate(
      user2,
      new DiscountFactory().generate(DiscountType.PERCENTAGE),
      new RestaurantFactory().generate(),
      [new ScheduleFactory().generate()],
      '',
      PromotionType.BOGO
    );
    promotion2.name = SAMPLE_SEARCH_QUERY;

    await userRepository.save(user1);
    await userRepository.save(user2);
    await promotionRepository.save(promotion1);
    await promotionRepository.save(promotion2);
    try {
      const promotions: PromotionFullTextSearch[] = await promotionRepository.getAllPromotions(
        promotionQueryDTO
      );

      // check that rank exists on the promotion and is decreasing
      expect(promotions.length).toBeGreaterThan(0);
      let currRank = 1;
      for (const promotion of promotions) {
        if (promotion.rank) {
          expect(promotion.rank).toBeLessThanOrEqual(currRank);
          currRank = promotion.rank;
        } else {
          fail('promotion rank should be defined');
        }
      }
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('When apply search query, should return the promotion with bolded names and descriptions for relevant areas that match the search query', async () => {
    const user = new UserFactory().generate();
    const promotion = new PromotionFactory().generateWithRelatedEntities(user);
    promotion.name =
      'The Old Spaghetti Factory - Buy a $25 Gift Card Get $10 Bonus Card';
    promotion.description =
      "From now until December 31st, for every $25 in Gift Cards purchased, get a FREE $10 Bonus Card. Click 'ORDER NOW', or purchase in-store! *Gift Cards valid in Canada only. Gift Cards are not valid on date of purchase. Bonus Cards are valid from January 1st to March 15th, 2021. One Bonus Card redemption per table visit.";

    const promotionQueryDTO: PromotionQueryDTO = {
      searchQuery: 'spaghetti card',
    };

    await userRepository.save(user);
    await promotionRepository.save(promotion);

    try {
      const promotions: PromotionFullTextSearch[] = await promotionRepository.getAllPromotions(
        promotionQueryDTO
      );

      expect(promotions?.length).toEqual(1);
      expect(promotions[0].boldName).toContain('<b>Spaghetti</b>');
      expect(promotions[0].boldDescription).toContain('<b>Card</b>');
      expect(promotions[0].boldDescription).toContain('<b>Cards</b>');
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Cascade delete - deleting a promotion will delete its schedules', async () => {
    const user = new UserFactory().generate();
    const promotion = new PromotionFactory().generateWithRelatedEntities(user);

    // persist into db
    await userRepository.save(user);
    await promotionRepository.save(promotion);

    try {
      const schedules = await scheduleRepository.find();
      expect(schedules).toBeDefined();
      expect(schedules.length).toEqual(promotion.schedules.length);
      await promotionRepository.delete(promotion.id);
      expect(await promotionRepository.find()).toEqual([]);
      expect(await scheduleRepository.find()).toEqual([]);
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Unique constraint - should not be able to save schedules with the same day', async () => {
    const user = new UserFactory().generate();
    const schedule1 = new ScheduleFactory().generate();
    const schedule2 = new ScheduleFactory().generate();
    schedule1.dayOfWeek = schedule2.dayOfWeek;
    const promotion = new PromotionFactory().generate(
      user,
      new DiscountFactory().generate(),
      new RestaurantFactory().generate(),
      [schedule1, schedule2]
    );

    try {
      await userRepository.save(user);
      await promotionRepository.save(promotion);
      fail('Should have failed');
    } catch (e) {
      expect(e.message).toContain(
        'duplicate key value violates unique constraint'
      );
    }
  });

  test('Should be able to get all promotions with specific discount type', async () => {
    const promotionQueryDTO: PromotionQueryDTO = {
      discountType: DiscountType.PERCENTAGE,
    };

    const user = new UserFactory().generate();
    const promotion1 = new PromotionFactory().generateWithRelatedEntities(user);
    const promotion2 = new PromotionFactory().generateWithRelatedEntities(user);

    promotion1.discount.discountType = DiscountType.PERCENTAGE;
    promotion2.discount.discountType = DiscountType.PERCENTAGE;

    await userRepository.save(user);
    await promotionRepository.save(promotion1);
    await promotionRepository.save(promotion2);

    try {
      const promotions: PromotionFullTextSearch[] = await promotionRepository.getAllPromotions(
        promotionQueryDTO
      );

      expect(promotions).toBeDefined();
      expect(promotions.length).toBeGreaterThan(0);
      for (const promotion of promotions) {
        expect(promotion?.discount.discountType).toEqual(
          promotionQueryDTO.discountType
        );
      }
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Should be able to get all promotions with specific discount type and greater than a percentage discount type', async () => {
    const promotionQueryDTO: PromotionQueryDTO = {
      discountType: DiscountType.PERCENTAGE,
      discountValue: 5.6,
    };

    const user1 = new UserFactory().generate();
    const user2 = new UserFactory().generate();
    const promotion1 = new PromotionFactory().generate(
      user2,
      new DiscountFactory().generate(DiscountType.PERCENTAGE, 18),
      new RestaurantFactory().generate(),
      [new ScheduleFactory().generate()]
    );
    const promotion2 = new PromotionFactory().generate(
      user2,
      new DiscountFactory().generate(DiscountType.PERCENTAGE, 4.9),
      new RestaurantFactory().generate(),
      [new ScheduleFactory().generate()]
    );

    await userRepository.save(user1);
    await userRepository.save(user2);
    await promotionRepository.save(promotion1);
    await promotionRepository.save(promotion2);

    try {
      const promotions: PromotionFullTextSearch[] = await promotionRepository.getAllPromotions(
        promotionQueryDTO
      );

      expect(promotions).toBeDefined();
      expect(promotions.length).toEqual(1);
      expect(promotions[0].discount.discountType).toEqual(
        promotionQueryDTO.discountType
      );
      expect(promotions[0].discount.discountValue).toBeGreaterThanOrEqual(
        promotionQueryDTO.discountValue as number
      );
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Should be able to get all promotions with specific discount type and greater than a dollar discount type', async () => {
    const promotionQueryDTO: PromotionQueryDTO = {
      discountType: DiscountType.AMOUNT,
      discountValue: 5.6,
    };

    const user1 = new UserFactory().generate();
    const user2 = new UserFactory().generate();
    const promotion1 = new PromotionFactory().generate(
      user2,
      new DiscountFactory().generate(DiscountType.AMOUNT, 18),
      new RestaurantFactory().generate(),
      [new ScheduleFactory().generate()],
      '',
      PromotionType.BOGO
    );
    const promotion2 = new PromotionFactory().generate(
      user2,
      new DiscountFactory().generate(DiscountType.AMOUNT, 4.9),
      new RestaurantFactory().generate(),
      [new ScheduleFactory().generate()],
      '',
      PromotionType.BOGO
    );

    await userRepository.save(user1);
    await userRepository.save(user2);
    await promotionRepository.save(promotion1);
    await promotionRepository.save(promotion2);

    try {
      const promotions: PromotionFullTextSearch[] = await promotionRepository.getAllPromotions(
        promotionQueryDTO
      );

      expect(promotions).toBeDefined();
      expect(promotions.length).toEqual(1);
      expect(promotions[0].discount.discountType).toEqual(
        promotionQueryDTO.discountType
      );
      expect(promotions[0].discount.discountValue).toBeGreaterThanOrEqual(
        promotionQueryDTO.discountValue as number
      );
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Should be able to get all promotions that are available a specific day of the week', async () => {
    const promotionQueryDTO: PromotionQueryDTO = {
      dayOfWeek: Day.MONDAY,
    };

    const user1 = new UserFactory().generate();
    const user2 = new UserFactory().generate();
    const promotion1 = new PromotionFactory().generate(
      user1,
      new DiscountFactory().generate(),
      new RestaurantFactory().generate(),
      [new ScheduleFactory().generate('8:00', '9:00', Day.MONDAY)]
    );
    const promotion2 = new PromotionFactory().generate(
      user2,
      new DiscountFactory().generate(),
      new RestaurantFactory().generate(),
      [new ScheduleFactory().generate('8:00', '9:00', Day.TUESDAY)]
    );

    const promotion3 = new PromotionFactory().generate(
      user2,
      new DiscountFactory().generate(),
      new RestaurantFactory().generate(),
      [
        new ScheduleFactory().generate('8:00', '9:00', Day.FRIDAY),
        new ScheduleFactory().generate('8:00', '9:00', Day.MONDAY),
        new ScheduleFactory().generate('8:00', '9:00', Day.SATURDAY),
      ]
    );

    await userRepository.save(user1);
    await userRepository.save(user2);
    await promotionRepository.save(promotion1);
    await promotionRepository.save(promotion2);
    await promotionRepository.save(promotion3);

    try {
      const promotions: PromotionFullTextSearch[] = await promotionRepository.getAllPromotions(
        promotionQueryDTO
      );

      expect(promotions).toBeDefined();
      expect(promotions.length).toEqual(2);
      const expectedPromotions = [promotion1, promotion3];
      for (const expectedPromotion of expectedPromotions) {
        const p = promotions.find(
          (promotion) => promotion.id === expectedPromotion.id
        );
        expect(p).toBeDefined();
        expect(p!.schedules.length).toEqual(expectedPromotion.schedules.length);
        expect(
          p!.schedules.find(
            (schedule) => schedule.dayOfWeek === promotionQueryDTO.dayOfWeek
          )
        ).toBeDefined();
      }
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Should be able to get all promotions that belong to either one of the specified cuisines', async () => {
    const promotionQueryDTO: PromotionQueryDTO = {
      cuisine: [CuisineType.CAJUN, CuisineType.CARIBBEAN],
    };

    const user1 = new UserFactory().generate();
    const user2 = new UserFactory().generate();
    const promotion1 = new PromotionFactory().generateWithRelatedEntities(
      user1
    );
    const promotion2 = new PromotionFactory().generateWithRelatedEntities(
      user2
    );
    const promotion3 = new PromotionFactory().generateWithRelatedEntities(
      user2
    );

    promotion1.cuisine = CuisineType.CAJUN;
    promotion2.cuisine = CuisineType.CARIBBEAN;
    promotion3.cuisine = CuisineType.CHECHEN;

    await userRepository.save(user1);
    await userRepository.save(user2);
    await promotionRepository.save(promotion1);
    await promotionRepository.save(promotion2);
    await promotionRepository.save(promotion3);

    try {
      const promotions: PromotionFullTextSearch[] = await promotionRepository.getAllPromotions(
        promotionQueryDTO
      );

      expect(promotions).toBeDefined();
      expect(promotions.length).toEqual(2);
      for (const promotion of promotions) {
        expect(promotionQueryDTO.cuisine).toContain(promotion.cuisine);
      }
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Should get all promotions when querying an empty array of cuisines', async () => {
    const promotionQueryDTO: PromotionQueryDTO = {
      cuisine: [],
    };

    const user = new UserFactory().generate();
    const promotion1 = new PromotionFactory().generateWithRelatedEntities(user);
    const promotion2 = new PromotionFactory().generateWithRelatedEntities(user);
    const promotion3 = new PromotionFactory().generateWithRelatedEntities(user);

    promotion1.cuisine = CuisineType.CAJUN;
    promotion2.cuisine = CuisineType.CARIBBEAN;
    promotion3.cuisine = CuisineType.CHECHEN;

    await userRepository.save(user);
    await promotionRepository.save(promotion1);
    await promotionRepository.save(promotion2);
    await promotionRepository.save(promotion3);

    try {
      const promotions: PromotionFullTextSearch[] = await promotionRepository.getAllPromotions(
        promotionQueryDTO
      );

      expect(promotions).toBeDefined();
      expect(promotions.length).toEqual(3);
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });
});
