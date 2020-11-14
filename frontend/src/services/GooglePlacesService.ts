import axios, { AxiosError, AxiosResponse } from "axios";
import * as dotenv from "dotenv";

/* eslint-disable  no-console */
// todo: remove this eslint-disable
class GooglePlacesService {
  public currRestaurants: Map<string, Record<string, unknown>>;

  constructor() {
    dotenv.config();
    this.currRestaurants = new Map();
  }

  getRestaurantPlaceID(data: string): Promise<string> {
    const dataURI: string = encodeURIComponent(data);

    return axios
      .get(
        "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?",
        {
          params: {
            input: dataURI,
            inputtype: "textquery",
            fields: "place_id",
            key: process.env.GOOGLE_PLACES_API_KEY,
          },
        }
      )
      .then((response: AxiosResponse) => {
        const resultPlaceID: string = response.data.candidates?.[0].place_id;
        return Promise.resolve(resultPlaceID);
      })
      .catch((err: AxiosError) => {
        //Google API error message
        console.log(err?.response?.data?.error);

        //Axios entire error message
        console.log(err);

        return Promise.reject(err);
      });
  }

  getRestaurantDetails(placeID: string): Promise<Record<string, unknown>> {
    if (this.currRestaurants.has(placeID)) {
      const restaurantDetails = this.currRestaurants.get(placeID) as Record<
        string,
        unknown
      >;
      return Promise.resolve(restaurantDetails);
    }

    return axios
      .get("https://maps.googleapis.com/maps/api/place/details/json?", {
        params: {
          place_id: placeID,
          fields:
            "url,formatted_phone_number,opening_hours,website,review,photos,business_status," +
            "formatted_address,geometry,name,price_level,rating,user_ratings_total",
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      })
      .then((response: AxiosResponse) => {
        const restaurantDetails: Record<string, unknown> =
          response?.data?.result;
        this.currRestaurants.set(placeID, restaurantDetails);
        return Promise.resolve(restaurantDetails);
      })
      .catch((err: AxiosError) => {
        //Google API error message
        console.log(err?.response?.data?.error);

        //Axios entire error message
        console.log(err);

        return Promise.reject(err);
      });
  }

  getRestaurantPhoto(photoReference: string): Promise<HTMLImageElement> {
    return axios
      .get("https://maps.googleapis.com/maps/api/place/photo?", {
        params: {
          photoreference: photoReference,
          maxheight: 500, //todo: may need to adjust based on FE and restrictions
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      })
      .then((response: AxiosResponse) => {
        const result: HTMLImageElement = response.data;
        return Promise.resolve(result);
      })
      .catch((err: AxiosError) => {
        //Google API error message
        console.log(err?.response?.data?.error);

        //Axios entire error message
        console.log(err);

        return Promise.reject(err);
      });
  }
}

export { GooglePlacesService };
