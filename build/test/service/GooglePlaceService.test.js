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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const axios_1 = __importDefault(require("axios"));
const CustomAxiosMockAdapter_1 = require("../mock/CustomAxiosMockAdapter");
const GooglePlacesService_1 = require("../../main/service/GooglePlacesService");
describe('Unit tests for GooglePlacesService', function () {
    const SAMPLE_PLACE_ID = 'ChIJb0n5cWl3hlQRIbVGYLiTEgE';
    let googlePlacesService;
    let customAxiosMockAdapter;
    beforeEach(() => {
        const axiosInstance = axios_1.default.create();
        googlePlacesService = new GooglePlacesService_1.GooglePlacesService(new google_maps_services_js_1.Client({ axiosInstance }));
        customAxiosMockAdapter = new CustomAxiosMockAdapter_1.CustomAxiosMockAdapter(axiosInstance);
    });
    test('Should be able to successfully get place details', () => __awaiter(this, void 0, void 0, function* () {
        customAxiosMockAdapter.mockSuccessfulPlaceDetails(SAMPLE_PLACE_ID);
        try {
            const placeDetailsResponseData = yield googlePlacesService.getRestaurantDetails(SAMPLE_PLACE_ID);
            expect(placeDetailsResponseData.status).toEqual('OK');
            expect(placeDetailsResponseData.result.place_id).toEqual(SAMPLE_PLACE_ID);
            expect(placeDetailsResponseData.result.name).toEqual('MOCK NAME');
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('If response results in INVALID_REQUEST, no data should be present', () => __awaiter(this, void 0, void 0, function* () {
        customAxiosMockAdapter.mockInvalidRequestPlaceDetails();
        try {
            const placeDetailsResponseData = yield googlePlacesService.getRestaurantDetails('Non-existent placeId');
            expect(placeDetailsResponseData.status).toEqual(google_maps_services_js_1.Status.INVALID_REQUEST);
            expect(placeDetailsResponseData.result).toBeUndefined();
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Should be able to issue a refresh request and get back a new placeId with new placeDetails', () => __awaiter(this, void 0, void 0, function* () {
        const invalidPlaceId = 'invalid place id';
        const validRefreshedPlaceId = 'refreshed place id';
        customAxiosMockAdapter.mockSuccessfulRefreshRequest(invalidPlaceId, validRefreshedPlaceId);
        customAxiosMockAdapter.mockSuccessfulPlaceDetails(validRefreshedPlaceId);
        try {
            const refreshResult = yield googlePlacesService.refreshPlaceId(invalidPlaceId);
            expect(refreshResult.placeId).toEqual(validRefreshedPlaceId);
            expect(refreshResult.restaurantDetails.place_id).toEqual(validRefreshedPlaceId);
            expect(refreshResult.restaurantDetails.name).toEqual('MOCK NAME');
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Should not fail if refresh request still results in not found', () => __awaiter(this, void 0, void 0, function* () {
        const invalidPlaceId = 'invalid place id';
        customAxiosMockAdapter.mockNotFoundRefreshRequest(invalidPlaceId);
        try {
            const refreshResult = yield googlePlacesService.refreshPlaceId(invalidPlaceId);
            expect(refreshResult.placeId).toEqual('');
            expect(refreshResult.restaurantDetails).toEqual({});
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('If response results in NOT_FOUND, no data should be present', () => __awaiter(this, void 0, void 0, function* () {
        const invalidPlaceId = 'invalid place id';
        customAxiosMockAdapter.mockNotFoundPlaceDetails(invalidPlaceId);
        try {
            const placeDetailsResponseData = yield googlePlacesService.getRestaurantDetails(invalidPlaceId);
            expect(placeDetailsResponseData.status).toEqual(google_maps_services_js_1.Status.NOT_FOUND);
            expect(placeDetailsResponseData.result).toBeUndefined();
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
});
//# sourceMappingURL=GooglePlaceService.test.js.map