import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/User';
import { Promotion } from '../entity/Promotion';
import { SavedPromotion } from '../entity/SavedPromotion';

@EntityRepository(SavedPromotion)
export class SavedPromotionRepository extends Repository<SavedPromotion> {
  // adds to user's saved promotions with the given promotions.
  addSavedPromotions(
    user: User,
    promotions: Promotion[]
  ): Promise<SavedPromotion[]> {
    const promises: Promise<SavedPromotion>[] = promotions.map(
      (promotion: Promotion) => {
        return this.save(new SavedPromotion(user, promotion));
      }
    );

    return Promise.all(promises).catch((error) => {
      return error;
    });
  }

  addSavedPromotion(
    user: User,
    promotion: Promotion
  ): Promise<SavedPromotion> {
   return this.save(new SavedPromotion(user, promotion)); 
  }

  deleteSavedPromotion(
    user: User,
    promotion: Promotion
  ): Promise<DeleteResult> {
    return this.delete({userId: user.id, promotionId: promotion.id});
  }
  // todo: we need to make sure we can handle a high number of requests of unsaving and saving a promotion, and never run into conditions
  //  where we are adding a promotion that is already save and never unsaving a promotion that is already unsaved, similar to https://github.com/ubclaunchpad/foodies/issues/49
}
