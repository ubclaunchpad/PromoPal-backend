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
exports.Discount = void 0;
const typeorm_1 = require("typeorm");
const Promotion_1 = require("./Promotion");
const DiscountType_1 = require("../data/DiscountType");
let Discount = class Discount {
    constructor(discountType, discountValue) {
        this.discountType = discountType;
        this.discountValue = discountValue;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Discount.prototype, "id", void 0);
__decorate([
    typeorm_1.OneToOne(() => Promotion_1.Promotion, (promotion) => promotion.discount, {
        nullable: false,
        onDelete: 'CASCADE',
    }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Promotion_1.Promotion)
], Discount.prototype, "promotion", void 0);
__decorate([
    typeorm_1.Column({
        type: 'enum',
        enum: DiscountType_1.DiscountType,
        default: DiscountType_1.DiscountType.OTHER,
    }),
    __metadata("design:type", String)
], Discount.prototype, "discountType", void 0);
__decorate([
    typeorm_1.Column('real'),
    __metadata("design:type", Number)
], Discount.prototype, "discountValue", void 0);
Discount = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [String, Number])
], Discount);
exports.Discount = Discount;
//# sourceMappingURL=Discount.js.map