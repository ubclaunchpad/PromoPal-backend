import { Client, Status } from '@googlemaps/google-maps-services-js';
import axios from 'axios';
import { CustomAxiosMockAdapter } from '../mock/CustomAxiosMockAdapter';
import { GooglePlaceService } from '../../main/service/GooglePlaceService';
import { PlaceDetailsResponseData } from '@googlemaps/google-maps-services-js/dist/places/details';

/**
 * We are using MockAdapter to mock axios requests made by Client. This is because for tests
 * we do not want to make actual requests to Google Places API.
 * */
describe('Unit tests for GooglePlaceService', function () {
  const SAMPLE_PLACE_ID = 'ChIJb0n5cWl3hlQRIbVGYLiTEgE';
  let googlePlaceService: GooglePlaceService;
  let customAxiosMockAdapter: CustomAxiosMockAdapter;

  beforeEach(() => {
    const axiosInstance = axios.create();
    googlePlaceService = new GooglePlaceService(new Client({ axiosInstance }));
    customAxiosMockAdapter = new CustomAxiosMockAdapter(axiosInstance);
  });

  test('Should be able to successfully get place details', async () => {
    customAxiosMockAdapter.mockSuccessfulPlaceDetails(SAMPLE_PLACE_ID);
    try {
      const place: PlaceDetailsResponseData = await googlePlaceService.getRestaurantDetails(
        SAMPLE_PLACE_ID
      );
      expect(place.status).toEqual('OK');
      expect(place.result.place_id).toEqual(SAMPLE_PLACE_ID);
      expect(place.result.name).toEqual('MOCK NAME');
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('If response results in INVALID_REQUEST, no data should be present', async () => {
    customAxiosMockAdapter.mockInvalidRequestPlaceDetails();
    try {
      const place = await googlePlaceService.getRestaurantDetails(
        'Non-existent placeId'
      );
      expect(place.status).toEqual(Status.INVALID_REQUEST);
      expect(place.result).toBeUndefined();
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });
});
