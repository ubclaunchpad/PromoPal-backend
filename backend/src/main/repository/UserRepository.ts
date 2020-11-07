import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/User';
import { Promotion } from '../entity/Promotion';
import { SavedPromotion } from '../entity/SavedPromotion';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findByName(firstName: string, lastName: string): Promise<User | undefined> {
    return this.findOne({ firstName, lastName });
  }

  // adds to user's saved promotions with the given promotions.
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

  // adds a single promotion to a user's saved promotions
  // todo: we need to make sure we can handle a high number of requests of unsaving and saving a promotion, and never run into conditions
  //  where we are adding a promotion that is already save and never unsaving a promotion that is already unsaved, similar to https://github.com/ubclaunchpad/foodies/issues/49
  addSavedPromotion(user: User, promotion: Promotion): Promise<User> {
    const savedPromotion: SavedPromotion = new SavedPromotion(user, promotion);
    if (user.savedPromotions) {
      user.savedPromotions.push(savedPromotion);
    } else {
      user.savedPromotions = [savedPromotion];
    }
    return this.save(user);
  }
}
