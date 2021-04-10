import { Entry, Geocoder, Query } from 'node-geocoder';
import { GeoCoordinate } from '../data/GeoCoordinate';

/**
 * The addition of 'countryCode' yields more accurate geocoding results
 * However, it will be undefined in testing due to incompatibilities
 */
export interface GeocoderConfig {
  geocoder: Geocoder;
  countryCode?: string;
}
/**
 * Class used for geocoding our restaurant addresses into lat/lon values
 */
export class GeocodingService {
  private geocoder: Geocoder;
  private countryCode?: string;

  constructor(geocoderConfig: GeocoderConfig) {
    this.geocoder = geocoderConfig.geocoder;
    this.countryCode = geocoderConfig.countryCode;
  }

  /**
   * Geocode the address
   * NOTE: The resulting latitude and longitude values may be null
   * @param address The address of the restaurant
   */
  public async getGeoCoordinateFromAddress(
    address: string
  ): Promise<GeoCoordinate> {
    const query: Query | string = this.countryCode
      ? { address, countryCode: this.countryCode }
      : address;
    const entries: Entry[] = await this.geocoder.geocode(query);

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
