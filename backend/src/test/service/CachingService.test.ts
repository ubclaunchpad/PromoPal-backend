import { CachingService } from '../../main/service/CachingService';
import { CachingObject } from '../../main/data/CachingObject';
import redis from 'redis';

// NOTE: RUNNING THESE TESTS WILL MODIFY THE ASSOCIATED REDIS SERVER!
describe('simple add/get for redis cache', function () {
  let cachingService: CachingService;

  // this runs local redis server
  const redisClient = redis.createClient({
    host: 'redis-server',
    port: 6379,
  });

  beforeEach(() => {
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
});
