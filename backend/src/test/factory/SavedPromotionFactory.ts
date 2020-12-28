import { Discount } from '../../main/entity/Discount';
import { User } from '../../main/entity/User';
import { Schedule } from '../../main/entity/Schedule';
import { PromotionType } from '../../main/data/PromotionType';
import { CuisineType } from '../../main/data/CuisineType';
import { Promotion } from '../../main/entity/Promotion';
import { randomString } from '../utility/Utility';
import { SavedPromotion } from '../../main/entity/SavedPromotion';

export class SavedPromotionFactory {
  generate(user: User, promotion: Promotion) {
    return new SavedPromotion(user, promotion);
  }
}
