import express, { Router } from 'express';
import { PromotionController } from '../controller/PromotionController';

export class PromotionRouter {
  private promotionRouter = express.Router();
  private promotionController;
  constructor(promotionController: PromotionController) {
    this.promotionController = promotionController;
  }

  getRoutes(): Router {
    this.promotionRouter.get('/', this.promotionController.getAllPromotions);
    this.promotionRouter.get('/:id', this.promotionController.getPromotion);
    this.promotionRouter.post('/', this.promotionController.addPromotion);
    this.promotionRouter.delete(
      '/:id',
      this.promotionController.deletePromotion
    );
    this.promotionRouter.post(
      '/:id/upVote',
      this.promotionController.upVotePromotion
    );
    this.promotionRouter.post(
      '/:id/downVote',
      this.promotionController.downVotePromotion
    );
    this.promotionRouter.get(
      '/:id/restaurantDetails/:placeId',
      this.promotionController.getRestaurantDetails
    );
    return this.promotionRouter;
  }
}
