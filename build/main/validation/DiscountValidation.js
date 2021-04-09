"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const DiscountType_1 = require("../data/DiscountType");
class DiscountValidation {
}
exports.DiscountValidation = DiscountValidation;
DiscountValidation.schema = joi_1.default.object({
    discountType: joi_1.default.string()
        .valid(...Object.values(DiscountType_1.DiscountType))
        .required(),
    discountValue: joi_1.default.number().strict().positive().precision(2).required(),
}).required();
//# sourceMappingURL=DiscountValidation.js.map