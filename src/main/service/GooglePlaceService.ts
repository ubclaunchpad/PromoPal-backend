import {
  Client,
  Place,
  PlaceDetailsResponse,
} from '@googlemaps/google-maps-services-js';
import { PlaceField } from '../data/PlaceField';
import { PlaceDetailsResponseData } from '@googlemaps/google-maps-services-js/dist/places/details';

export class GooglePlaceService {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Get the details of a restaurant based on inputted place_id
   * @param place_id assuming this place_id represents a restaurant
   * @return PlaceDetailsResponseData
   * */
  async getRestaurantDetails(
    place_id: string
  ): Promise<PlaceDetailsResponseData> {
    const placeDetailsResponse: PlaceDetailsResponse = await this.client.placeDetails(
      {
        params: {
          place_id,
          key: process.env.GOOGLE_API_KEY!,
          fields: [
            PlaceField.URL,
            PlaceField.FORMATTED_PHONE_NUMBER,
            PlaceField.WEBSITE,
            PlaceField.REVIEWS,
            PlaceField.PHOTOS,
            PlaceField.BUSINESS_STATUS,
            PlaceField.FORMATTED_ADDRESS,
            PlaceField.GEOMETRY,
            PlaceField.NAME,
            PlaceField.PRICE_LEVEL,
            PlaceField.RATING,
            PlaceField.USER_RATINGS_TOTAL,
          ],
        },
      }
    );

    return placeDetailsResponse.data;
  }
}
