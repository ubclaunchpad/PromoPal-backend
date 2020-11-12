import Joi from 'joi';
import { DiscountType } from '../data/DiscountType';

/**
 * Checks the validity of a Discount
 * */
export class DiscountValidation {
  static schema = Joi.object({
    type: Joi.string()
      .valid(...Object.values(DiscountType))
      .required(),
    discountValue: Joi.number().strict().positive().precision(2).required(),
  }).required();
}

export interface DiscountDTO {
  type: DiscountType;
  discountValue: number;
}
