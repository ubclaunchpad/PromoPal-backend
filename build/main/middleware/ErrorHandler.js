"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const FrontEndErrorObject_1 = require("../data/FrontEndErrorObject");
const joi_1 = require("joi");
const Error_1 = require("../errors/Error");
function errorHandler(error, req, res, next) {
    if (error instanceof joi_1.ValidationError)
        return res.status(400).send(new FrontEndErrorObject_1.FrontEndErrorObject(error.name, error.details.map((detail) => detail.message)));
    if (error instanceof Error_1.BaseError)
        return res
            .status(error.status)
            .send(new FrontEndErrorObject_1.FrontEndErrorObject(error.name, [error.message]));
    return res
        .status(500)
        .send(new FrontEndErrorObject_1.FrontEndErrorObject(error.name, [error.message]));
}
exports.errorHandler = errorHandler;
//# sourceMappingURL=ErrorHandler.js.map