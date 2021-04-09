"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedPromotionFactory = void 0;
const SavedPromotion_1 = require("../../main/entity/SavedPromotion");
class SavedPromotionFactory {
    generate(user, promotion) {
        return new SavedPromotion_1.SavedPromotion(user, promotion);
    }
}
exports.SavedPromotionFactory = SavedPromotionFactory;
//# sourceMappingURL=SavedPromotionFactory.js.map