import Joi from 'joi';

/**
 * Checks the validity of a Restaurant
 * */
export class RestaurantValidation {
  static schema = Joi.object({
    lat: Joi.number().min(-90).max(90).required().strict(true),
    lon: Joi.number().min(-180).max(180).required().strict(true),
    name: Joi.string().required(),
    address: Joi.string().required(),
  }).required();
}

export interface RestaurantDTO {
  name: string;
  address: string;
  lat: number;
  lon: number;
}
