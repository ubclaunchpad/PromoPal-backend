import nodeGeocoder, { Entry, Geocoder, Options } from 'node-geocoder';
import { GeoCoordinate } from '../data/GeoCoordinate';

/**
 * Class used for geocoding our restaurant addresses into lat/lon values
 */
export class GeocodingService {
  private geocoder: Geocoder;

  constructor(nodeGeocoder: Geocoder) {
    this.geocoder = nodeGeocoder;
  }

  /**
   * Geocode the address
   * NOTE: The resulting latitude and longitude values may be null
   * @param address The address of the restaurant
   */
  public async getGeoCoordinateFromAddress(
    address: string
  ): Promise<GeoCoordinate> {
    const entries: Entry[] = await this.geocoder.geocode(address);
    const result: GeoCoordinate = {};

    if (entries?.length) {
      // currently just taking first result, may require future refactoring for more accurate approach
      // https://promopal.atlassian.net/browse/PP-95
      const geocodeResult = entries[0];
      result.lat = geocodeResult.latitude;
      result.lon = geocodeResult.longitude;
    }

    return result;
  }
}
