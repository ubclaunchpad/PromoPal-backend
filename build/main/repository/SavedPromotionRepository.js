"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedPromotionRepository = void 0;
const typeorm_1 = require("typeorm");
const SavedPromotion_1 = require("../entity/SavedPromotion");
let SavedPromotionRepository = class SavedPromotionRepository extends typeorm_1.Repository {
    addSavedPromotions(user, promotions) {
        const promises = promotions.map((promotion) => {
            return this.save(new SavedPromotion_1.SavedPromotion(user, promotion));
        });
        return Promise.all(promises).catch((error) => {
            return error;
        });
    }
    addSavedPromotion(user, promotion) {
        return this.save(new SavedPromotion_1.SavedPromotion(user, promotion));
    }
    deleteSavedPromotion(user, promotion) {
        return this.delete({ userId: user.id, promotionId: promotion.id });
    }
};
SavedPromotionRepository = __decorate([
    typeorm_1.EntityRepository(SavedPromotion_1.SavedPromotion)
], SavedPromotionRepository);
exports.SavedPromotionRepository = SavedPromotionRepository;
//# sourceMappingURL=SavedPromotionRepository.js.map