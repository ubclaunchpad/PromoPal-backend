"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionQueryValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const PromotionType_1 = require("../data/PromotionType");
const CuisineType_1 = require("../data/CuisineType");
const DiscountType_1 = require("../data/DiscountType");
const Day_1 = require("../data/Day");
class PromotionQueryValidation {
}
exports.PromotionQueryValidation = PromotionQueryValidation;
PromotionQueryValidation.schema = joi_1.default.object({
    searchQuery: joi_1.default.string(),
    discountType: joi_1.default.string().valid(...Object.values(DiscountType_1.DiscountType)),
    discountValue: joi_1.default.number().positive().precision(2),
    promotionType: joi_1.default.string().valid(...Object.values(PromotionType_1.PromotionType)),
    cuisine: joi_1.default.alternatives(joi_1.default.string().valid(...Object.values(CuisineType_1.CuisineType)), joi_1.default.array()
        .min(1)
        .items(joi_1.default.string().valid(...Object.values(CuisineType_1.CuisineType)))),
    expirationDate: joi_1.default.date(),
    dayOfWeek: joi_1.default.string().valid(...Object.values(Day_1.Day)),
    userId: joi_1.default.string().uuid(),
})
    .required()
    .with('discountValue', 'discountType');
//# sourceMappingURL=PromotionQueryValidation.js.map