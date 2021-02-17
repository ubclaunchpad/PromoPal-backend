import { User } from '../entity/User';
import { Promotion } from '../entity/Promotion';
import { ScheduleDTO } from './ScheduleValidation';
import { PromotionDTO } from './PromotionValidation';
import { Schedule } from '../entity/Schedule';
import { Discount } from '../entity/Discount';
import { DiscountDTO } from './DiscountValidation';
import { UserDTO } from './UserValidation';

/**
 * Converts Data Transfer Objects (DTO's) to entity's
 * * Each DTO represents a contract for the format of data we receive in our request body or request parameters at
 * the controller level
 * * Once the DTO has been validated against its respective schema, then this class should be used.
 * */
export class DTOConverter {
  /**
   * Convert PromotionDTO to a Promotion
   */
  static promotionDTOtoPromotion(
    promotionDTO: PromotionDTO,
    user: User
  ): Promotion {
    const discount = this.discountDTOtoDiscount(promotionDTO.discount);
    const schedules = promotionDTO.schedules.map((scheduleDTO: ScheduleDTO) => {
      return this.scheduleDTOtoSchedule(scheduleDTO);
    });

    const promotion = new Promotion(
      user,
      discount,
      schedules,
      promotionDTO.placeId,
      promotionDTO.promotionType,
      promotionDTO.cuisine,
      promotionDTO.name,
      promotionDTO.description,
      promotionDTO.startDate,
      promotionDTO.expirationDate,
      promotionDTO.restaurantName
    );

    promotion.lat = promotionDTO.lat;
    promotion.lon = promotionDTO.lon;

    return promotion;
  }

  /**
   * Convert ScheduleDTO to a Schedule
   */
  static scheduleDTOtoSchedule(scheduleDTO: ScheduleDTO): Schedule {
    return new Schedule(
      scheduleDTO.startTime,
      scheduleDTO.endTime,
      scheduleDTO.dayOfWeek,
      scheduleDTO.isRecurring
    );
  }

  /**
   * Convert DiscountDTO to Discount
   */
  static discountDTOtoDiscount(discountDTO: DiscountDTO): Discount {
    return new Discount(discountDTO.discountType, discountDTO.discountValue);
  }

  /**
   * Convert UserDTO to a User
   */
  static userDTOtoUser(userDTO: UserDTO): User {
    return new User(
      userDTO.firstName,
      userDTO.lastName,
      userDTO.email,
      userDTO.username,
      userDTO.idFirebase
    );
  }
}
