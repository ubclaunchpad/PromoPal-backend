import express, { Router } from 'express';
import { PromotionController } from '../controller/PromotionController';

export class PromotionRouter {
  private promotionRouter = express.Router();
  private promotionController = new PromotionController();
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
    return this.promotionRouter;
  }
}
