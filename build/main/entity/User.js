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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Promotion_1 = require("./Promotion");
const SavedPromotion_1 = require("./SavedPromotion");
const VoteRecord_1 = require("./VoteRecord");
let User = class User {
    constructor(firstName, lastName, email, username, firebaseId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
        this.firebaseId = firebaseId;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: 'uid_firebase',
        unique: true,
        select: false,
    }),
    __metadata("design:type", String)
], User.prototype, "firebaseId", void 0);
__decorate([
    typeorm_1.OneToMany(() => Promotion_1.Promotion, (promotion) => promotion.user, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], User.prototype, "uploadedPromotions", void 0);
__decorate([
    typeorm_1.OneToMany(() => SavedPromotion_1.SavedPromotion, (savedPromotion) => savedPromotion.user, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], User.prototype, "savedPromotions", void 0);
__decorate([
    typeorm_1.Column({
        name: 'first_name',
    }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    typeorm_1.Column({
        name: 'last_name',
    }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    typeorm_1.Column({
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    typeorm_1.OneToMany(() => VoteRecord_1.VoteRecord, (voteRecord) => voteRecord.user, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], User.prototype, "votedRecord", void 0);
User = __decorate([
    typeorm_1.Entity('user_profile'),
    __metadata("design:paramtypes", [String, String, String, String, String])
], User);
exports.User = User;
//# sourceMappingURL=User.js.map