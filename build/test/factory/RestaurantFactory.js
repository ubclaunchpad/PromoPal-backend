"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantFactory = void 0;
const Restaurant_1 = require("../../main/entity/Restaurant");
const Utility_1 = require("../utility/Utility");
class RestaurantFactory {
    generate(placeId, lat, lon) {
        return new Restaurant_1.Restaurant(placeId !== null && placeId !== void 0 ? placeId : Utility_1.randomString(10), lat !== null && lat !== void 0 ? lat : Utility_1.randomLatitude(), lon !== null && lon !== void 0 ? lon : Utility_1.randomLongitude());
    }
}
exports.RestaurantFactory = RestaurantFactory;
//# sourceMappingURL=RestaurantFactory.js.map