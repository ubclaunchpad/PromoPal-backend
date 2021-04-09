"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleFactory = void 0;
const Day_1 = require("../../main/data/Day");
const Schedule_1 = require("../../main/entity/Schedule");
class ScheduleFactory {
    generate(startTime, endTime, dayOfWeek, isRecurring) {
        return new Schedule_1.Schedule(startTime !== null && startTime !== void 0 ? startTime : '10:00', endTime !== null && endTime !== void 0 ? endTime : '23:59', dayOfWeek !== null && dayOfWeek !== void 0 ? dayOfWeek : Day_1.Day.THURSDAY, isRecurring !== null && isRecurring !== void 0 ? isRecurring : false);
    }
}
exports.ScheduleFactory = ScheduleFactory;
//# sourceMappingURL=ScheduleFactory.js.map