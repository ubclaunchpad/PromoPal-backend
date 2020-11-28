import redis from 'redis';
import { CachingObject } from '../data/CachingObject';

export class CachingService {
  // todo: change to env later
  private client = redis.createClient({
    // host: 'redis-server',
    host: 'localhost',
    port: 6379,
  });

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
            reject(err);
          }
          resolve(true);
        }
      );
    });
  }

  async getLatLonValue(placeId: string): Promise<CachingObject> {
    return new Promise((resolve, reject) => {
      this.client.get(placeId, (err: Error | null, data: string | null) => {
        if (err) {
          reject(err);
        }

        if (data) {
          resolve(JSON.parse(data));
        } else {
          reject('No lat/lon information for this placeID');
        }
      });
    });
  }
}
