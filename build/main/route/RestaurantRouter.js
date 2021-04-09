"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantRouter = void 0;
const express_1 = __importDefault(require("express"));
class RestaurantRouter {
    constructor(restaurantController) {
        this.restaurantRouter = express_1.default.Router();
        this.restaurantController = restaurantController;
    }
    getRoutes() {
        this.restaurantRouter.get('/:id/restaurantDetails/', this.restaurantController.getRestaurantDetails);
        this.restaurantRouter.get('/:id/promotions', this.restaurantController.getPromotions);
        return this.restaurantRouter;
    }
}
exports.RestaurantRouter = RestaurantRouter;
//# sourceMappingURL=RestaurantRouter.js.map