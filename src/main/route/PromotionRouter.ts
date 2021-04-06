import express, { Router } from 'express';
import { PromotionController } from '../controller/PromotionController';
import { FirebaseAuthMiddleware } from '../middleware/FirebaseAuthMiddleware';

export class PromotionRouter {
  private promotionRouter = express.Router();
  private promotionController;
  private firebaseAuthMiddleware: FirebaseAuthMiddleware;

  constructor(
    promotionController: PromotionController,
    firebaseAuthMiddleware: FirebaseAuthMiddleware
  ) {
    this.promotionController = promotionController;
    this.firebaseAuthMiddleware = firebaseAuthMiddleware;
  }

  getRoutes(): Router {
    this.promotionRouter.get('/', this.promotionController.getAllPromotions);
    this.promotionRouter.get('/:id', this.promotionController.getPromotion);
    this.promotionRouter.post('/', this.promotionController.addPromotion);
    this.promotionRouter.delete(
      '/:id',
      this.firebaseAuthMiddleware.isAuthorizedForProtection,
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
    return this.promotionRouter;
  }
}
