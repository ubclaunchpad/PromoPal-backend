import nodeGeocoder, { Entry, Geocoder, Options } from 'node-geocoder';
import { GeocodingObject } from '../data/GeocodingObject';
import * as dotenv from 'dotenv';

/**
 * A Node library for geocoding our restaurant addresses
 */
export class GeocodingService {
  private geocoder: Geocoder;

  constructor() {
    dotenv.config();
    const options: Options = {
      provider: 'locationiq',
      apiKey: process.env.GEOCODING_KEY,
    };
    this.geocoder = nodeGeocoder(options);
  }

  public getGeoCoordinatesFromAddress(
    address: string
  ): Promise<GeocodingObject> {
    return this.geocoder
      .geocode(address)
      .then((entries: Entry[]) => {
        const result: GeocodingObject = {};

        if (entries?.length) {
          const geocodeResult = entries[0];
          result.lat = geocodeResult.latitude;
          result.lon = geocodeResult.longitude;
        }

        return result;
      })
      .catch(() => {
        return {};
      });
  }
}
