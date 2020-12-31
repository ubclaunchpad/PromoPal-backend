import axios, { AxiosError, AxiosResponse } from "axios";
import * as dotenv from "dotenv";
import { RestaurantDetails } from ".././types/RestaurantDetails";
import {RestaurantInfo} from "../types/RestaurantInfo";

class GooglePlacesService {
  // maintains a mapping of restaurant placeIDs with associated restaurant details (see types)
  public currRestaurants: Map<string, RestaurantDetails>;

  constructor() {
    dotenv.config();
    this.currRestaurants = new Map();
  }

  // gets the placeID, lat and lon associated with restaurant
  // for restaurants with multiple locations, verified with string "includes" with user-inputted location
  getRestaurantInfo(
    restaurantName: string,
    restaurantLocation: string
  ): Promise<RestaurantInfo> {
    const dataURI: string = encodeURIComponent(restaurantName);
    let responseData: any[];

    return axios
      .get(
        "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?",
        {
          params: {
            input: dataURI,
            inputtype: "textquery",
            fields: "place_id,formatted_address,geometry",
            key: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
          },
        }
      )
      .then((response: AxiosResponse) => {
        responseData = response.data?.candidates;
        let matchingRestaurant;

        if (responseData.length === 1) {
          matchingRestaurant = responseData[0];
        } else {
          // handles situation where there are multiple restaurants with given restaurant name
          // todo: incorporate autocomplete feature - https://github.com/ubclaunchpad/foodies/issues/96
          for(const currPlace of responseData) {
            if (currPlace.formatted_address.includes(restaurantLocation)) {
              matchingRestaurant = currPlace;
            }
          }
        }

        if(matchingRestaurant) {
          const restaurant: RestaurantInfo =  {
            placeID: matchingRestaurant.place_id,
            lat: matchingRestaurant.geometry?.location?.lat,
            lon: matchingRestaurant.geometry?.location?.lng,
          }
          return Promise.resolve(restaurant);
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

  // gets all restaurant details for certain placeID
  getRestaurantDetails(placeID: string): Promise<RestaurantDetails> {

    // if mapping already contains this placeID, return value
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

  // gets photos for certain placeID
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
