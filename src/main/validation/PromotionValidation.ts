import Joi, { ObjectSchema } from 'joi';
import { PromotionType } from '../data/PromotionType';
import { CuisineType } from '../data/CuisineType';
import { DiscountDTO, DiscountValidation } from './DiscountValidation';
import { IdValidation } from './IdValidation';
import { ScheduleDTO, ScheduleValidation } from './ScheduleValidation';

/**
 * Checks the validity of a Promotion, used when we make a POST request to /promotions
 * */
export class PromotionValidation {
  static schema: ObjectSchema = Joi.object({
    userId: IdValidation.schema,
    placeId: Joi.string().required(),
    discount: DiscountValidation.schema,
    /**
     * A promotion must have at least one schedule and can have at most seven (each representing one day of the week)
     * Will validate each item in array with ScheduleValidation's schema
     * */
    schedules: Joi.array()
      .unique('dayOfWeek', { ignoreUndefined: true }) // ignore undefined so that in case object does not contain dayOfWeek at all
      .min(1)
      .max(7)
      .items(ScheduleValidation.schema)
      .required(),
    promotionType: Joi.string()
      .valid(...Object.values(PromotionType))
      .required(),
    cuisine: Joi.string()
      .valid(...Object.values(CuisineType))
      .required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    /**
     * startDate is NOT required. If is null/undefined, then default to current date.
     * However, Promotion.startDate cannot be null or undefined
     * * note incoming format is a string, and Joi will automatically convert to type Date
     * * startDate cannot be larger than expirationDate
     * */
    startDate: Joi.date()
      .max(Joi.ref('expirationDate'))
      .empty(null)
      .default(new Date()),
    /** note incoming format is a string, and Joi will automatically convert to type Date */
    expirationDate: Joi.date().required(),
    googlePlacesAddress: Joi.string().required(),
  }).required();
}

export interface PromotionDTO {
  userId: string;
  discount: DiscountDTO;
  schedules: ScheduleDTO[];
  placeId: string;
  promotionType: PromotionType;
  cuisine: CuisineType;
  name: string;
  description: string;
  startDate: Date;
  expirationDate: Date;
  googlePlacesAddress: string;
}
