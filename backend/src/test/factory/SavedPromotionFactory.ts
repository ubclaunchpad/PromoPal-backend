import { User } from '../../main/entity/User';
import { Promotion } from '../../main/entity/Promotion';
import { SavedPromotion } from '../../main/entity/SavedPromotion';

export class SavedPromotionFactory {
  generate(user: User, promotion: Promotion): SavedPromotion {
    return new SavedPromotion(user, promotion);
  }
}
