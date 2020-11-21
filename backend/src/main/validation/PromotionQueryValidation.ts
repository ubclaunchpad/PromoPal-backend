import Joi, { ObjectSchema } from 'joi';
import { PromotionType } from '../data/PromotionType';
import { CuisineType } from '../data/CuisineType';
import { DiscountType } from '../data/DiscountType';

/**
 * Checks the validity of a promotion query, used when we make queries against all promotions
 * */
export class PromotionQueryValidation {
  static schema: ObjectSchema = Joi.object({
    searchQuery: Joi.string(),
    discountType: Joi.string().valid(...Object.values(DiscountType)),
    promotionType: Joi.string().valid(...Object.values(PromotionType)),
    cuisine: Joi.string().valid(...Object.values(CuisineType)),
    /** note incoming format is a string, and Joi will automatically convert to type Date */
    expirationDate: Joi.date(),
  }).required();
}

export interface PromotionQueryDTO {
  searchQuery?: string;
  discountType?: DiscountType;
  promotionType?: PromotionType;
  cuisine?: CuisineType;
  expirationDate?: Date;
}
