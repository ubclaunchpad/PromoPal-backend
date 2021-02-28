import nodeGeocoder, { Entry, Geocoder, Options } from 'node-geocoder';
import { GeocodingObject } from '../data/GeocodingObject';
import * as dotenv from 'dotenv';

/**
 * Node library for geocoding our restaurant addresses
 */
export class GeocodingService {
  private geoCoder: Geocoder;

  constructor() {
    dotenv.config();
    // todo: add in different geocoder locations and minimize calcs
    const options: Options = {
      provider: 'locationiq',
      apiKey: process.env.GEOCODING_KEY,
    };

    this.geoCoder = nodeGeocoder(options);
  }

  getLatLonFromRestaurantAddress(
    restaurantAddress: string
  ): Promise<GeocodingObject> {
    return this.geoCoder
      .geocode(restaurantAddress)
      .then((entries: Entry[]) => {
        const result: GeocodingObject = { lat: 0, lon: 0 };

        // todo: sorted by relevancy?
        // todo: decide on how to pick for array

        if (
          entries &&
          entries.length &&
          entries[0].latitude &&
          entries[0].longitude
        ) {
          result.lat = Number(entries[0].latitude.toFixed(3));
          result.lon = Number(entries[0].longitude.toFixed(3));
        }
        return result;
      })
      .catch((err) => {
        // todo: error response
        const result: GeocodingObject = { lat: 0, lon: 0 };
        return result;
      });
  }
}
