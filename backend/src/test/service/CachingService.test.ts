import { CachingService } from '../../main/service/CachingService';
import { CachingObject } from '../../main/data/CachingObject';
import redis from 'redis';
import { Promotion } from '../../main/entity/Promotion';
import { PromotionType } from '../../main/data/PromotionType';
import { CuisineType } from '../../main/data/CuisineType';
import { Discount } from '../../main/entity/Discount';
import { DiscountType } from '../../main/data/DiscountType';
import { Schedule } from '../../main/entity/Schedule';
import { Day } from '../../main/data/Day';
import { User } from '../../main/entity/User';

// NOTE: RUNNING THESE TESTS WILL MODIFY THE ASSOCIATED REDIS SERVER!
describe('tests for redis cache', function () {
  let cachingService: CachingService;

  beforeEach(() => {
    const redisClient = redis.createClient({
      host: 'localhost',
      port: 6379,
    });
    cachingService = new CachingService(redisClient);
  });

  afterEach(() => {
    const client = cachingService.getClient();
    client.quit();
  });

  test('adding lat/lon value', () => {
    return cachingService
      .cacheLatLonValues('ChIJIfBAsjeuEmsRdgu9Pl1Ps48', -34.2, -46.123)
      .then((value: boolean) => {
        expect(value).toBeTruthy();
      })
      .catch((e) => {
        fail('Did not expect to fail: ' + e.message);
      });
  });

  test('getting lat/lon value', async () => {
    return cachingService
      .getLatLonValue('ChIJIfBAsjeuEmsRdgu9Pl1Ps48')
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
    const discount1 = new Discount(DiscountType.PERCENTAGE, 1);
    const discount2 = new Discount(DiscountType.PERCENTAGE, 2);

    const schedule1 = new Schedule('8:00', '11:00', Day.MONDAY, false);
    const schedule2 = new Schedule('9:00', '12:00', Day.TUESDAY, false);
    const schedule3 = new Schedule('10:00', '13:00', Day.WEDNESDAY, false);
    const schedule4 = new Schedule('11:00', '14:00', Day.THURSDAY, false);

    const user1 = new User(
      'John',
      'Smith',
      'smith.j@sample.com',
      'user1',
      'user1_password'
    );
    const user2 = new User(
      'Asa',
      'Edward',
      'edward.a@sample.com',
      'user2',
      'user2_password'
    );
    const promotion1 = new Promotion(
      user1,
      discount1,
      [schedule1, schedule2],
      'ChIJIfBAsjeuEmsRdgu9Pl1Ps48',
      PromotionType.BOGO,
      CuisineType.CARIBBEAN,
      'Fries for Good - November 10th - 30th',
      `From November 10th to 30th a portion of the proceeds from every order of fries sold will be donated to Ronald McDonald House Charities Canada. All fries, whether bought alone, or in a meal will help! 
  It’s never been easier to give back - all you have to do is eat your favourite fries (120-560 cals)! You can order them in-restaurant, at the drive thru, through McDelivery or you can order ahead on the McDonald’s app.
  If you’re looking for more ways to help families with sick children you can always round up your order - even when Fries for Good is over. When you finish placing your order, simply ask to “Round Up for RMHC” at participating McDonald’s restaurants, and your order will be rounded to the nearest dollar. The difference will be donated to RMHC Canada.`,
      new Date(),
      new Date(),
      'promo1'
    );
    const promotion2 = new Promotion(
      user2,
      discount2,
      [schedule3, schedule4],
      'ChIJIfBAsjeuEmsRdgu9Pl1Ps48',
      PromotionType.HAPPY_HOUR,
      CuisineType.VIETNAMESE,
      'Happy Hour At Pearl Castle Cafe',
      'Just for a limited time happy hour deals starting at 7 pm. Drinks will be 15% off!',
      new Date(),
      new Date(),
      'promo2'
    );
    const promotions: Promotion[] = [promotion1, promotion2];
    return cachingService
      .setLatLonForPromotions(promotions)
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
    const discount1 = new Discount(DiscountType.PERCENTAGE, 1);

    const schedule1 = new Schedule('8:00', '11:00', Day.MONDAY, false);
    const schedule2 = new Schedule('9:00', '12:00', Day.TUESDAY, false);

    const user1 = new User(
      'John',
      'Smith',
      'smith.j@sample.com',
      'user1',
      'user1_password'
    );

    const promotion1 = new Promotion(
      user1,
      discount1,
      [schedule1, schedule2],
      'ChIJIfBAsjeuEmsRdgu9Pl1Ps48',
      PromotionType.BOGO,
      CuisineType.CARIBBEAN,
      'Fries for Good - November 10th - 30th',
      `From November 10th to 30th a portion of the proceeds from every order of fries sold will be donated to Ronald McDonald House Charities Canada. All fries, whether bought alone, or in a meal will help! 
  It’s never been easier to give back - all you have to do is eat your favourite fries (120-560 cals)! You can order them in-restaurant, at the drive thru, through McDelivery or you can order ahead on the McDonald’s app.
  If you’re looking for more ways to help families with sick children you can always round up your order - even when Fries for Good is over. When you finish placing your order, simply ask to “Round Up for RMHC” at participating McDonald’s restaurants, and your order will be rounded to the nearest dollar. The difference will be donated to RMHC Canada.`,
      new Date(),
      new Date(),
      'promo1'
    );

    return cachingService
      .setLatLonForPromotion(promotion1)
      .then(() => {
        const expectedPromotion = promotion1;
        expectedPromotion.lat = -34.2;
        expectedPromotion.lon = -46.123;
        expect(expectedPromotion).toEqual(promotion1);
      })
      .catch((e) => {
        fail('Did not expect to fail: ' + e.message);
      });
  });
});
