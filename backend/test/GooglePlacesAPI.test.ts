import {AxiosError, AxiosResponse} from "axios";

const {GooglePlacesAPI} = require('../controllers/GooglePlacesAPI');


describe("tests for GooglePlacesAPI", function () {

    let googlePlacesAPI = new GooglePlacesAPI();

    beforeEach(function () {
        require('dotenv').config();
    });

    test('Search for a place using restaurant name', () => {
        return googlePlacesAPI.getGooglePlacesSearch("Rib and Chicken")
            .then((result: AxiosResponse<JSON>) => {
                console.log(result);
            }).catch((error: AxiosError) => {
                console.log(error);
            });
    });

    test('Get details for a place using placeID', () => {
        // placeID can only be retrieved from getGooglePlacesSearch
        return googlePlacesAPI.getGooglePlacesDetails("ChIJb0n5cWl3hlQRIbVGYLiTEgE")
            .then((result: AxiosResponse<JSON>) => {
                console.log(result);
            }).catch((error: AxiosError) => {
                console.log(error);
            });
    });

});

