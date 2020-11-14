import { AxiosError } from "axios";
import { GooglePlacesService } from "../../src/services/GooglePlacesService";
import * as dotenv from "dotenv";

/* eslint-disable  @typescript-eslint/no-unused-vars */
// todo: remove eslint-disable once we add assertions
describe("Unit tests for GooglePlacesService", function () {
  const googlePlacesAPI = new GooglePlacesService();

  beforeEach(function () {
    dotenv.config();
  });

  test("Search for a place using restaurant name, should be successful", () => {
    return googlePlacesAPI
      .getRestaurantPlaceID("Jinya")
      .then((result: string) => {
        expect(result).toEqual("ChIJ4dRcUH5xhlQREcvYYxzhqv0");
      })
      .catch((error: AxiosError) => {
        fail("Did not expect to fail: " + error.message);
      });
  });

  test("Get details for a place using placeID, should be successful", () => {
    // placeID can only be retrieved from getGooglePlacesSearch
    return googlePlacesAPI
      .getRestaurantDetails("ChIJb0n5cWl3hlQRIbVGYLiTEgE")
      .then((result: Record<string, unknown>) => {
        expect(result).toHaveProperty("business_status");
        expect(result).toHaveProperty("formatted_address");
        expect(result).toHaveProperty("formatted_phone_number");
        expect(result).toHaveProperty("geometry");
        expect(result).toHaveProperty("name", "RIB & CHICKEN");
        expect(result).toHaveProperty("opening_hours");
        expect(result).toHaveProperty("photos");
        expect(result).toHaveProperty("rating", 4.7);
        expect(result).toHaveProperty("reviews");
        expect(result).toHaveProperty(
          "url",
          "https://maps.google.com/?cid=77286563717231905"
        );
        expect(result).toHaveProperty(
          "website",
          "https://www.ribandchicken.ca/"
        );
      })
      .catch((error: AxiosError) => {
        fail("Did not expect to fail: " + error.message);
      });
  });

  test("Check currRestaurants map is storing correctly", () => {
    return googlePlacesAPI
      .getRestaurantDetails("ChIJb0n5cWl3hlQRIbVGYLiTEgE")
      .then((result: Record<string, unknown>) => {
        expect(
          googlePlacesAPI.currRestaurants.has("ChIJb0n5cWl3hlQRIbVGYLiTEgE")
        ).toBeTruthy();
        expect(
          googlePlacesAPI.currRestaurants.get("ChIJb0n5cWl3hlQRIbVGYLiTEgE")
        ).toHaveProperty(
          "url",
          "https://maps.google.com/?cid=77286563717231905"
        );
        expect(
          googlePlacesAPI.currRestaurants.get("ChIJb0n5cWl3hlQRIbVGYLiTEgE")
        ).toHaveProperty("user_ratings_total", 66);
        expect(
          googlePlacesAPI.currRestaurants.get("ChIJb0n5cWl3hlQRIbVGYLiTEgE")
        ).toHaveProperty("website", "https://www.ribandchicken.ca/");
      })
      .catch((error: AxiosError) => {
        fail("Did not expect to fail: " + error.message);
      });
  });

  test("Check multiple calls work with currRestaurants map", () => {
    return googlePlacesAPI
      .getRestaurantDetails("ChIJb0n5cWl3hlQRIbVGYLiTEgE")
      .then((result: Record<string, unknown>) => {
        return googlePlacesAPI.getRestaurantDetails(
          "ChIJb0n5cWl3hlQRIbVGYLiTEgE"
        );
      })
      .then((resultTwo: Record<string, unknown>) => {
        expect(
          googlePlacesAPI.currRestaurants.has("ChIJb0n5cWl3hlQRIbVGYLiTEgE")
        ).toBeTruthy();
        expect(
          googlePlacesAPI.currRestaurants.get("ChIJb0n5cWl3hlQRIbVGYLiTEgE")
        ).toHaveProperty(
          "url",
          "https://maps.google.com/?cid=77286563717231905"
        );
        expect(
          googlePlacesAPI.currRestaurants.get("ChIJb0n5cWl3hlQRIbVGYLiTEgE")
        ).toHaveProperty("website", "https://www.ribandchicken.ca/");
      })
      .catch((error: AxiosError) => {
        fail("Did not expect to fail: " + error.message);
      });
  });

  test("Get photo for a place using photoReference, should be successful", () => {
    // photoReference can only be retrieved from getGooglePlacesDetails or getGooglePlacesSearch
    const photoReference =
      "CmRaAAAAG0iboUiJEm5FgUDCJcrSzqQ7NIqks4WRG-fOqExf1Wy8BvNf57uOfoJttukezQH8Fo" +
      "Fp6xBo4HT07PqyBZGaSnv-zRakWaRpmm97BFKjlfigEHAOyXoHAKVharhRbkdKEhBt04bdMwjdPIABAINFpDuuGhQdc1q" +
      "P733fSMvzjtPByT9ETO-71Q";
    return googlePlacesAPI
      .getRestaurantPhoto(photoReference)
      .then((result: HTMLImageElement) => {
        // todo: need some assertions
      })
      .catch((error: AxiosError) => {
        fail("Did not expect to fail: " + error.message);
      });
  });
});
