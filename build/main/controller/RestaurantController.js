"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantController = void 0;
const typeorm_1 = require("typeorm");
const IdValidation_1 = require("../validation/IdValidation");
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const RestaurantRepository_1 = require("../repository/RestaurantRepository");
const PromotionRepository_1 = require("../repository/PromotionRepository");
class RestaurantController {
    constructor(googlePlacesService) {
        this.getPromotions = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield typeorm_1.getManager().transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    const id = yield IdValidation_1.IdValidation.schema.validateAsync(request.params.id, {
                        abortEarly: false,
                    });
                    const promotions = yield transactionalEntityManager
                        .getCustomRepository(PromotionRepository_1.PromotionRepository)
                        .createQueryBuilder('promotion')
                        .innerJoinAndSelect('promotion.discount', 'discount')
                        .innerJoinAndSelect('promotion.schedules', 'schedule')
                        .where('promotion.restaurantId = :id', { id })
                        .cache(true)
                        .getMany();
                    return response.status(200).send(promotions);
                }));
            }
            catch (e) {
                return next(e);
            }
        });
        this.getRestaurantDetails = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield typeorm_1.getManager().transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    let result = {};
                    const id = yield IdValidation_1.IdValidation.schema.validateAsync(request.params.id, {
                        abortEarly: false,
                    });
                    const restaurant = yield transactionalEntityManager
                        .getCustomRepository(RestaurantRepository_1.RestaurantRepository)
                        .findOneOrFail(id);
                    if (restaurant.placeId) {
                        const placeDetailsResponseData = yield this.googlePlacesService.getRestaurantDetails(restaurant.placeId);
                        result = (_a = placeDetailsResponseData.result) !== null && _a !== void 0 ? _a : {};
                        if (placeDetailsResponseData.status === google_maps_services_js_1.Status.NOT_FOUND) {
                            result = yield this.handlePlaceIdNotFound(restaurant.placeId, id, transactionalEntityManager);
                        }
                    }
                    return response.status(200).send(result);
                }));
            }
            catch (e) {
                return next(e);
            }
        });
        this.googlePlacesService = googlePlacesService;
    }
    handlePlaceIdNotFound(placeId, id, transactionalEntityManager) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshResult = yield this.googlePlacesService.refreshPlaceId(placeId);
            yield transactionalEntityManager
                .getCustomRepository(RestaurantRepository_1.RestaurantRepository)
                .update({ id }, { placeId: refreshResult.placeId });
            return refreshResult.restaurantDetails;
        });
    }
}
exports.RestaurantController = RestaurantController;
//# sourceMappingURL=RestaurantController.js.map