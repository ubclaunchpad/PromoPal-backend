import {
  Client,
  Place,
  PlaceDetailsResponse,
} from '@googlemaps/google-maps-services-js';
import { PlaceField } from '../data/PlaceField';
import { PlaceDetailsResponseData } from '@googlemaps/google-maps-services-js/dist/places/details';

/**
 * Refresh result when refreshing placeId
 * @property placeId the new placeId
 * @property restaurantDetails the result of place details request with the new placeId, or undefined if placeId refresh unsuccessful
 * */
interface RefreshResult {
  placeId: string;
  restaurantDetails: Place;
}

/**
 * The data fields for place details request
 * */
export const restaurantDetailsFields = [
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
];

export class GooglePlacesService {
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
          fields: restaurantDetailsFields,
        },
      }
    );

    return placeDetailsResponse.data;
  }

  /**
   * Refresh the placeId by making a refresh request.
   * * If there is a new placeId available, get the restaurant details
   * and return them along with the placeId.
   * * If refresh request does not succeed, then RefreshResult will return an empty string for placeId and no restaurant details.
   * @param nonExistentPlaceId the placeId that resulted in NOT_FOUND which triggered this function call
   * @return RefreshResult
   * */
  async refreshPlaceId(nonExistentPlaceId: string): Promise<RefreshResult> {
    const refreshResult: RefreshResult = {
      placeId: '',
      restaurantDetails: {},
    };

    // only include placeId as field to issue refresh request
    const refreshResponse: PlaceDetailsResponse = await this.client.placeDetails(
      {
        params: {
          place_id: nonExistentPlaceId,
          key: process.env.GOOGLE_API_KEY!,
          fields: [PlaceField.PLACE_ID],
        },
      }
    );

    refreshResult.placeId = refreshResponse.data.result?.place_id ?? '';

    if (refreshResult.placeId) {
      const placeDetailsResponseData = await this.getRestaurantDetails(
        refreshResult.placeId
      );
      refreshResult.restaurantDetails = placeDetailsResponseData?.result ?? {};
    }

    return refreshResult;
  }
}
