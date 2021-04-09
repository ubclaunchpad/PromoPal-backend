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
exports.GeocodingService = void 0;
class GeocodingService {
    constructor(nodeGeocoder) {
        this.geocoder = nodeGeocoder;
    }
    getGeoCoordinateFromAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const entries = yield this.geocoder.geocode(address);
            const result = {};
            if (entries === null || entries === void 0 ? void 0 : entries.length) {
                const geocodeResult = entries[0];
                result.lat = geocodeResult.latitude;
                result.lon = geocodeResult.longitude;
            }
            return result;
        });
    }
}
exports.GeocodingService = GeocodingService;
//# sourceMappingURL=GeocodingService.js.map