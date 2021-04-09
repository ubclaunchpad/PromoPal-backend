"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const PromotionType_1 = require("../data/PromotionType");
const CuisineType_1 = require("../data/CuisineType");
const DiscountValidation_1 = require("./DiscountValidation");
const IdValidation_1 = require("./IdValidation");
const ScheduleValidation_1 = require("./ScheduleValidation");
class PromotionValidation {
}
exports.PromotionValidation = PromotionValidation;
PromotionValidation.schema = joi_1.default.object({
    userId: IdValidation_1.IdValidation.schema,
    placeId: joi_1.default.string().required(),
    discount: DiscountValidation_1.DiscountValidation.schema,
    schedules: joi_1.default.array()
        .unique('dayOfWeek', { ignoreUndefined: true })
        .min(1)
        .max(7)
        .items(ScheduleValidation_1.ScheduleValidation.schema)
        .required(),
    promotionType: joi_1.default.string()
        .valid(...Object.values(PromotionType_1.PromotionType))
        .required(),
    cuisine: joi_1.default.string()
        .valid(...Object.values(CuisineType_1.CuisineType))
        .required(),
    name: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    startDate: joi_1.default.date()
        .max(joi_1.default.ref('expirationDate'))
        .empty(null)
        .default(new Date()),
    expirationDate: joi_1.default.date().required(),
    address: joi_1.default.string().required(),
}).required();
//# sourceMappingURL=PromotionValidation.js.map