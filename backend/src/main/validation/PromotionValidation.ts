import Joi, { ObjectSchema } from 'joi';
import { PromotionCategory } from '../data/PromotionCategory';
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
    category: Joi.string()
      .valid(...Object.values(PromotionCategory))
      .required(),
    cuisine: Joi.string()
      .valid(...Object.values(CuisineType))
      .required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    expirationDate: Joi.date().required(),
  }).required();
}

export interface PromotionDTO {
  userId: string;
  discount: DiscountDTO;
  placeId: string;
  category: PromotionCategory;
  cuisine: CuisineType;
  name: string;
  description: string;
  expirationDate: string;
}
