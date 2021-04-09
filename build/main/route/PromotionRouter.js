"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionRouter = void 0;
const express_1 = __importDefault(require("express"));
class PromotionRouter {
    constructor(promotionController, firebaseAuthMiddleware) {
        this.promotionRouter = express_1.default.Router();
        this.promotionController = promotionController;
        this.firebaseAuthMiddleware = firebaseAuthMiddleware;
    }
    getRoutes() {
        this.promotionRouter.get('/', this.promotionController.getAllPromotions);
        this.promotionRouter.get('/:id', this.promotionController.getPromotion);
        this.promotionRouter.post('/', this.promotionController.addPromotion);
        this.promotionRouter.delete('/:id', this.firebaseAuthMiddleware.isAuthorizedForProtection, this.promotionController.deletePromotion);
        this.promotionRouter.post('/:id/upVote', this.promotionController.upVotePromotion);
        this.promotionRouter.post('/:id/downVote', this.promotionController.downVotePromotion);
        return this.promotionRouter;
    }
}
exports.PromotionRouter = PromotionRouter;
//# sourceMappingURL=PromotionRouter.js.map