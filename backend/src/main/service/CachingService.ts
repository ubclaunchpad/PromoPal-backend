import { RedisClient } from 'redis';
import { CachingObject } from '../data/CachingObject';
import { Promotion } from '../entity/Promotion';

/**
 * Handles the caching for lat/lon values for restaurants with Redis
 */
export class CachingService {
  private client: RedisClient;

  /**
   * Sets Redis client for class
   * @param client - current Redis client instance
   */
  constructor(client: RedisClient) {
    this.client = client;
  }

  /**
   * Caches the lat/lon values for a promotion's restaurant
   * key is placeId and value is of the type CachingObject
   * sets the cached value to expire in 30 days
   *
   * @param placeId - place ID of the restaurant
   * @param latitude - latitude value of the restaurant
   * @param longitude - longitude value of the restaurant
   */
  async cacheLatLonValues(
    placeId: string,
    latitude: number,
    longitude: number
  ): Promise<void> {
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
          return resolve();
        }
      );
    });
  }

  /**
   * Retrieves the lat/lon value for the particular place ID
   * @param placeId - place ID of the restaurant
   */
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

  /**
   * Sets the lat/lon values for each promotion in the list of promotions
   * @param promotions - list of promotions
   */
  async setLatLonForPromotions(promotions: Promotion[]): Promise<void[]> {
    const promises = promotions.map((promotion: Promotion) =>
      this.setLatLonForPromotion(promotion)
    );
    return Promise.all(promises);
  }

  /**
   * Sets the lat/lon values for a promotion
   * @param promotion - current promotion instance
   */
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
