import { GeocodingService } from '../../main/service/GeocodingService';
import { GeocodingObject } from '../../main/data/GeocodingObject';
import { randomString } from '../utility/Utility';

describe('tests for Geocoding Service', function () {
  let geocoder: GeocodingService;

  beforeAll(() => {
    geocoder = new GeocodingService();
  });

  test('getting coordinates for Gyu-Kaku', async () => {
    try {
      const result: GeocodingObject = await geocoder.getGeoCoordinatesFromAddress(
        '888 Nelson St g3, Vancouver, BC V6Z 2H1'
      );
      expect(result.lat).toEqual(49.279972);
      expect(result.lon).toEqual(-123.125312);
    } catch (e) {
      fail('Did not expect to fail: ' + e.message);
    }
  });

  test('getting coordinates for Marutama Ramen', async () => {
    try {
      const result: GeocodingObject = await geocoder.getGeoCoordinatesFromAddress(
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
      const result: GeocodingObject = await geocoder.getGeoCoordinatesFromAddress(
        randomString(30)
      );
      expect(result).toEqual({});
    } catch (e) {
      fail('Did not expect to fail: ' + e.message);
    }
  });

  test('getting empty object for empty string location', async () => {
    try {
      const result: GeocodingObject = await geocoder.getGeoCoordinatesFromAddress(
        ''
      );
      expect(result).toEqual({});
    } catch (e) {
      fail('Did not expect to fail: ' + e.message);
    }
  });
});
