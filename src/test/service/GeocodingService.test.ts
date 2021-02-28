import { GeocodingService } from '../../main/service/GeocodingService';
import { GeocodingObject } from '../../main/data/GeocodingObject';

describe('tests for geocoding service', function () {
  let geocoderService: GeocodingService;

  beforeAll(() => {
    geocoderService = new GeocodingService();
  });

  test('getting lat/lon values for Marutama Ramen', async () => {
    try {
      const result: GeocodingObject = await geocoderService.getLatLonFromRestaurantAddress(
        '270 Robson St, Vancouver, BC V6B 0E7'
      );
      expect(result).toHaveProperty('lat');
      expect(result.lat).toEqual(49.279);
      expect(result).toHaveProperty('lon');
      expect(result.lon).toEqual(-123.116);
    } catch (e) {
      fail('Did not expect to fail: ' + e.message);
    }
  });
});
