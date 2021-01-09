import { RedisClient } from 'redis';
import { CachingObject } from '../data/CachingObject';
import { Promotion } from '../entity/Promotion';
import { PromotionDTO } from '../validation/PromotionValidation';

// handles the caching for lat/lon values for restaurants with redis
export class CachingService {
  private client: RedisClient;

  // sets redis client for class
  constructor(client: RedisClient) {
    this.client = client;
  }

  // formats promotionDTO for caching
  async getValuesAndCache(promotion: PromotionDTO): Promise<boolean> {
    const placeId: string = promotion.placeId;
    const latitude: number = promotion.lat;
    const longitude: number = promotion.lon;
    const result = await this.cacheLatLonValues(placeId, latitude, longitude);
    return result;
  }

  // caches the lat/lon values for a promotion's restaurant
  // key is placeId and value is of the form { lat: x, lon: y }
  // sets the cached value to expire in 30 days (limit imposed by Google Places API)
  async cacheLatLonValues(
    placeId: string,
    latitude: number,
    longitude: number
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const value: CachingObject = { lat: latitude, lon: longitude };
      this.client.setex(
        placeId,
        2592000, // 30 days represented in seconds
        JSON.stringify(value),
        (err: Error | null) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        }
      );
    });
  }

  // retrieves the lat/lon value for the particular placeID
  async getLatLonValue(placeId: string): Promise<CachingObject> {
    return new Promise((resolve, reject) => {
      this.client.get(placeId, (err: Error | null, data: string | null) => {
        if (err) {
          // todo: https://github.com/ubclaunchpad/foodies/issues/89
          reject(err);
        }
        return resolve(JSON.parse(data ?? '{}'));
      });
    });
  }

  // returns redisClient
  getClient(): RedisClient {
    return this.client;
  }

  // sets the lat/lon value fields for each promotion in the list of promotions
  async setLatLonForPromotions(promotions: Promotion[]): Promise<void[]> {
    const promises = promotions.map((promotion: Promotion) =>
      this.setLatLonForPromotion(promotion)
    );
    return Promise.all(promises);
  }

  // sets the lat/lon value for a promotion
  async setLatLonForPromotion(promotion: Promotion): Promise<void> {
    return this.getLatLonValue(promotion.placeId)
      .then((locationDetails: CachingObject) => {
        promotion.lat = locationDetails?.lat;
        promotion.lon = locationDetails?.lon;
      })
      .catch((err) => {
        throw err;
      });
  }
}
