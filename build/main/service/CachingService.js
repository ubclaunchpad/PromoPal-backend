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
Object.defineProperty(exports, '__esModule', { value: true });
exports.CachingService = void 0;
class CachingService {
  constructor(client) {
    this.client = client;
  }
  cacheLatLonValues(placeId, latitude, longitude) {
    return __awaiter(this, void 0, void 0, function* () {
      return new Promise((resolve, reject) => {
        const value = { lat: latitude, lon: longitude };
        this.client.setex(placeId, 2592000, JSON.stringify(value), (err) => {
          if (err) {
            return reject(err);
          }
          return resolve();
        });
      });
    });
  }
  getLatLonValue(placeId) {
    return __awaiter(this, void 0, void 0, function* () {
      return new Promise((resolve) => {
        this.client.get(placeId, (err, data) => {
          if (err || !data) {
            return resolve(JSON.parse('{}'));
          }
          return resolve(JSON.parse(data));
        });
      });
    });
  }
  setLatLonForPromotions(promotions) {
    return __awaiter(this, void 0, void 0, function* () {
      const promises = promotions.map((promotion) =>
        this.setLatLonForPromotion(promotion)
      );
      return Promise.all(promises);
    });
  }
  setLatLonForPromotion(promotion) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.getLatLonValue(promotion.placeId)
        .then((locationDetails) => {
          promotion.lat =
            locationDetails === null || locationDetails === void 0
              ? void 0
              : locationDetails.lat;
          promotion.lon =
            locationDetails === null || locationDetails === void 0
              ? void 0
              : locationDetails.lon;
        })
        .catch((err) => {
          throw err;
        });
    });
  }
}
exports.CachingService = CachingService;
//# sourceMappingURL=CachingService.js.map
