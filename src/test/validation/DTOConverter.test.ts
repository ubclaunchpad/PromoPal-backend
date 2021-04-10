import { ScheduleDTO } from '../../main/validation/ScheduleValidation';
import { DiscountDTO } from '../../main/validation/DiscountValidation';
import { PromotionDTO } from '../../main/validation/PromotionValidation';
import { UserDTO } from '../../main/validation/UserValidation';
import { Day } from '../../main/data/Day';
import { DiscountType } from '../../main/data/DiscountType';
import { CuisineType } from '../../main/data/CuisineType';
import { PromotionType } from '../../main/data/PromotionType';
import { DTOConverter } from '../../main/validation/DTOConverter';
import { Schedule } from '../../main/entity/Schedule';
import { Discount } from '../../main/entity/Discount';
import { User } from '../../main/entity/User';
import { UserFactory } from '../factory/UserFactory';
import { Promotion } from '../../main/entity/Promotion';
import { RestaurantFactory } from '../factory/RestaurantFactory';

describe('Unit tests for DTOConverter', function () {
  let scheduleDTO: ScheduleDTO;
  let discountDTO: DiscountDTO;
  let promotionDTO: PromotionDTO;
  let userDTO: UserDTO;

  beforeEach(() => {
    scheduleDTO = {
      dayOfWeek: Day.MONDAY,
      endTime: '13:00',
      isRecurring: false,
      startTime: '9:00',
    };

    discountDTO = {
      discountType: DiscountType.PERCENTAGE,
      discountValue: 100.01,
    };

    promotionDTO = {
      cuisine: CuisineType.CHECHEN,
      description: 'Sample description',
      discount: discountDTO,
      expirationDate: new Date(),
      name: 'Sample name',
      placeId: 'Sample placeId',
      promotionType: PromotionType.BOGO,
      schedules: [scheduleDTO],
      startDate: new Date(),
      userId: 'fake userId',
      address: '3094 Random Ave, Vancouver BC, V03M31',
    };

    userDTO = {
      email: 'test@gmail.com',
      firstName: 'A',
      lastName: 'B',
      username: 'AB',
      password: 'ABC',
    };
  });

  it('Should be able to convert ScheduleDTO to Schedule', () => {
    const schedule = DTOConverter.scheduleDTOtoSchedule(scheduleDTO);
    expect(schedule).toBeInstanceOf(Schedule);
    expect(schedule).toEqual(scheduleDTO);
  });

  it('Should be able to convert DiscountDTO to Discount', () => {
    const discount = DTOConverter.discountDTOtoDiscount(discountDTO);
    expect(discount).toBeInstanceOf(Discount);
    expect(discount).toEqual(discountDTO);
  });

  it('Should be able to convert UserDTO to User', () => {
    const user = DTOConverter.userDTOtoUser(userDTO);
    expect(user).toBeInstanceOf(User);

    expect(user).toEqual({
      firstName: userDTO.firstName,
      lastName: userDTO.lastName,
      username: userDTO.username,
    });
  });

  it('Should be able to convert PromotionDTO to Promotion', () => {
    const user = new UserFactory().generate();
    const restaurant = new RestaurantFactory().generate();
    const promotion = DTOConverter.promotionDTOtoPromotion(
      promotionDTO,
      user,
      restaurant
    );
    expect(promotion).toBeInstanceOf(Promotion);

    // userId is only needed to find the user
    const expectedPromotion = promotionDTO as any;
    delete expectedPromotion.placeId;
    delete expectedPromotion.userId;
    delete expectedPromotion.address;
    expect(promotion).toMatchObject(expectedPromotion);
    expect(promotion.schedules[0]).toEqual(scheduleDTO);
    expect(promotion.discount).toEqual(discountDTO);
    expect(promotion.user).toEqual(user);
  });
});
