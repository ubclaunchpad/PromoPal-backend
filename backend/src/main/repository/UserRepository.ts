import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/User';
import { Promotion } from '../entity/Promotion';
import { SavedPromotion } from '../entity/SavedPromotion';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findByName(firstName: string, lastName: string): Promise<User | undefined> {
    return this.findOne({ firstName, lastName });
  }

  /**
   * adds to user's saved promotions with the given promotions.
   * NOTE: this is only used for loading sample data. This is a very inefficient way of adding promotions, because we have to
   * load all of the users saved promotions, before we can concat more promotions
   */
  addSavedPromotions(user: User, promotions: Promotion[]): Promise<User> {
    const savedPromotions: SavedPromotion[] = promotions.map(
      (promotion: Promotion) => {
        return new SavedPromotion(user, promotion);
      }
    );

    if (user.savedPromotions) {
      user.savedPromotions.concat(savedPromotions);
    } else {
      user.savedPromotions = savedPromotions;
    }
    return this.save(user);
  }
}
