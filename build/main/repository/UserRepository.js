"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
const SavedPromotion_1 = require("../entity/SavedPromotion");
let UserRepository = class UserRepository extends typeorm_1.Repository {
    findByName(firstName, lastName) {
        return this.findOne({ firstName, lastName });
    }
    findByFirebaseId(firebaseId, options) {
        return this.findOneOrFail({ firebaseId }, options);
    }
    addSavedPromotions(user, promotions) {
        const savedPromotions = promotions.map((promotion) => {
            return new SavedPromotion_1.SavedPromotion(user, promotion);
        });
        if (user.savedPromotions) {
            user.savedPromotions.concat(savedPromotions);
        }
        else {
            user.savedPromotions = savedPromotions;
        }
        return this.save(user);
    }
};
UserRepository = __decorate([
    typeorm_1.EntityRepository(User_1.User)
], UserRepository);
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map