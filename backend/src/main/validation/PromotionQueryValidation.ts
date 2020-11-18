import Joi, { ObjectSchema } from 'joi';
import { PromotionCategory } from '../data/PromotionCategory';
import { CuisineType } from '../data/CuisineType';
import { DiscountType } from '../data/DiscountType';

/**
 * Checks the validity of a promotion query, used when we make queries against all promotions
 * */
export class PromotionQueryValidation {
  static schema: ObjectSchema = Joi.object({
    searchQuery: Joi.string(),
    discountType: Joi.string().valid(...Object.values(DiscountType)),
    category: Joi.string().valid(...Object.values(PromotionCategory)),
    cuisine: Joi.string().valid(...Object.values(CuisineType)),
    expirationDate: Joi.date(), // note incoming format is a string, and Joi will automatically convert to type Date
  }).required();
}

export interface PromotionQueryDTO {
  searchQuery?: string;
  discountType?: DiscountType;
  category?: PromotionCategory;
  cuisine?: CuisineType;
  expirationDate?: Date;
}
