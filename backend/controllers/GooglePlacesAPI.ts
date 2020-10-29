import {AxiosError, AxiosResponse} from "axios";

class GooglePlacesAPI {

    constructor() {
        require('dotenv').config();
    }

    getGooglePlacesSearch(data: string): Promise<AxiosResponse<JSON>> {
        let dataURI: string = encodeURIComponent(data);
        let axios = require('axios');

        return axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?'
            + 'input=' + dataURI
            + '&inputtype=textquery'
            + '&fields=formatted_address,name,icon,place_id,types,photos'
            + '&key=' + process.env.GOOGLE_PLACES_API_KEY
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

    getGooglePlacesDetails(placeID: string): Promise<AxiosResponse<JSON>> {
        let axios = require('axios');

        return axios.get('https://maps.googleapis.com/maps/api/place/details/json?'
            + 'place_id=' + placeID
            + '&fields=business_status,url'
            + '&key=' + process.env.GOOGLE_PLACES_API_KEY
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
}

module.exports.GooglePlacesAPI = GooglePlacesAPI;
