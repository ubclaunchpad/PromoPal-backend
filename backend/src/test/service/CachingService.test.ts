import { CachingService } from '../../main/service/CachingService';
import { CachingObject } from '../../main/data/CachingObject';

describe('load all data for local testing', function () {
  // todo: why dont it stop tho
  // NOTE: RUNNING THESE TESTS WILL ADD TO THE REDIS SERVER!!!
  const cachingService: CachingService = new CachingService();

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
