"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.PromotionController = void 0;
const PromotionRepository_1 = require("../repository/PromotionRepository");
const typeorm_1 = require("typeorm");
const UserRepository_1 = require("../repository/UserRepository");
const PromotionValidation_1 = require("../validation/PromotionValidation");
const IdValidation_1 = require("../validation/IdValidation");
const PromotionQueryValidation_1 = require("../validation/PromotionQueryValidation");
const querystring = __importStar(require("querystring"));
const DTOConverter_1 = require("../validation/DTOConverter");
const VoteRecord_1 = require("../entity/VoteRecord");
const VoteRecordRepository_1 = require("../repository/VoteRecordRepository");
const RestaurantRepository_1 = require("../repository/RestaurantRepository");
const Restaurant_1 = require("../entity/Restaurant");
const Error_1 = require("../errors/Error");
class PromotionController {
    constructor(geocodingService, resourceCleanupService) {
        this.getAllPromotions = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield typeorm_1.getManager().transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    const promotionQuery = yield PromotionQueryValidation_1.PromotionQueryValidation.schema.validateAsync(request.query, {
                        abortEarly: false,
                    });
                    if (promotionQuery.searchQuery) {
                        promotionQuery.searchQuery = querystring.unescape(promotionQuery.searchQuery);
                    }
                    const promotions = yield transactionalEntityManager
                        .getCustomRepository(PromotionRepository_1.PromotionRepository)
                        .getAllPromotions(promotionQuery);
                    return response.send(promotions);
                }));
            }
            catch (e) {
                return next(e);
            }
        });
        this.getPromotion = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield typeorm_1.getManager().transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    const id = yield IdValidation_1.IdValidation.schema.validateAsync(request.params.id, {
                        abortEarly: false,
                    });
                    const promotion = yield transactionalEntityManager
                        .getCustomRepository(PromotionRepository_1.PromotionRepository)
                        .findOneOrFail(id, {
                        relations: ['discount', 'restaurant', 'schedules'],
                        cache: true,
                    });
                    return response.send(promotion);
                }));
            }
            catch (e) {
                return next(e);
            }
        });
        this.addPromotion = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield typeorm_1.getManager().transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    const promotionDTO = yield PromotionValidation_1.PromotionValidation.schema.validateAsync(request.body, { abortEarly: false });
                    const user = yield transactionalEntityManager
                        .getCustomRepository(UserRepository_1.UserRepository)
                        .findOneOrFail(promotionDTO.userId);
                    let restaurant = yield transactionalEntityManager
                        .getCustomRepository(RestaurantRepository_1.RestaurantRepository)
                        .findOne({ placeId: promotionDTO.placeId });
                    if (!restaurant) {
                        const geoCoordinate = yield this.geocodingService.getGeoCoordinateFromAddress(promotionDTO.address);
                        restaurant = new Restaurant_1.Restaurant(promotionDTO.placeId, geoCoordinate.lat, geoCoordinate.lon);
                    }
                    const promotion = DTOConverter_1.DTOConverter.promotionDTOtoPromotion(promotionDTO, user, restaurant);
                    const result = yield transactionalEntityManager
                        .getCustomRepository(PromotionRepository_1.PromotionRepository)
                        .save(promotion);
                    return response.status(201).send(result);
                }));
            }
            catch (e) {
                return next(e);
            }
        });
        this.deletePromotion = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield typeorm_1.getManager().transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    const id = yield IdValidation_1.IdValidation.schema.validateAsync(request.params.id, {
                        abortEarly: false,
                    });
                    const authenticatedUser = yield transactionalEntityManager
                        .getCustomRepository(UserRepository_1.UserRepository)
                        .findByFirebaseId(response.locals.firebaseUserId);
                    const potentialPromotionUploadedByUser = yield transactionalEntityManager
                        .getCustomRepository(PromotionRepository_1.PromotionRepository)
                        .findOne({ id, user: authenticatedUser });
                    if (!potentialPromotionUploadedByUser) {
                        throw new Error_1.ForbiddenError();
                    }
                    const deleteResult = yield transactionalEntityManager
                        .getCustomRepository(PromotionRepository_1.PromotionRepository)
                        .delete(id);
                    yield this.resourceCleanupService.cleanupResourceForPromotion(id);
                    return response.status(204).send(deleteResult);
                }));
            }
            catch (e) {
                return next(e);
            }
        });
        this.upVotePromotion = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield typeorm_1.getManager().transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    const pid = yield IdValidation_1.IdValidation.schema.validateAsync(request.params.id, {
                        abortEarly: false,
                    });
                    const uid = yield IdValidation_1.IdValidation.schema.validateAsync(request.body.uid, {
                        abortEarly: false,
                    });
                    yield this.checkIfUserAndPromotionExist(transactionalEntityManager, pid, uid);
                    const voteRecordRepository = transactionalEntityManager.getCustomRepository(VoteRecordRepository_1.VoteRecordRepository);
                    const voteRecord = yield voteRecordRepository.findOne({
                        userId: uid,
                        promotionId: pid,
                    });
                    if (!voteRecord) {
                        yield voteRecordRepository.save({
                            userId: uid,
                            promotionId: pid,
                            voteState: VoteRecord_1.VoteState.UP,
                        });
                        yield transactionalEntityManager
                            .getCustomRepository(PromotionRepository_1.PromotionRepository)
                            .increment({ id: pid }, 'votes', 1);
                        return response.status(204).send();
                    }
                    const voteValue = voteRecord.voteState === VoteRecord_1.VoteState.UP
                        ? -1
                        : voteRecord.voteState === VoteRecord_1.VoteState.DOWN
                            ? 2
                            : 1;
                    voteRecord.voteState =
                        voteRecord.voteState === VoteRecord_1.VoteState.UP ? VoteRecord_1.VoteState.INIT : VoteRecord_1.VoteState.UP;
                    yield transactionalEntityManager
                        .getCustomRepository(PromotionRepository_1.PromotionRepository)
                        .increment({ id: pid }, 'votes', voteValue);
                    yield voteRecordRepository.save(voteRecord);
                    return response.status(204).send();
                }));
            }
            catch (e) {
                return next(e);
            }
        });
        this.downVotePromotion = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield typeorm_1.getManager().transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    const pid = yield IdValidation_1.IdValidation.schema.validateAsync(request.params.id, {
                        abortEarly: false,
                    });
                    const uid = yield IdValidation_1.IdValidation.schema.validateAsync(request.body.uid, {
                        abortEarly: false,
                    });
                    yield this.checkIfUserAndPromotionExist(transactionalEntityManager, pid, uid);
                    const voteRecordRepository = transactionalEntityManager.getCustomRepository(VoteRecordRepository_1.VoteRecordRepository);
                    const voteRecord = yield voteRecordRepository.findOne({
                        userId: uid,
                        promotionId: pid,
                    });
                    if (!voteRecord) {
                        yield voteRecordRepository.save({
                            userId: uid,
                            promotionId: pid,
                            voteState: VoteRecord_1.VoteState.DOWN,
                        });
                        yield transactionalEntityManager
                            .getCustomRepository(PromotionRepository_1.PromotionRepository)
                            .decrement({ id: pid }, 'votes', 1);
                        return response.status(204).send();
                    }
                    const voteValue = voteRecord.voteState === VoteRecord_1.VoteState.DOWN
                        ? -1
                        : voteRecord.voteState === VoteRecord_1.VoteState.UP
                            ? 2
                            : 1;
                    voteRecord.voteState =
                        voteRecord.voteState === VoteRecord_1.VoteState.DOWN
                            ? VoteRecord_1.VoteState.INIT
                            : VoteRecord_1.VoteState.DOWN;
                    yield transactionalEntityManager
                        .getCustomRepository(PromotionRepository_1.PromotionRepository)
                        .decrement({ id: pid }, 'votes', voteValue);
                    yield voteRecordRepository.save(voteRecord);
                    return response.status(204).send();
                }));
            }
            catch (e) {
                return next(e);
            }
        });
        this.geocodingService = geocodingService;
        this.resourceCleanupService = resourceCleanupService;
    }
    checkIfUserAndPromotionExist(transactionalEntityManager, pid, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield transactionalEntityManager
                .getCustomRepository(PromotionRepository_1.PromotionRepository)
                .findOneOrFail(pid);
            yield transactionalEntityManager
                .getCustomRepository(UserRepository_1.UserRepository)
                .findOneOrFail(uid);
        });
    }
}
exports.PromotionController = PromotionController;
//# sourceMappingURL=PromotionController.js.map