"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Day_1 = require("../../main/data/Day");
const DiscountType_1 = require("../../main/data/DiscountType");
const CuisineType_1 = require("../../main/data/CuisineType");
const PromotionType_1 = require("../../main/data/PromotionType");
const DTOConverter_1 = require("../../main/validation/DTOConverter");
const Schedule_1 = require("../../main/entity/Schedule");
const Discount_1 = require("../../main/entity/Discount");
const User_1 = require("../../main/entity/User");
const UserFactory_1 = require("../factory/UserFactory");
const Promotion_1 = require("../../main/entity/Promotion");
const RestaurantFactory_1 = require("../factory/RestaurantFactory");
describe('Unit tests for DTOConverter', function () {
    let scheduleDTO;
    let discountDTO;
    let promotionDTO;
    let userDTO;
    beforeEach(() => {
        scheduleDTO = {
            dayOfWeek: Day_1.Day.MONDAY,
            endTime: '13:00',
            isRecurring: false,
            startTime: '9:00',
        };
        discountDTO = {
            discountType: DiscountType_1.DiscountType.PERCENTAGE,
            discountValue: 100.01,
        };
        promotionDTO = {
            cuisine: CuisineType_1.CuisineType.CHECHEN,
            description: 'Sample description',
            discount: discountDTO,
            expirationDate: new Date(),
            name: 'Sample name',
            placeId: 'Sample placeId',
            promotionType: PromotionType_1.PromotionType.BOGO,
            schedules: [scheduleDTO],
            startDate: new Date(),
            userId: 'fake userId',
            address: '3094 Random Ave, Vancouver BC, V03M31',
        };
        userDTO = {
            email: 'test@gmail.com',
            firstName: 'A',
            lastName: 'B',
            firebaseId: 'test',
            username: 'AB',
        };
    });
    it('Should be able to convert ScheduleDTO to Schedule', () => {
        const schedule = DTOConverter_1.DTOConverter.scheduleDTOtoSchedule(scheduleDTO);
        expect(schedule).toBeInstanceOf(Schedule_1.Schedule);
        expect(schedule).toEqual(scheduleDTO);
    });
    it('Should be able to convert DiscountDTO to Discount', () => {
        const discount = DTOConverter_1.DTOConverter.discountDTOtoDiscount(discountDTO);
        expect(discount).toBeInstanceOf(Discount_1.Discount);
        expect(discount).toEqual(discountDTO);
    });
    it('Should be able to convert UserDTO to User', () => {
        const user = DTOConverter_1.DTOConverter.userDTOtoUser(userDTO);
        expect(user).toBeInstanceOf(User_1.User);
        expect(user).toEqual(userDTO);
    });
    it('Should be able to convert PromotionDTO to Promotion', () => {
        const user = new UserFactory_1.UserFactory().generate();
        const restaurant = new RestaurantFactory_1.RestaurantFactory().generate();
        const promotion = DTOConverter_1.DTOConverter.promotionDTOtoPromotion(promotionDTO, user, restaurant);
        expect(promotion).toBeInstanceOf(Promotion_1.Promotion);
        const expectedPromotion = promotionDTO;
        delete expectedPromotion.placeId;
        delete expectedPromotion.userId;
        delete expectedPromotion.address;
        expect(promotion).toMatchObject(expectedPromotion);
        expect(promotion.schedules[0]).toEqual(scheduleDTO);
        expect(promotion.discount).toEqual(discountDTO);
        expect(promotion.user).toEqual(user);
    });
});
//# sourceMappingURL=DTOConverter.test.js.map