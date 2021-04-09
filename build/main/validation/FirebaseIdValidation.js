"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseIdValidation = void 0;
const joi_1 = __importDefault(require("joi"));
class FirebaseIdValidation {
}
exports.FirebaseIdValidation = FirebaseIdValidation;
FirebaseIdValidation.schema = joi_1.default.string().required();
//# sourceMappingURL=FirebaseIdValidation.js.map