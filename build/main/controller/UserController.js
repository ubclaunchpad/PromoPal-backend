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
exports.UserController = void 0;
const typeorm_1 = require("typeorm");
const UserRepository_1 = require("../repository/UserRepository");
const IdValidation_1 = require("../validation/IdValidation");
const UserValidation_1 = require("../validation/UserValidation");
const UserUpdateValidation_1 = require("../validation/UserUpdateValidation");
const PromotionRepository_1 = require("../repository/PromotionRepository");
const SavedPromotionRepository_1 = require("../repository/SavedPromotionRepository");
const DTOConverter_1 = require("../validation/DTOConverter");
const SavedPromotion_1 = require("../entity/SavedPromotion");
const FirebaseIdValidation_1 = require("../validation/FirebaseIdValidation");
const Error_1 = require("../errors/Error");
class UserController {
    constructor(resourceCleanupService) {
        this.listAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield typeorm_1.getManager().transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    const userRepository = transactionalEntityManager.getCustomRepository(UserRepository_1.UserRepository);
                    const users = yield userRepository.find({ cache: true });
                    return res.status(200).send(users);
                }));
            }
            catch (e) {
                return next(e);
            }
        });
        this.getOneById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield typeorm_1.getManager().transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    const id = yield IdValidation_1.IdValidation.schema.validateAsync(req.params.id, {
                        abortEarly: false,
                    });
                    const userRepository = transactionalEntityManager.getCustomRepository(UserRepository_1.UserRepository);
                    const user = yield userRepository.findOneOrFail(id, { cache: true });
                    return res.send(user);
                }));
            }
            catch (e) {
                return next(e);
            }
        });
        this.getOneByFirebaseId = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield typeorm_1.getManager().transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    const firebaseId = yield FirebaseIdValidation_1.FirebaseIdValidation.schema.validateAsync(req.params.firebaseId, {
                        abortEarly: false,
                    });
                    const userRepository = transactionalEntityManager.getCustomRepository(UserRepository_1.UserRepository);
                    const user = yield userRepository.findByFirebaseId(firebaseId, {
                        cache: true,
                    });
                    return res.send(user);
                }));
            }
            catch (e) {
                return next(e);
            }
        });
        this.newUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield typeorm_1.getManager().transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    const userDTO = yield UserValidation_1.UserValidation.schema.validateAsync(req.body, { abortEarly: false });
                    const user = DTOConverter_1.DTOConverter.userDTOtoUser(userDTO);
                    const userRepository = transactionalEntityManager.getCustomRepository(UserRepository_1.UserRepository);
                    const result = yield userRepository.save(user);
                    return res.status(201).send(Object.assign(Object.assign({}, result), { firebaseId: undefined }));
                }));
            }
            catch (e) {
                return next(e);
            }
        });
        this.editUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield typeorm_1.getManager().transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    const id = yield IdValidation_1.IdValidation.schema.validateAsync(req.params.id, {
                        abortEarly: false,
                    });
                    const userRepository = transactionalEntityManager.getCustomRepository(UserRepository_1.UserRepository);
                    const userUpdateDTO = yield UserUpdateValidation_1.UserUpdateValidation.schema.validateAsync(req.body, { abortEarly: false });
                    const result = yield userRepository.update(id, userUpdateDTO);
                    res.status(204).send(result);
                }));
            }
            catch (e) {
                next(e);
            }
        });
        this.deleteUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield typeorm_1.getManager().transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    const id = yield IdValidation_1.IdValidation.schema.validateAsync(req.params.id, {
                        abortEarly: false,
                    });
                    const userRepository = transactionalEntityManager.getCustomRepository(UserRepository_1.UserRepository);
                    const potentialUserToDelete = yield userRepository.findOne({
                        id,
                        firebaseId: res.locals.firebaseUserId,
                    });
                    if (!potentialUserToDelete) {
                        throw new Error_1.ForbiddenError();
                    }
                    const uploadedPromotions = yield transactionalEntityManager
                        .getCustomRepository(PromotionRepository_1.PromotionRepository)
                        .find({
                        select: ['id'],
                        where: {
                            user: {
                                id,
                            },
                        },
                    });
                    const uploadedPromotionIds = uploadedPromotions.map((promotion) => promotion.id);
                    const result = yield userRepository.delete(id);
                    yield this.resourceCleanupService.cleanupResourceForPromotions(uploadedPromotionIds);
                    return res.status(204).send(result);
                }));
            }
            catch (e) {
                next(e);
            }
        });
        this.getSaved = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield typeorm_1.getManager().transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    const id = yield IdValidation_1.IdValidation.schema.validateAsync(req.params.id, {
                        abortEarly: false,
                    });
                    const rawPromotionIds = yield transactionalEntityManager
                        .createQueryBuilder()
                        .select('savedPromotions.promotionId')
                        .from(SavedPromotion_1.SavedPromotion, 'savedPromotions')
                        .where('savedPromotions.userId = :id', { id })
                        .cache(true)
                        .getRawMany();
                    const promotionIds = rawPromotionIds.map((rawPromotion) => rawPromotion.savedPromotions_promotionId);
                    let promotions = [];
                    if (promotionIds.length) {
                        promotions = yield transactionalEntityManager
                            .getCustomRepository(PromotionRepository_1.PromotionRepository)
                            .find({
                            where: {
                                id: typeorm_1.In(promotionIds),
                            },
                            relations: ['discount', 'schedules', 'restaurant'],
                        });
                    }
                    res.status(200).send(promotions);
                }));
            }
            catch (e) {
                next(e);
            }
        });
        this.newSaved = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield typeorm_1.getManager().transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    const uid = yield IdValidation_1.IdValidation.schema.validateAsync(req.params.id, {
                        abortEarly: false,
                    });
                    const pid = yield IdValidation_1.IdValidation.schema.validateAsync(req.params.pid, {
                        abortEarly: false,
                    });
                    yield this.checkIfUserAndPromotionExist(transactionalEntityManager, pid, uid);
                    const savedPromotion = transactionalEntityManager
                        .getCustomRepository(SavedPromotionRepository_1.SavedPromotionRepository)
                        .create({ userId: uid, promotionId: pid });
                    const result = yield transactionalEntityManager
                        .getCustomRepository(SavedPromotionRepository_1.SavedPromotionRepository)
                        .save(savedPromotion);
                    return res.status(201).send(result);
                }));
            }
            catch (e) {
                next(e);
            }
        });
        this.deleteSaved = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield typeorm_1.getManager().transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    const uid = yield IdValidation_1.IdValidation.schema.validateAsync(req.params.id, {
                        abortEarly: false,
                    });
                    const pid = yield IdValidation_1.IdValidation.schema.validateAsync(req.params.pid, {
                        abortEarly: false,
                    });
                    const result = yield transactionalEntityManager
                        .getCustomRepository(SavedPromotionRepository_1.SavedPromotionRepository)
                        .delete({
                        userId: uid,
                        promotionId: pid,
                    });
                    return res.status(204).send(result);
                }));
            }
            catch (e) {
                next(e);
            }
        });
        this.getUploaded = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield typeorm_1.getManager().transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    const id = yield IdValidation_1.IdValidation.schema.validateAsync(req.params.id, {
                        abortEarly: false,
                    });
                    const userRepository = transactionalEntityManager.getCustomRepository(UserRepository_1.UserRepository);
                    const uploadedPromotions = yield userRepository.findOneOrFail(id, {
                        relations: ['uploadedPromotions'],
                        cache: true,
                    });
                    return res.status(200).send(uploadedPromotions);
                }));
            }
            catch (e) {
                next(e);
            }
        });
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
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map