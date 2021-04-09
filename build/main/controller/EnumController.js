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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumController = void 0;
const DiscountType_1 = require("../data/DiscountType");
const PromotionType_1 = require("../data/PromotionType");
const CuisineType_1 = require("../data/CuisineType");
const joi_1 = __importDefault(require("joi"));
const Day_1 = require("../data/Day");
var SupportedEnums;
(function (SupportedEnums) {
    SupportedEnums["DiscountType"] = "DiscountType";
    SupportedEnums["PromotionType"] = "PromotionType";
    SupportedEnums["CuisineType"] = "CuisineType";
    SupportedEnums["Day"] = "Day";
})(SupportedEnums || (SupportedEnums = {}));
class EnumController {
    constructor() {
        this.enumSchemaValidation = joi_1.default.string()
            .valid(...Object.values(SupportedEnums))
            .required();
        this.getEnum = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const enumString = yield this.enumSchemaValidation.validateAsync(request.params.enum, { abortEarly: false });
                const enumClass = this.getEnumClass(enumString);
                const enumValues = this.getEnumValues(enumClass);
                return response.status(200).send(enumValues);
            }
            catch (e) {
                next(e);
            }
        });
    }
    getEnumClass(supportedEnums) {
        switch (supportedEnums) {
            case SupportedEnums.DiscountType:
                return DiscountType_1.DiscountType;
            case SupportedEnums.PromotionType:
                return PromotionType_1.PromotionType;
            case SupportedEnums.CuisineType:
                return CuisineType_1.CuisineType;
            case SupportedEnums.Day:
                return Day_1.Day;
        }
    }
    getEnumValues(arg) {
        return Object.values(arg);
    }
}
exports.EnumController = EnumController;
//# sourceMappingURL=EnumController.js.map