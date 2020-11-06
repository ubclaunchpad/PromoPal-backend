import axios, {AxiosError, AxiosResponse} from "axios";

class GooglePlacesAPI {

    constructor() {
        require('dotenv').config();
    }

    getGooglePlacesSearch(data: string): Promise<JSON> {
        let dataURI: string = encodeURIComponent(data);

        return axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?',
            {
                params: {
                    input: dataURI,
                    inputtype: 'textquery',
                    fields: 'business_status,formatted_address,geometry,name,place_id,' +
                        'price_level,rating,user_ratings_total',
                    key: process.env.GOOGLE_PLACES_API_KEY
                }
            }
        )
            .then((response: AxiosResponse) => {

                let result: JSON = response.data
                return Promise.resolve(result);

            })
            .catch((err: AxiosError) => {

                //Google API error message
                console.log(err?.response?.data?.error)

                //Axios entire error message
                console.log(err)

                return Promise.reject(err);
            });
    }

    getGooglePlacesDetails(placeID: string): Promise<JSON> {
        return axios.get('https://maps.googleapis.com/maps/api/place/details/json?',
            {
                params: {
                    place_id: placeID,
                    fields: 'url,formatted_phone_number,opening_hours,website,review,photos',
                    key: process.env.GOOGLE_PLACES_API_KEY
                }
            }
        )
            .then((response: AxiosResponse) => {

                let result: JSON = response.data
                return Promise.resolve(result);

            })
            .catch((err: AxiosError) => {

                //Google API error message
                console.log(err?.response?.data?.error)

                //Axios entire error message
                console.log(err)

                return Promise.reject(err);
            });
    }

    getGooglePlacesPhotos(photoReference: string): Promise<HTMLImageElement> {
        return axios.get('https://maps.googleapis.com/maps/api/place/photo?',
            {
                params: {
                    photoreference: photoReference,
                    maxheight: 500,
                    key: process.env.GOOGLE_PLACES_API_KEY
                }
            }
        )
            .then((response: AxiosResponse) => {

                let result: HTMLImageElement = response.data;
                return Promise.resolve(result);

            })
            .catch((err: AxiosError) => {

                //Google API error message
                console.log(err?.response?.data?.error)

                //Axios entire error message
                console.log(err)

                return Promise.reject(err);
            });
    }
}

export { GooglePlacesAPI };
