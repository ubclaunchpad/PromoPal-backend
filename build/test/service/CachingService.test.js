'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const CachingService_1 = require('../../main/service/CachingService');
const DiscountType_1 = require('../../main/data/DiscountType');
const redis_mock_1 = __importDefault(require('redis-mock'));
const UserFactory_1 = require('../factory/UserFactory');
const PromotionFactory_1 = require('../factory/PromotionFactory');
const DiscountFactory_1 = require('../factory/DiscountFactory');
const ScheduleFactory_1 = require('../factory/ScheduleFactory');
describe('tests for redis cache', function () {
  let cachingService;
  let redisMockClient;
  const mockPlaceID = 'ChIJIfBAsjeuEmsRdgu9Pl1Ps48';
  const mockLatitude = -34.2;
  const mockLongitude = -46.123;
  beforeAll(() => {
    redisMockClient = redis_mock_1.default.createClient();
    cachingService = new CachingService_1.CachingService(redisMockClient);
  });
  afterAll(() => {
    redisMockClient.quit();
  });
  test('caching and getting lat/lon values', () =>
    __awaiter(this, void 0, void 0, function* () {
      try {
        yield cachingService.cacheLatLonValues(
          mockPlaceID,
          mockLatitude,
          mockLongitude
        );
        const resultTwo = yield cachingService.getLatLonValue(mockPlaceID);
        expect(resultTwo).toHaveProperty('lat');
        expect(resultTwo).toHaveProperty('lon');
        expect(resultTwo.lat).toBe(mockLatitude);
        expect(resultTwo.lon).toBe(mockLongitude);
      } catch (e) {
        fail('Did not expect to fail: ' + e.message);
      }
    }));
  test('setting lat/lon for promotions', () =>
    __awaiter(this, void 0, void 0, function* () {
      const user1 = new UserFactory_1.UserFactory().generate();
      const promotion1 = new PromotionFactory_1.PromotionFactory().generate(
        user1,
        new DiscountFactory_1.DiscountFactory().generate(
          DiscountType_1.DiscountType.PERCENTAGE
        ),
        [new ScheduleFactory_1.ScheduleFactory().generate()],
        mockPlaceID
      );
      const user2 = new UserFactory_1.UserFactory().generate();
      const promotion2 = new PromotionFactory_1.PromotionFactory().generate(
        user2,
        new DiscountFactory_1.DiscountFactory().generate(
          DiscountType_1.DiscountType.PERCENTAGE
        ),
        [new ScheduleFactory_1.ScheduleFactory().generate()],
        mockPlaceID
      );
      const promotions = [promotion1, promotion2];
      try {
        yield cachingService.cacheLatLonValues(
          mockPlaceID,
          mockLatitude,
          mockLongitude
        );
        yield cachingService.setLatLonForPromotions(promotions);
        for (const promotion of promotions) {
          expect(promotion.lat).toEqual(mockLatitude);
          expect(promotion.lon).toEqual(mockLongitude);
        }
      } catch (e) {
        fail('Did not expect to fail: ' + e.message);
      }
    }));
  test('setting lat/lon for a promotion', () =>
    __awaiter(this, void 0, void 0, function* () {
      const user = new UserFactory_1.UserFactory().generate();
      const promotion = new PromotionFactory_1.PromotionFactory().generate(
        user,
        new DiscountFactory_1.DiscountFactory().generate(
          DiscountType_1.DiscountType.PERCENTAGE
        ),
        [new ScheduleFactory_1.ScheduleFactory().generate()],
        mockPlaceID
      );
      try {
        yield cachingService.cacheLatLonValues(
          mockPlaceID,
          mockLatitude,
          mockLongitude
        );
        yield cachingService.setLatLonForPromotion(promotion);
        expect(promotion.lat).toEqual(mockLatitude);
        expect(promotion.lon).toEqual(mockLongitude);
      } catch (e) {
        fail('Did not expect to fail: ' + e.message);
      }
    }));
});
//# sourceMappingURL=CachingService.test.js.map
