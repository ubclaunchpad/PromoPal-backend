"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUpdateValidation = void 0;
const joi_1 = __importDefault(require("joi"));
class UserUpdateValidation {
}
exports.UserUpdateValidation = UserUpdateValidation;
UserUpdateValidation.schema = joi_1.default.object({
    username: joi_1.default.string().allow(''),
    firstName: joi_1.default.string().allow(''),
    lastName: joi_1.default.string().allow(''),
    email: joi_1.default.string().email().allow(''),
}).required();
//# sourceMappingURL=UserUpdateValidation.js.map