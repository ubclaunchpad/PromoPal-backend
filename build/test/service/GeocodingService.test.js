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
const GeocodingService_1 = require("../../main/service/GeocodingService");
const Utility_1 = require("../utility/Utility");
const BaseController_1 = require("../controller/BaseController");
describe('tests for Geocoding Service', function () {
    let geocodingService;
    beforeAll(() => {
        geocodingService = new GeocodingService_1.GeocodingService(BaseController_1.BaseController.createMockNodeGeocoder());
    });
    test('getting coordinates for Marutama Ramen', () => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield geocodingService.getGeoCoordinateFromAddress('780 Bidwell St, Vancouver, BC V6G 2J6');
            expect(result.lat).toEqual(49.2906033);
            expect(result.lon).toEqual(-123.1333902);
        }
        catch (e) {
            fail('Did not expect to fail: ' + e.message);
        }
    }));
    test('getting empty object for random invalid location', () => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield geocodingService.getGeoCoordinateFromAddress(Utility_1.randomString(30));
            expect(result).toEqual({});
        }
        catch (e) {
            fail('Did not expect to fail: ' + e.message);
        }
    }));
    test('getting empty object for empty string location', () => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield geocodingService.getGeoCoordinateFromAddress('');
            expect(result).toEqual({});
        }
        catch (e) {
            fail('Did not expect to fail: ' + e.message);
        }
    }));
});
//# sourceMappingURL=GeocodingService.test.js.map