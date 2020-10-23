"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TodosController_1 = __importDefault(require("../controllers/TodosController"));
const router = express_1.Router();
const todosController = new TodosController_1.default();
router.get('/list', todosController.get);
router.get('/', todosController.getById);
exports.default = router;
//# sourceMappingURL=TodosRouter.js.map