import { RedisClient } from 'redis';
import { CachingObject } from '../data/CachingObject';
import { Promotion } from '../entity/Promotion';

export class CachingService {
  private client: RedisClient;

  constructor(client: RedisClient) {
    this.client = client;
  }

  async cacheLatLonValues(
    placeId: string,
    latitude: number,
    longitude: number
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const value: CachingObject = { lat: latitude, lon: longitude };
      this.client.setex(
        placeId,
        2592000,
        JSON.stringify(value),
        (err: Error | null, data: string) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        }
      );
    });
  }

  async getLatLonValue(placeId: string): Promise<CachingObject> {
    return new Promise((resolve, reject) => {
      this.client.get(placeId, (err: Error | null, data: string | null) => {
        if (err) {
          // todo: https://github.com/ubclaunchpad/foodies/issues/89
          reject(err);
        }

        if (data) {
          return resolve(JSON.parse(data));
        } else {
          return resolve(JSON.parse(''));
        }
      });
    });
  }

  getClient() {
    return this.client;
  }

  async setLatLonForPromotions(promotions: Promotion[]): Promise<void[]> {
    const promises = promotions.map((promotion: Promotion) =>
      this.setLatLonForPromotion(promotion)
    );
    return Promise.all(promises);
  }

  async setLatLonForPromotion(promotion: Promotion) {
    return this.getLatLonValue(promotion.placeId)
      .then((locationDetails: CachingObject) => {
        promotion.lat = locationDetails.lat;
        promotion.lon = locationDetails.lon;
      })
      .catch((err) => {
        throw err;
      });
  }
}
