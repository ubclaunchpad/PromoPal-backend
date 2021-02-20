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
      lat: 0.99,
      lon: 0.11,
      name: 'Sample name',
      placeId: 'Sample placeId',
      promotionType: PromotionType.BOGO,
      restaurantName: 'Sample restaurantName',
      schedules: [scheduleDTO],
      startDate: new Date(),
      userId: 'fake userId',
      restaurantAddress: '3012 Sample Ave, Vancouver BC',
    };

    userDTO = {
      email: 'test@gmail.com',
      firstName: 'A',
      lastName: 'B',
      idFirebase: 'test',
      username: 'AB',
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

    // PP-29 workaround sync we use bycrypt to hash password
    // userDTO.password = user.password;
    expect(user).toEqual(userDTO);
  });

  it('Should be able to convert PromotionDTO to Promotion', () => {
    const user = new UserFactory().generate();
    const promotion = DTOConverter.promotionDTOtoPromotion(promotionDTO, user);
    expect(promotion).toBeInstanceOf(Promotion);

    // userId is only needed to find the user
    const expectedPromotion = promotionDTO as any;
    delete expectedPromotion.userId;
    expect(promotion).toMatchObject(promotionDTO);
    expect(promotion.schedules[0]).toEqual(scheduleDTO);
    expect(promotion.discount).toEqual(discountDTO);
    expect(promotion.user).toEqual(user);
  });
});
