import { Entry, Geocoder, Query } from 'node-geocoder';
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
   * @param includeCountryCode To include or exclude country code in query
   * NOTE: At the moment, we only exclude when testing with openstreetmaps
   */
  public async getGeoCoordinateFromAddress(
    address: string,
    includeCountryCode: boolean
  ): Promise<GeoCoordinate> {
    let entries: Entry[];

    if (includeCountryCode) {
      // currently set to Canada
      const query: Query = { address, countryCode: 'ca' };
      entries = await this.geocoder.geocode(query);
    } else {
      entries = await this.geocoder.geocode(address);
    }

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
