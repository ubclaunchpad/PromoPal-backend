import { GeocodingService } from '../../main/service/GeocodingService';
import { GeoCoordinate } from '../../main/data/GeoCoordinate';
import { randomString } from '../utility/Utility';
import { BaseController } from '../controller/BaseController';

describe('tests for Geocoding Service', function () {
  let geocodingService: GeocodingService;

  beforeAll(() => {
    geocodingService = new GeocodingService(
      BaseController.createMockNodeGeocoderConfig()
    );
  });

  test('getting coordinates for Marutama Ramen', async () => {
    try {
      const result: GeoCoordinate = await geocodingService.getGeoCoordinateFromAddress(
        '780 Bidwell St, Vancouver, BC V6G 2J6'
      );
      expect(result.lat).toEqual(49.2906033);
      expect(result.lon).toEqual(-123.1333902);
    } catch (e) {
      fail('Did not expect to fail: ' + e.message);
    }
  });

  test('getting empty object for random invalid location', async () => {
    try {
      const result: GeoCoordinate = await geocodingService.getGeoCoordinateFromAddress(
        randomString(30)
      );
      expect(result).toEqual({});
    } catch (e) {
      fail('Did not expect to fail: ' + e.message);
    }
  });

  test('getting empty object for empty string location', async () => {
    try {
      const result: GeoCoordinate = await geocodingService.getGeoCoordinateFromAddress(
        ''
      );
      expect(result).toEqual({});
    } catch (e) {
      fail('Did not expect to fail: ' + e.message);
    }
  });
});
