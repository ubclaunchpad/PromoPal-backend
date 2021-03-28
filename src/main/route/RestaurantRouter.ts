import express, { Router } from 'express';
import { RestaurantController } from '../controller/RestaurantController';

export class RestaurantRouter {
  private restaurantRouter = express.Router();
  private restaurantController;
  constructor(restaurantController: RestaurantController) {
    this.restaurantController = restaurantController;
  }

  getRoutes(): Router {
    this.restaurantRouter.get(
      '/:id/restaurantDetails/',
      this.restaurantController.getRestaurantDetails
    );
    this.restaurantRouter.get(
      '/:id/promotions',
      this.restaurantController.getPromotions
    );
    return this.restaurantRouter;
  }
}
