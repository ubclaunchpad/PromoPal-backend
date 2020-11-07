import { AxiosError } from 'axios';
import { GooglePlacesService } from '../../src/service/GooglePlacesService';
import * as dotenv from 'dotenv';

/* eslint-disable  @typescript-eslint/no-unused-vars */
// todo: remove eslint-disable once we add assertions
describe('Unit tests for GooglePlacesService', function () {
  const googlePlacesAPI = new GooglePlacesService();

  beforeEach(function () {
    dotenv.config();
  });

  test('Search for a place using restaurant name, should be successful', () => {
    return googlePlacesAPI
      .getGooglePlacesSearch('Jinya')
      .then((result: JSON) => {
        // todo: need some assertions
      })
      .catch((error: AxiosError) => {
        fail('Did not expect to fail: ' + error.message);
      });
  });

  test('Get details for a place using placeID, should be successful', () => {
    // placeID can only be retrieved from getGooglePlacesSearch
    return googlePlacesAPI
      .getGooglePlacesDetails('ChIJb0n5cWl3hlQRIbVGYLiTEgE')
      .then((result: JSON) => {
        // todo: need some assertions
      })
      .catch((error: AxiosError) => {
        fail('Did not expect to fail: ' + error.message);
      });
  });

  test('Get photo for a place using photoReference, should be successful', () => {
    // photoReference can only be retrieved from getGooglePlacesDetails or getGooglePlacesSearch
    const photoReference =
      'CmRaAAAAG0iboUiJEm5FgUDCJcrSzqQ7NIqks4WRG-fOqExf1Wy8BvNf57uOfoJttukezQH8Fo' +
      'Fp6xBo4HT07PqyBZGaSnv-zRakWaRpmm97BFKjlfigEHAOyXoHAKVharhRbkdKEhBt04bdMwjdPIABAINFpDuuGhQdc1q' +
      'P733fSMvzjtPByT9ETO-71Q';

    return googlePlacesAPI
      .getGooglePlacesPhotos(photoReference)
      .then((result: HTMLImageElement) => {
        // todo: need some assertions
      })
      .catch((error: AxiosError) => {
        fail('Did not expect to fail: ' + error.message);
      });
  });
});
