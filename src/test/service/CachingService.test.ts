import { CachingService } from '../../main/service/CachingService';
import { Promotion } from '../../main/entity/Promotion';
import { DiscountType } from '../../main/data/DiscountType';
import { User } from '../../main/entity/User';
import redisMock, { RedisClient } from 'redis-mock';
import { UserFactory } from '../factory/UserFactory';
import { PromotionFactory } from '../factory/PromotionFactory';
import { DiscountFactory } from '../factory/DiscountFactory';
import { ScheduleFactory } from '../factory/ScheduleFactory';

describe('tests for redis cache', function () {
  let cachingService: CachingService;
  let redisMockClient: RedisClient;
  const mockPlaceID = 'ChIJIfBAsjeuEmsRdgu9Pl1Ps48';
  const mockLatitude = -34.2;
  const mockLongitude = -46.123;

  beforeAll(() => {
    redisMockClient = redisMock.createClient();
    cachingService = new CachingService(redisMockClient);
  });

  afterAll(() => {
    redisMockClient.quit();
  });

  test('caching and getting lat/lon values', async () => {
    try {
      await cachingService.cacheLatLonValues(
        mockPlaceID,
        mockLatitude,
        mockLongitude
      );
      const resultTwo = await cachingService.getLatLonValue(mockPlaceID);
      expect(resultTwo).toHaveProperty('lat');
      expect(resultTwo).toHaveProperty('lon');
      expect(resultTwo.lat).toBe(mockLatitude);
      expect(resultTwo.lon).toBe(mockLongitude);
    } catch (e) {
      fail('Did not expect to fail: ' + e.message);
    }
  });

  test('setting lat/lon for promotions', async () => {
    const user1: User = new UserFactory().generate();
    const promotion1 = new PromotionFactory().generate(
      user1,
      new DiscountFactory().generate(DiscountType.PERCENTAGE),
      [new ScheduleFactory().generate()],
      mockPlaceID
    );

    const user2: User = new UserFactory().generate();
    const promotion2 = new PromotionFactory().generate(
      user2,
      new DiscountFactory().generate(DiscountType.PERCENTAGE),
      [new ScheduleFactory().generate()],
      mockPlaceID
    );

    const promotions: Promotion[] = [promotion1, promotion2];

    try {
      await cachingService.cacheLatLonValues(
        mockPlaceID,
        mockLatitude,
        mockLongitude
      );
      await cachingService.setLatLonForPromotions(promotions);

      for (const promotion of promotions) {
        expect(promotion.lat).toEqual(mockLatitude);
        expect(promotion.lon).toEqual(mockLongitude);
      }
    } catch (e) {
      fail('Did not expect to fail: ' + e.message);
    }
  });

  test('setting lat/lon for a promotion', async () => {
    const user: User = new UserFactory().generate();
    const promotion: Promotion = new PromotionFactory().generate(
      user,
      new DiscountFactory().generate(DiscountType.PERCENTAGE),
      [new ScheduleFactory().generate()],
      mockPlaceID
    );

    try {
      await cachingService.cacheLatLonValues(
        mockPlaceID,
        mockLatitude,
        mockLongitude
      );
      await cachingService.setLatLonForPromotion(promotion);
      expect(promotion.lat).toEqual(mockLatitude);
      expect(promotion.lon).toEqual(mockLongitude);
    } catch (e) {
      fail('Did not expect to fail: ' + e.message);
    }
  });
});
