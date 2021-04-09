"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GooglePlacesService = exports.restaurantDetailsFields = void 0;
const PlaceField_1 = require("../data/PlaceField");
exports.restaurantDetailsFields = [
    PlaceField_1.PlaceField.URL,
    PlaceField_1.PlaceField.FORMATTED_PHONE_NUMBER,
    PlaceField_1.PlaceField.WEBSITE,
    PlaceField_1.PlaceField.REVIEWS,
    PlaceField_1.PlaceField.PHOTOS,
    PlaceField_1.PlaceField.BUSINESS_STATUS,
    PlaceField_1.PlaceField.FORMATTED_ADDRESS,
    PlaceField_1.PlaceField.GEOMETRY,
    PlaceField_1.PlaceField.NAME,
    PlaceField_1.PlaceField.PRICE_LEVEL,
    PlaceField_1.PlaceField.RATING,
    PlaceField_1.PlaceField.USER_RATINGS_TOTAL,
];
class GooglePlacesService {
    constructor(client) {
        this.client = client;
    }
    getRestaurantDetails(place_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const placeDetailsResponse = yield this.client.placeDetails({
                params: {
                    place_id,
                    key: process.env.GOOGLE_API_KEY,
                    fields: exports.restaurantDetailsFields,
                },
            });
            return placeDetailsResponse.data;
        });
    }
    refreshPlaceId(nonExistentPlaceId) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const refreshResult = {
                placeId: '',
                restaurantDetails: {},
            };
            const refreshResponse = yield this.client.placeDetails({
                params: {
                    place_id: nonExistentPlaceId,
                    key: process.env.GOOGLE_API_KEY,
                    fields: [PlaceField_1.PlaceField.PLACE_ID],
                },
            });
            refreshResult.placeId = (_b = (_a = refreshResponse.data.result) === null || _a === void 0 ? void 0 : _a.place_id) !== null && _b !== void 0 ? _b : '';
            if (refreshResult.placeId) {
                const placeDetailsResponseData = yield this.getRestaurantDetails(refreshResult.placeId);
                refreshResult.restaurantDetails = (_c = placeDetailsResponseData === null || placeDetailsResponseData === void 0 ? void 0 : placeDetailsResponseData.result) !== null && _c !== void 0 ? _c : {};
            }
            return refreshResult;
        });
    }
}
exports.GooglePlacesService = GooglePlacesService;
//# sourceMappingURL=GooglePlacesService.js.map