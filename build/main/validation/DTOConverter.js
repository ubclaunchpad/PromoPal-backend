"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DTOConverter = void 0;
const User_1 = require("../entity/User");
const Promotion_1 = require("../entity/Promotion");
const Schedule_1 = require("../entity/Schedule");
const Discount_1 = require("../entity/Discount");
class DTOConverter {
    static promotionDTOtoPromotion(promotionDTO, user, restaurant) {
        const discount = this.discountDTOtoDiscount(promotionDTO.discount);
        const schedules = promotionDTO.schedules.map((scheduleDTO) => {
            return this.scheduleDTOtoSchedule(scheduleDTO);
        });
        return new Promotion_1.Promotion(user, discount, restaurant, schedules, promotionDTO.promotionType, promotionDTO.cuisine, promotionDTO.name, promotionDTO.description, promotionDTO.startDate, promotionDTO.expirationDate);
    }
    static scheduleDTOtoSchedule(scheduleDTO) {
        return new Schedule_1.Schedule(scheduleDTO.startTime, scheduleDTO.endTime, scheduleDTO.dayOfWeek, scheduleDTO.isRecurring);
    }
    static discountDTOtoDiscount(discountDTO) {
        return new Discount_1.Discount(discountDTO.discountType, discountDTO.discountValue);
    }
    static userDTOtoUser(userDTO) {
        return new User_1.User(userDTO.firstName, userDTO.lastName, userDTO.email, userDTO.username, userDTO.firebaseId);
    }
}
exports.DTOConverter = DTOConverter;
//# sourceMappingURL=DTOConverter.js.map