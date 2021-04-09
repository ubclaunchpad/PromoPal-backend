"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumRouter = void 0;
const express_1 = __importDefault(require("express"));
class EnumRouter {
    constructor(enumController) {
        this.enumRouter = express_1.default.Router();
        this.enumController = enumController;
    }
    getRoutes() {
        this.enumRouter.get('/:enum', this.enumController.getEnum);
        return this.enumRouter;
    }
}
exports.EnumRouter = EnumRouter;
//# sourceMappingURL=EnumRouter.js.map