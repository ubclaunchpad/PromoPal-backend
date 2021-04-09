"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionFactory = void 0;
const PromotionType_1 = require("../../main/data/PromotionType");
const CuisineType_1 = require("../../main/data/CuisineType");
const Promotion_1 = require("../../main/entity/Promotion");
const Utility_1 = require("../utility/Utility");
const DiscountFactory_1 = require("./DiscountFactory");
const ScheduleFactory_1 = require("./ScheduleFactory");
const RestaurantFactory_1 = require("./RestaurantFactory");
class PromotionFactory {
    generate(user, discount, restaurant, schedules, promotionType, cuisine, name, description, startDate, expirationDate) {
        return new Promotion_1.Promotion(user, discount, restaurant, schedules, promotionType !== null && promotionType !== void 0 ? promotionType : PromotionType_1.PromotionType.DINNER_SPECIAL, cuisine !== null && cuisine !== void 0 ? cuisine : CuisineType_1.CuisineType.AFGHAN, name !== null && name !== void 0 ? name : Utility_1.randomString(10), description !== null && description !== void 0 ? description : Utility_1.randomString(100), startDate !== null && startDate !== void 0 ? startDate : new Date(), expirationDate !== null && expirationDate !== void 0 ? expirationDate : new Date());
    }
    generateWithRelatedEntities(user) {
        return this.generate(user, new DiscountFactory_1.DiscountFactory().generate(), new RestaurantFactory_1.RestaurantFactory().generate(), [new ScheduleFactory_1.ScheduleFactory().generate()]);
    }
}
exports.PromotionFactory = PromotionFactory;
//# sourceMappingURL=PromotionFactory.js.map