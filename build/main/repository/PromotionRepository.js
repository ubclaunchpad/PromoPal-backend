"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.PromotionRepository = void 0;
const typeorm_1 = require("typeorm");
const Promotion_1 = require("../entity/Promotion");
const Schedule_1 = require("../entity/Schedule");
const VoteRecord_1 = require("../entity/VoteRecord");
const VoteRecordRepository_1 = require("./VoteRecordRepository");
const SavedPromotionRepository_1 = require("./SavedPromotionRepository");
let PromotionRepository = class PromotionRepository extends typeorm_1.Repository {
    getAllPromotions(promotionQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            if (promotionQuery &&
                JSON.stringify(promotionQuery) !== JSON.stringify({})) {
                let promotions = yield this.applyQueryOptions(promotionQuery);
                if (promotionQuery.userId && promotions.length) {
                    promotions = yield this.findPromotionsUserSaved(promotionQuery.userId, promotions);
                    return this.findPromotionsUserVoted(promotionQuery.userId, promotions);
                }
                return promotions;
            }
            else {
                return this.createQueryBuilder('promotion')
                    .innerJoinAndSelect('promotion.discount', 'discount')
                    .innerJoinAndSelect('promotion.restaurant', 'restaurant')
                    .innerJoinAndSelect('promotion.schedules', 'schedule')
                    .cache(true)
                    .getMany();
            }
        });
    }
    applyQueryOptions(promotionQuery) {
        const queryBuilder = this.createQueryBuilder('promotion')
            .innerJoinAndSelect('promotion.discount', 'discount')
            .innerJoinAndSelect('promotion.restaurant', 'restaurant')
            .innerJoinAndSelect('promotion.schedules', 'schedule');
        if (promotionQuery === null || promotionQuery === void 0 ? void 0 : promotionQuery.promotionType) {
            queryBuilder.andWhere('promotion.promotionType = :promotionType', {
                promotionType: promotionQuery.promotionType,
            });
        }
        if (promotionQuery === null || promotionQuery === void 0 ? void 0 : promotionQuery.cuisine) {
            if (Array.isArray(promotionQuery.cuisine)) {
                if (promotionQuery.cuisine.length > 0) {
                    queryBuilder.andWhere('promotion.cuisine in (:...cuisine)', {
                        cuisine: promotionQuery.cuisine,
                    });
                }
            }
            else {
                queryBuilder.andWhere('promotion.cuisine = :cuisine', {
                    cuisine: promotionQuery.cuisine,
                });
            }
        }
        if (promotionQuery === null || promotionQuery === void 0 ? void 0 : promotionQuery.discountType) {
            queryBuilder.andWhere('discount.discountType = :discountType', {
                discountType: promotionQuery.discountType,
            });
            if (promotionQuery === null || promotionQuery === void 0 ? void 0 : promotionQuery.discountValue) {
                queryBuilder.andWhere('discount.discountValue >= :discountValue', {
                    discountValue: promotionQuery.discountValue,
                });
            }
        }
        if (promotionQuery === null || promotionQuery === void 0 ? void 0 : promotionQuery.expirationDate) {
            queryBuilder.andWhere("promotion.expirationDate ::timestamptz at time zone 'UTC' >= :date ::timestamptz at time zone 'UTC'", {
                date: promotionQuery.expirationDate,
            });
        }
        if (promotionQuery === null || promotionQuery === void 0 ? void 0 : promotionQuery.dayOfWeek) {
            queryBuilder.andWhere((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('S.promotionId')
                    .from(Schedule_1.Schedule, 'S')
                    .where('S.dayOfWeek = :dayOfWeek')
                    .getQuery();
                return 'promotion.id in ' + subQuery;
            }, {
                dayOfWeek: promotionQuery.dayOfWeek,
            });
        }
        if (promotionQuery === null || promotionQuery === void 0 ? void 0 : promotionQuery.searchQuery) {
            return this.fullTextSearch(queryBuilder, promotionQuery);
        }
        return queryBuilder.cache(true).getMany();
    }
    fullTextSearch(queryBuilder, promotionQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullTextSearchResults = yield this.createQueryBuilder('promotion')
                .select('promotion.id', 'id')
                .addSelect("ts_rank_cd(tsvector, replace(plainto_tsquery(:searchQuery)::text, '&', '|')::tsquery)", 'rank')
                .addSelect("ts_headline(description, replace(plainto_tsquery(:searchQuery)::text, '&', '|')::tsquery, 'MaxFragments=3')", 'boldDescription')
                .addSelect("ts_headline(name, replace(plainto_tsquery(:searchQuery)::text, '&', '|')::tsquery, 'HighlightAll=true')", 'boldName')
                .where("tsvector @@ replace(plainto_tsquery(:searchQuery)::text, '&', '|')::tsquery", {
                searchQuery: promotionQuery.searchQuery,
            })
                .orderBy('rank', 'DESC')
                .getRawMany();
            if (!(fullTextSearchResults === null || fullTextSearchResults === void 0 ? void 0 : fullTextSearchResults.length)) {
                return [];
            }
            const promotions = yield queryBuilder
                .andWhere('promotion.id IN (:...ids)', {
                ids: fullTextSearchResults.map((idRank) => idRank.id),
            })
                .getMany();
            if (!(promotions === null || promotions === void 0 ? void 0 : promotions.length)) {
                return [];
            }
            const mapIdToPromotion = new Map(promotions.map((promotion) => [promotion.id, promotion]));
            const result = [];
            for (const fullTextSearchResult of fullTextSearchResults) {
                const promotion = mapIdToPromotion.get(fullTextSearchResult.id);
                if (promotion) {
                    const promotionWithRank = Object.assign(Object.assign({}, promotion), { rank: fullTextSearchResult.rank, boldDescription: fullTextSearchResult.boldDescription, boldName: fullTextSearchResult.boldName });
                    result.push(promotionWithRank);
                }
            }
            return result;
        });
    }
    findPromotionsUserSaved(userId, promotions) {
        return __awaiter(this, void 0, void 0, function* () {
            const promotionIds = promotions.map((promotion) => promotion.id);
            const savedPromotions = yield typeorm_1.getConnection()
                .getCustomRepository(SavedPromotionRepository_1.SavedPromotionRepository)
                .find({
                select: ['promotionId'],
                where: {
                    userId,
                    promotionId: typeorm_1.In(promotionIds),
                },
            });
            const set = new Set(savedPromotions.map((savedPromotion) => savedPromotion.promotionId));
            return promotions.map((promotion) => {
                promotion.isSavedByUser = set.has(promotion.id);
                return promotion;
            });
        });
    }
    findPromotionsUserVoted(userId, promotions) {
        return __awaiter(this, void 0, void 0, function* () {
            const promotionIds = promotions.map((promotion) => promotion.id);
            const voteRecords = yield typeorm_1.getConnection()
                .getCustomRepository(VoteRecordRepository_1.VoteRecordRepository)
                .find({
                select: ['promotionId', 'voteState'],
                where: {
                    userId,
                    promotionId: typeorm_1.In(promotionIds),
                },
            });
            const promotionIdToVoteState = new Map(voteRecords.map((voteRecord) => {
                return [voteRecord['promotionId'], voteRecord['voteState']];
            }));
            return promotions.map((promotion) => {
                var _a;
                promotion.voteState = (_a = promotionIdToVoteState.get(promotion.id)) !== null && _a !== void 0 ? _a : VoteRecord_1.VoteState.INIT;
                return promotion;
            });
        });
    }
};
PromotionRepository = __decorate([
    typeorm_1.EntityRepository(Promotion_1.Promotion)
], PromotionRepository);
exports.PromotionRepository = PromotionRepository;
//# sourceMappingURL=PromotionRepository.js.map