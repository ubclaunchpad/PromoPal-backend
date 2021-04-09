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
exports.Schedule = void 0;
const typeorm_1 = require("typeorm");
const Promotion_1 = require("./Promotion");
const Day_1 = require("../data/Day");
let Schedule = class Schedule {
    constructor(startTime, endTime, dayOfWeek, isRecurring) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.dayOfWeek = dayOfWeek;
        this.isRecurring = isRecurring;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Schedule.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Promotion_1.Promotion, (promotion) => promotion.schedules, {
        nullable: false,
        onDelete: 'CASCADE',
    }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Promotion_1.Promotion)
], Schedule.prototype, "promotion", void 0);
__decorate([
    typeorm_1.Column({
        type: 'time',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", String)
], Schedule.prototype, "startTime", void 0);
__decorate([
    typeorm_1.Column({
        type: 'time',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", String)
], Schedule.prototype, "endTime", void 0);
__decorate([
    typeorm_1.Column({
        type: 'enum',
        enum: Day_1.Day,
    }),
    __metadata("design:type", String)
], Schedule.prototype, "dayOfWeek", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Schedule.prototype, "isRecurring", void 0);
Schedule = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Unique(['promotion', 'dayOfWeek']),
    __metadata("design:paramtypes", [String, String, String, Boolean])
], Schedule);
exports.Schedule = Schedule;
//# sourceMappingURL=Schedule.js.map