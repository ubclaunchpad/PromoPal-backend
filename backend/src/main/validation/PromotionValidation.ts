import Joi, { ObjectSchema } from 'joi';
import { PromotionType } from '../data/PromotionType';
import { CuisineType } from '../data/CuisineType';
import { DiscountDTO, DiscountValidation } from './DiscountValidation';
import { IdValidation } from './IdValidation';

/**
 * Checks the validity of a Promotion, used when we make a POST request to /promotions
 * */
export class PromotionValidation {
  static schema: ObjectSchema = Joi.object({
    userId: IdValidation.schema,
    placeId: Joi.string().required(),
    discount: DiscountValidation.schema,
    promotionType: Joi.string()
      .valid(...Object.values(PromotionType))
      .required(),
    cuisine: Joi.string()
      .valid(...Object.values(CuisineType))
      .required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    expirationDate: Joi.date().required(), // note incoming format is a string, and Joi will automatically convert to type Date
  }).required();
}

export interface PromotionDTO {
  userId: string;
  discount: DiscountDTO;
  placeId: string;
  promotionType: PromotionType;
  cuisine: CuisineType;
  name: string;
  description: string;
  expirationDate: Date;
}
