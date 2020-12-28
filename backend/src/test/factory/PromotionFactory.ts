import { Discount } from '../../main/entity/Discount';
import { User } from '../../main/entity/User';
import { Schedule } from '../../main/entity/Schedule';
import { PromotionType } from '../../main/data/PromotionType';
import { CuisineType } from '../../main/data/CuisineType';
import { Promotion } from '../../main/entity/Promotion';
import { randomString } from '../utility/Utility';

export class PromotionFactory {
  generate(
    user: User,
    discount: Discount,
    schedules: Schedule[],
    placeId?: string,
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
      schedules,
      placeId ?? randomString(10),
      promotionType ?? PromotionType.DINNER_SPECIAL,
      cuisine ?? CuisineType.AFGHAN,
      name ?? randomString(10),
      description ?? randomString(100),
      startDate ?? new Date(),
      expirationDate ?? new Date()
    );
  }
}
