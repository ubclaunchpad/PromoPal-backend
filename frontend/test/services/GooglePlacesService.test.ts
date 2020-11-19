import { AxiosError } from "axios";
import { GooglePlacesService } from "../../src/services/GooglePlacesService";
import { RestaurantDetails } from "../../src/types/RestaurantDetails";

/* eslint-disable  @typescript-eslint/no-unused-vars */
// todo: remove eslint-disable once we add assertions
describe("Unit tests for GooglePlacesService", function () {
  const googlePlacesAPI = new GooglePlacesService();

  test("Search for a place using restaurant name and location, should be successful", () => {
    return googlePlacesAPI
      .getRestaurantPlaceID("Jinya", "Robson St")
      .then((result: string) => {
        expect(result).toEqual("ChIJ4dRcUH5xhlQREcvYYxzhqv0");
      })
      .catch((error: AxiosError) => {
        fail("Did not expect to fail: " + error.message);
      });
  });

  test("Search for a restaurant franchines using name and location, should be successful", () => {
    return googlePlacesAPI
      .getRestaurantPlaceID("SURA", "Robson St")
      .then((result: string) => {
        expect(result).toEqual("ChIJcw7-mYdxhlQRxq9ZD4tvuH0");
      })
      .catch((error: AxiosError) => {
        fail("Did not expect to fail: " + error.message);
      });
  });

  test("Get details for a place using placeID, should be successful", () => {
    // placeID can only be retrieved from getGooglePlacesSearch
    return googlePlacesAPI
      .getRestaurantDetails("ChIJb0n5cWl3hlQRIbVGYLiTEgE")
      .then((result: RestaurantDetails) => {
        expect(result).toHaveProperty("business_status");
        expect(result).toHaveProperty("address");
        expect(result).toHaveProperty("phone_number");
        expect(result).toHaveProperty("lat");
        expect(result).toHaveProperty("lon");
        expect(result).toHaveProperty("name", "RIB & CHICKEN");
        expect(result).toHaveProperty("opening_hours");
        expect(result).toHaveProperty("photos");
        expect(result).toHaveProperty("rating", 4.6);
        expect(result).toHaveProperty("reviews");
        expect(result).toHaveProperty(
          "map_url",
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
      .then((result: RestaurantDetails) => {
        const restaurant = googlePlacesAPI.currRestaurants.get(
          "ChIJb0n5cWl3hlQRIbVGYLiTEgE"
        );
        expect(
          googlePlacesAPI.currRestaurants.has("ChIJb0n5cWl3hlQRIbVGYLiTEgE")
        ).toBeTruthy();
        expect(restaurant).toHaveProperty(
          "map_url",
          "https://maps.google.com/?cid=77286563717231905"
        );
        expect(restaurant).toHaveProperty("total_rating", 67);
        expect(restaurant).toHaveProperty(
          "website",
          "https://www.ribandchicken.ca/"
        );
      })
      .catch((error: AxiosError) => {
        fail("Did not expect to fail: " + error.message);
      });
  });

  test("Check multiple calls work with currRestaurants map", () => {
    return googlePlacesAPI
      .getRestaurantDetails("ChIJb0n5cWl3hlQRIbVGYLiTEgE")
      .then((result: RestaurantDetails) => {
        return googlePlacesAPI.getRestaurantDetails(
          "ChIJb0n5cWl3hlQRIbVGYLiTEgE"
        );
      })
      .then((resultTwo: RestaurantDetails) => {
        const restaurant = googlePlacesAPI.currRestaurants.get(
          "ChIJb0n5cWl3hlQRIbVGYLiTEgE"
        );
        expect(
          googlePlacesAPI.currRestaurants.has("ChIJb0n5cWl3hlQRIbVGYLiTEgE")
        ).toBeTruthy();
        expect(restaurant).toHaveProperty(
          "map_url",
          "https://maps.google.com/?cid=77286563717231905"
        );
        expect(restaurant).toHaveProperty(
          "website",
          "https://www.ribandchicken.ca/"
        );
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
