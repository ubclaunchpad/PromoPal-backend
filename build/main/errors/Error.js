"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.BaseError = void 0;
const ErrorMessages_1 = require("./ErrorMessages");
class BaseError extends Error {
    constructor(errorName, errorMessage, status) {
        super(errorMessage);
        this.name = errorName;
        this.status = status;
    }
}
exports.BaseError = BaseError;
class ForbiddenError extends BaseError {
    constructor(errorMessage) {
        super('ForbiddenError', errorMessage !== null && errorMessage !== void 0 ? errorMessage : ErrorMessages_1.ErrorMessages.INSUFFICIENT_PRIVILEGES, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
//# sourceMappingURL=Error.js.map