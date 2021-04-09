"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdValidation = void 0;
const joi_1 = __importDefault(require("joi"));
class IdValidation {
}
exports.IdValidation = IdValidation;
IdValidation.schema = joi_1.default.string().uuid().required();
//# sourceMappingURL=IdValidation.js.map