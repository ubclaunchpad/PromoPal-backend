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
exports.Restaurant = void 0;
const typeorm_1 = require("typeorm");
const Promotion_1 = require("./Promotion");
let Restaurant = class Restaurant {
    constructor(placeId, lat, lon) {
        this.placeId = placeId;
        this.lat = lat;
        this.lon = lon;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Restaurant.prototype, "id", void 0);
__decorate([
    typeorm_1.OneToMany(() => Promotion_1.Promotion, (promotion) => promotion.restaurant),
    __metadata("design:type", Promotion_1.Promotion)
], Restaurant.prototype, "promotion", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Restaurant.prototype, "placeId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'real',
        nullable: true,
    }),
    __metadata("design:type", Number)
], Restaurant.prototype, "lat", void 0);
__decorate([
    typeorm_1.Column({
        type: 'real',
        nullable: true,
    }),
    __metadata("design:type", Number)
], Restaurant.prototype, "lon", void 0);
Restaurant = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [String, Number, Number])
], Restaurant);
exports.Restaurant = Restaurant;
//# sourceMappingURL=Restaurant.js.map