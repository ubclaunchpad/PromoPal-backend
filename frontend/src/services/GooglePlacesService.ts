import axios, { AxiosError, AxiosResponse } from "axios";
import * as dotenv from "dotenv";
import { RestaurantDetails } from ".././types/RestaurantDetails";

/* eslint-disable  no-console */
// todo: remove this eslint-disable
class GooglePlacesService {
  public currRestaurants: Map<string, RestaurantDetails>;

  constructor() {
    dotenv.config();
    this.currRestaurants = new Map();
  }

  getRestaurantPlaceID(
    restaurantName: string,
    restaurantLocation: string
  ): Promise<string> {
    const dataURI: string = encodeURIComponent(restaurantName);
    let responseData: any[];

    return axios
      .get(
        "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?",
        {
          params: {
            input: dataURI,
            inputtype: "textquery",
            fields: "place_id",
            key: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
          },
        }
      )
      .then((response: AxiosResponse) => {
        if (response.data.candidates.length === 1) {
          return Promise.resolve(response.data.candidates[0].place_id);
        }
        const promises: Array<Promise<boolean>> = [];
        responseData = response.data.candidates;

        for (const currPlace of response.data.candidates) {
          promises.push(
            this.isCorrectRestaurantLocation(
              restaurantLocation,
              currPlace.place_id
            )
          );
        }

        return Promise.all(promises);
      })
      .then((result: Array<boolean>) => {
        if (!Array.isArray(result)) {
          return Promise.resolve(result);
        }

        for (let i = 0; i < result.length; i++) {
          if (result[i]) {
            return Promise.resolve(responseData[i].place_id);
          }
        }

        return Promise.reject("No restaurant location matched search");
      })
      .catch((err: AxiosError) => {
        //Google API error message
        console.log(err?.response?.data?.error);

        //Axios entire error message
        console.log(err);

        return Promise.reject(err);
      });
  }

  isCorrectRestaurantLocation(
    restaurantLocation: string,
    currPlaceID: string
  ): Promise<boolean> {
    return axios
      .get("https://maps.googleapis.com/maps/api/place/details/json?", {
        params: {
          place_id: currPlaceID,
          fields: "formatted_address",
          key: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
        },
      })
      .then((response: AxiosResponse) => {
        const currRestaurantAddress = response?.data?.result?.formatted_address;
        if (currRestaurantAddress.includes(restaurantLocation)) {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      })
      .catch((err: AxiosError) => {
        //Google API error message
        console.log(err?.response?.data?.error);

        //Axios entire error message
        console.log(err);

        return Promise.reject(err);
      });
  }

  getRestaurantDetails(placeID: string): Promise<RestaurantDetails> {
    if (this.currRestaurants.has(placeID)) {
      const restaurantDetails = this.currRestaurants.get(
        placeID
      ) as RestaurantDetails;
      return Promise.resolve(restaurantDetails);
    }

    return axios
      .get("https://maps.googleapis.com/maps/api/place/details/json?", {
        params: {
          place_id: placeID,
          fields:
            "url,formatted_phone_number,opening_hours,website,review,photos,business_status," +
            "formatted_address,geometry,name,price_level,rating,user_ratings_total",
          key: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
        },
      })
      .then((response: AxiosResponse) => {
        const restaurantResults = response?.data?.result;
        const restaurant = {
          name: restaurantResults.name,
          price_level: restaurantResults.price_level,
          rating: restaurantResults.rating,
          total_rating: restaurantResults.user_ratings_total,
          map_url: restaurantResults.url,
          phone_number: restaurantResults.formatted_phone_number,
          opening_hours: restaurantResults.opening_hours,
          website: restaurantResults.website,
          reviews: restaurantResults.reviews,
          photos: restaurantResults.photos,
          business_status: restaurantResults.business_status,
          address: restaurantResults.formatted_address,
          lat: restaurantResults.geometry?.location?.lat,
          lon: restaurantResults.geometry?.location?.lng,
        };

        this.currRestaurants.set(placeID, restaurant);
        return Promise.resolve(restaurant);
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
          key: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
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
