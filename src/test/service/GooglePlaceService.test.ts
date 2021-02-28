import { Client, Status } from '@googlemaps/google-maps-services-js';
import axios from 'axios';
import { CustomAxiosMockAdapter } from '../mock/CustomAxiosMockAdapter';
import { GooglePlaceService } from '../../main/service/GooglePlaceService';
import { PlaceDetailsResponseData } from '@googlemaps/google-maps-services-js/dist/places/details';

/**
 * We are using MockAdapter to mock axios requests made by Client. This is because for tests
 * we do not want to make actual requests to Google Places API.
 * NOTE: if you do want to test with actual google API and not the mock
 * 1. import dotenv and call dotenv.config()
 * 2. Remove all usages of the mock adapter
 * NOTE: Here is an example of a placeId which will result in NOT_FOUND
 * * placeId: EjhDdW1odXJpeWV0IE1haGFsbGVzaSwgVXp1biBTay4sIEV6aW5lL8OHYW5ha2thbGUsIFR1cmtleSIuKiwKFAoSCakQkmN8XrAUEVkLpNK_F4IJEhQKEgmFzKyYe16wFBGSjU7F2ooIIg
 * * source: https://stackoverflow.com/questions/57261582/google-places-api-refresh-place-ids-with-java
 * * When used in a refresh request, it will return a new valid placeId.
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
      const placeDetailsResponseData: PlaceDetailsResponseData = await googlePlaceService.getRestaurantDetails(
        SAMPLE_PLACE_ID
      );
      expect(placeDetailsResponseData.status).toEqual('OK');
      expect(placeDetailsResponseData.result.place_id).toEqual(SAMPLE_PLACE_ID);
      expect(placeDetailsResponseData.result.name).toEqual('MOCK NAME');
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('If response results in INVALID_REQUEST, no data should be present', async () => {
    customAxiosMockAdapter.mockInvalidRequestPlaceDetails();
    try {
      const placeDetailsResponseData = await googlePlaceService.getRestaurantDetails(
        'Non-existent placeId'
      );
      expect(placeDetailsResponseData.status).toEqual(Status.INVALID_REQUEST);
      expect(placeDetailsResponseData.result).toBeUndefined();
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Should be able to issue a refresh request and get back a new placeId with new placeDetails', async () => {
    const invalidPlaceId = 'invalid place id';
    const validRefreshedPlaceId = 'refreshed place id';

    customAxiosMockAdapter.mockSuccessfulRefreshRequest(
      invalidPlaceId,
      validRefreshedPlaceId
    );
    customAxiosMockAdapter.mockSuccessfulPlaceDetails(validRefreshedPlaceId);

    try {
      const refreshResult = await googlePlaceService.refreshPlaceId(
        invalidPlaceId
      );
      expect(refreshResult.placeId).toEqual(validRefreshedPlaceId);
      expect(refreshResult.restaurantDetails.place_id).toEqual(
        validRefreshedPlaceId
      );
      expect(refreshResult.restaurantDetails.name).toEqual('MOCK NAME');
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Should not fail if refresh request still results in not found', async () => {
    const invalidPlaceId = 'invalid place id';
    customAxiosMockAdapter.mockNotFoundRefreshRequest(invalidPlaceId);

    try {
      const refreshResult = await googlePlaceService.refreshPlaceId(
        invalidPlaceId
      );
      expect(refreshResult.placeId).toEqual('');
      expect(refreshResult.restaurantDetails).toEqual({});
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('If response results in NOT_FOUND, no data should be present', async () => {
    const invalidPlaceId = 'invalid place id';
    customAxiosMockAdapter.mockNotFoundPlaceDetails(invalidPlaceId);

    try {
      const placeDetailsResponseData = await googlePlaceService.getRestaurantDetails(
        invalidPlaceId
      );
      expect(placeDetailsResponseData.status).toEqual(Status.NOT_FOUND);
      expect(placeDetailsResponseData.result).toBeUndefined();
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });
});
