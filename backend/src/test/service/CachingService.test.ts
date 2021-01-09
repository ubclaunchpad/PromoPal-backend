import { CachingService } from '../../main/service/CachingService';
import { CachingObject } from '../../main/data/CachingObject';
import { Promotion } from '../../main/entity/Promotion';
import { DiscountType } from '../../main/data/DiscountType';
import { User } from '../../main/entity/User';
import redisMock from 'redis-mock';
import { UserFactory } from '../factory/UserFactory';
import { PromotionFactory } from '../factory/PromotionFactory';
import { DiscountFactory } from '../factory/DiscountFactory';
import { ScheduleFactory } from '../factory/ScheduleFactory';

describe('tests for redis cache', function () {
  let cachingService: CachingService;

  beforeAll(() => {
    const redisMockClient = redisMock.createClient();
    cachingService = new CachingService(redisMockClient);
  });

  afterAll(() => {
    const client = cachingService.getClient();
    client.quit();
  });

  test('caching and getting lat/lon values', () => {
    return cachingService
      .cacheLatLonValues('ChIJIfBAsjeuEmsRdgu9Pl1Ps48', -34.2, -46.123)
      .then((value: boolean) => {
        expect(value).toBeTruthy();
        return cachingService.getLatLonValue('ChIJIfBAsjeuEmsRdgu9Pl1Ps48');
      })
      .then((result: CachingObject) => {
        expect(result).toHaveProperty('lat');
        expect(result).toHaveProperty('lon');
        expect(result.lat).toBe(-34.2);
        expect(result.lon).toBe(-46.123);
      })
      .catch((e) => {
        fail('Did not expect to fail: ' + e.message);
      });
  });

  test('setting lat/lon for promotions', async () => {
    const user1: User = new UserFactory().generate();
    const promotion1 = new PromotionFactory().generate(
      user1,
      new DiscountFactory().generate(DiscountType.PERCENTAGE),
      [new ScheduleFactory().generate()],
      'ChIJIfBAsjeuEmsRdgu9Pl1Ps48'
    );

    const user2: User = new UserFactory().generate();
    const promotion2 = new PromotionFactory().generate(
      user2,
      new DiscountFactory().generate(DiscountType.PERCENTAGE),
      [new ScheduleFactory().generate()],
      'ChIJIfBAsjeuEmsRdgu9Pl1Ps48'
    );

    const promotions: Promotion[] = [promotion1, promotion2];

    return cachingService
      .cacheLatLonValues('ChIJIfBAsjeuEmsRdgu9Pl1Ps48', -34.2, -46.123)
      .then(() => {
        return cachingService.setLatLonForPromotions(promotions);
      })
      .then(() => {
        const expectedPromotion1 = promotion1;
        expectedPromotion1.lat = -34.2;
        expectedPromotion1.lon = -46.123;
        expect(expectedPromotion1).toEqual(promotions[0]);
        const expectedPromotion2 = promotion2;
        expectedPromotion2.lat = -34.2;
        expectedPromotion2.lon = -46.123;
        expect(expectedPromotion2).toEqual(promotions[1]);
      })
      .catch((e) => {
        fail('Did not expect to fail: ' + e.message);
      });
  });

  test('setting lat/lon for a promotion', async () => {
    const user: User = new UserFactory().generate();
    const promotion: Promotion = new PromotionFactory().generate(
      user,
      new DiscountFactory().generate(DiscountType.PERCENTAGE),
      [new ScheduleFactory().generate()],
      'ChIJIfBAsjeuEmsRdgu9Pl1Ps48'
    );

    return cachingService
      .cacheLatLonValues('ChIJIfBAsjeuEmsRdgu9Pl1Ps48', -34.2, -46.123)
      .then(() => {
        return cachingService.setLatLonForPromotion(promotion);
      })
      .then(() => {
        const expectedPromotion = promotion;
        expectedPromotion.lat = -34.2;
        expectedPromotion.lon = -46.123;
        expect(expectedPromotion).toEqual(promotion);
      })
      .catch((e) => {
        fail('Did not expect to fail: ' + e.message);
      });
  });
});
