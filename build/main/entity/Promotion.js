"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Promotion = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Discount_1 = require("./Discount");
const PromotionType_1 = require("../data/PromotionType");
const CuisineType_1 = require("../data/CuisineType");
const SavedPromotion_1 = require("./SavedPromotion");
const Schedule_1 = require("./Schedule");
const VoteRecord_1 = require("./VoteRecord");
const Restaurant_1 = require("./Restaurant");
let Promotion = class Promotion {
    constructor(user, discount, restaurant, schedules, promotionType, cuisine, name, description, startDate, expirationDate) {
        this.user = user;
        this.discount = discount;
        this.restaurant = restaurant;
        this.schedules = schedules;
        this.promotionType = promotionType;
        this.cuisine = cuisine;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.expirationDate = expirationDate;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Promotion.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, (user) => user.uploadedPromotions, {
        nullable: false,
        onDelete: 'CASCADE',
    }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", User_1.User)
], Promotion.prototype, "user", void 0);
__decorate([
    typeorm_1.OneToOne(() => Discount_1.Discount, (discount) => discount.promotion, {
        cascade: true,
        nullable: false,
    }),
    __metadata("design:type", Discount_1.Discount)
], Promotion.prototype, "discount", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Restaurant_1.Restaurant, (restaurant) => restaurant.promotion, {
        nullable: false,
        cascade: true,
    }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Restaurant_1.Restaurant)
], Promotion.prototype, "restaurant", void 0);
__decorate([
    typeorm_1.OneToMany(() => SavedPromotion_1.SavedPromotion, (savedPromotion) => savedPromotion.promotion, {}),
    __metadata("design:type", Array)
], Promotion.prototype, "savedBy", void 0);
__decorate([
    typeorm_1.OneToMany(() => Schedule_1.Schedule, (schedule) => schedule.promotion, {
        nullable: false,
        cascade: true,
    }),
    __metadata("design:type", Array)
], Promotion.prototype, "schedules", void 0);
__decorate([
    typeorm_1.Column({
        type: 'enum',
        enum: PromotionType_1.PromotionType,
        default: PromotionType_1.PromotionType.OTHER,
    }),
    __metadata("design:type", String)
], Promotion.prototype, "promotionType", void 0);
__decorate([
    typeorm_1.Column({
        type: 'enum',
        enum: CuisineType_1.CuisineType,
        default: CuisineType_1.CuisineType.OTHER,
    }),
    __metadata("design:type", String)
], Promotion.prototype, "cuisine", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Promotion.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Promotion.prototype, "description", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        name: 'date_added',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Promotion.prototype, "dateAdded", void 0);
__decorate([
    typeorm_1.Column({
        name: 'start_date',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Promotion.prototype, "startDate", void 0);
__decorate([
    typeorm_1.Column({
        name: 'expiration_date',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Promotion.prototype, "expirationDate", void 0);
__decorate([
    typeorm_1.Column({
        name: 'tsvector',
        type: 'tsvector',
        nullable: false,
        select: false,
    }),
    __metadata("design:type", String)
], Promotion.prototype, "tsVector", void 0);
__decorate([
    typeorm_1.Column({
        type: 'integer',
        default: 0,
    }),
    __metadata("design:type", Number)
], Promotion.prototype, "votes", void 0);
__decorate([
    typeorm_1.OneToMany(() => VoteRecord_1.VoteRecord, (voteRecord) => voteRecord.promotion, {}),
    __metadata("design:type", Array)
], Promotion.prototype, "votedBy", void 0);
Promotion = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [User_1.User,
        Discount_1.Discount,
        Restaurant_1.Restaurant, Array, String, String, String, String, Date,
        Date])
], Promotion);
exports.Promotion = Promotion;
//# sourceMappingURL=Promotion.js.map