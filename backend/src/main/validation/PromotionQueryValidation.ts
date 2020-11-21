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
    /**
     * No .strict() compared to DiscountValidation so we can convert string to number
     * Will not throw error if more than two decimal places, precision(2) will automatically convert to 2 decimal places since no .strict()
     * */
    discountValue: Joi.number().positive().precision(2),
    promotionType: Joi.string().valid(...Object.values(PromotionType)),
    cuisine: Joi.string().valid(...Object.values(CuisineType)),
    expirationDate: Joi.date(), // note incoming format is a string, and Joi will automatically convert to type Date
  })
    .required()
    /**
     * We do not want to filter promotions by discount value without a discount type.
     * Whenever discountValue is present, discountType must be as well.
     * */
    .with('discountValue', 'discountType');
}

export interface PromotionQueryDTO {
  searchQuery?: string;
  discountType?: DiscountType;
  discountValue?: number;
  promotionType?: PromotionType;
  cuisine?: CuisineType;
  expirationDate?: Date;
}
