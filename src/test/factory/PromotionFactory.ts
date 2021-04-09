import { Discount } from '../../main/entity/Discount';
import { User } from '../../main/entity/User';
import { Schedule } from '../../main/entity/Schedule';
import { PromotionType } from '../../main/data/PromotionType';
import { CuisineType } from '../../main/data/CuisineType';
import { Promotion } from '../../main/entity/Promotion';
import { randomString } from '../utility/Utility';
import { Restaurant } from '../../main/entity/Restaurant';
import { DiscountFactory } from './DiscountFactory';
import { ScheduleFactory } from './ScheduleFactory';
import { RestaurantFactory } from './RestaurantFactory';

export class PromotionFactory {
  generate(
    user: User,
    discount: Discount,
    restaurant: Restaurant,
    schedules: Schedule[],
    promotionType?: PromotionType,
    cuisine?: CuisineType,
    name?: string,
    description?: string,
    startDate?: Date,
    expirationDate?: Date
  ): Promotion {
    return new Promotion(
      user,
      discount,
      restaurant,
      schedules,
      promotionType ?? PromotionType.DINNER_SPECIAL,
      cuisine ?? CuisineType.AFGHAN,
      name ?? randomString(10),
      description ?? randomString(100),
      startDate ?? new Date(),
      expirationDate ?? new Date()
    );
  }

  generateWithRelatedEntities(user: User, restaurant?: Restaurant): Promotion {
    return this.generate(
      user,
      new DiscountFactory().generate(),
      restaurant ?? new RestaurantFactory().generate(),
      [new ScheduleFactory().generate()]
    );
  }
}
