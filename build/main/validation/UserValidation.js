"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const joi_1 = __importDefault(require("joi"));
class UserValidation {
}
exports.UserValidation = UserValidation;
UserValidation.schema = joi_1.default.object({
    username: joi_1.default.string().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    firebaseId: joi_1.default.string().required(),
}).required();
//# sourceMappingURL=UserValidation.js.map