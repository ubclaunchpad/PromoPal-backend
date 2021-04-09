"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountFactory = void 0;
const DiscountType_1 = require("../../main/data/DiscountType");
const Discount_1 = require("../../main/entity/Discount");
class DiscountFactory {
    generate(discountType, discountValue) {
        return new Discount_1.Discount(discountType !== null && discountType !== void 0 ? discountType : DiscountType_1.DiscountType.AMOUNT, discountValue !== null && discountValue !== void 0 ? discountValue : 188.08);
    }
}
exports.DiscountFactory = DiscountFactory;
//# sourceMappingURL=DiscountFactory.js.map