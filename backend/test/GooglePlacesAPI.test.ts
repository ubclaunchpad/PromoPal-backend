import {AxiosError, AxiosResponse} from "axios";
const {GooglePlacesAPI} = require('../controllers/GooglePlacesAPI');

describe("tests for GooglePlacesAPI", function () {

    let googlePlacesAPI = new GooglePlacesAPI();

    beforeEach(function () {
        require('dotenv').config();
    });

    test('Search for a place using restaurant name', () => {
        return googlePlacesAPI.getGooglePlacesSearch("Jinya")
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

    test("Get photo for a place using photoReference", () => {
        // photoReference can only be retrieved from getGooglePlacesDetails or getGooglePlacesSearch
        let photoReference = "CmRaAAAAG0iboUiJEm5FgUDCJcrSzqQ7NIqks4WRG-fOqExf1Wy8BvNf57uOfoJttukezQH8Fo" +
            "Fp6xBo4HT07PqyBZGaSnv-zRakWaRpmm97BFKjlfigEHAOyXoHAKVharhRbkdKEhBt04bdMwjdPIABAINFpDuuGhQdc1q" +
            "P733fSMvzjtPByT9ETO-71Q"

        return googlePlacesAPI.getGooglePlacesPhotos(photoReference)
            .then((result: AxiosResponse<HTMLImageElement>) => {
                console.log(result);
            }).catch((error: AxiosError) => {
                console.log(error);
            });
    });

});

