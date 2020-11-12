import Joi, { ObjectSchema } from 'joi';
import { PromotionCategory } from '../data/PromotionCategory';
import { CuisineType } from '../data/CuisineType';
import { DiscountType } from '../data/DiscountType';

/**
 * Checks the validity of a promotion query, used when we make queries against all promotions
 * */
export class PromotionQueryValidation {
  static schema: ObjectSchema = Joi.object({
    name: Joi.string(),
    discountType: Joi.string().valid(...Object.values(DiscountType)),
    category: Joi.string().valid(...Object.values(PromotionCategory)),
    cuisine: Joi.string().valid(...Object.values(CuisineType)),
    expirationDate: Joi.date(),
  }).required();
}

export interface PromotionQueryDTO {
  name: string;
  discountType: DiscountType;
  category: PromotionCategory;
  cuisine: CuisineType;
  expirationDate: string;
}