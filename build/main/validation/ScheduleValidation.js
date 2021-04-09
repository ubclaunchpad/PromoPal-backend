"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleValidation = exports.START_TIME_FORMAT = exports.END_TIME_FORMAT = void 0;
const joi_1 = __importDefault(require("joi"));
const Day_1 = require("../data/Day");
exports.END_TIME_FORMAT = 'Invalid 24 hour format for end time';
exports.START_TIME_FORMAT = 'Invalid 24 hour format for start time';
const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
const startTimeMessages = {
    'string.pattern.base': exports.START_TIME_FORMAT,
};
const endTimeMessages = {
    'string.pattern.base': exports.END_TIME_FORMAT,
};
const customTimeValidator = (startTime, helpers) => {
    var _a, _b;
    const endTime = (_b = (_a = helpers === null || helpers === void 0 ? void 0 : helpers.state) === null || _a === void 0 ? void 0 : _a.ancestors[0]) === null || _b === void 0 ? void 0 : _b.endTime;
    const startMinutes = getMinutes(startTime);
    const endMinutes = getMinutes(endTime);
    if (startMinutes && endMinutes && startMinutes >= endMinutes) {
        return helpers.message(`Start time '${startTime}' must be less than end time '${endTime}'`);
    }
    return startTime;
};
function getMinutes(time) {
    try {
        const timeParts = time.split(':');
        return Number(timeParts[0]) * 60 + Number(timeParts[1]);
    }
    catch (e) {
        return null;
    }
}
class ScheduleValidation {
}
exports.ScheduleValidation = ScheduleValidation;
ScheduleValidation.schema = joi_1.default.object({
    startTime: joi_1.default.string()
        .regex(timeRegex)
        .messages(startTimeMessages)
        .required()
        .custom(customTimeValidator),
    endTime: joi_1.default.string().regex(timeRegex).messages(endTimeMessages).required(),
    isRecurring: joi_1.default.boolean().required(),
    dayOfWeek: joi_1.default.string()
        .valid(...Object.values(Day_1.Day))
        .required(),
}).required();
//# sourceMappingURL=ScheduleValidation.js.map