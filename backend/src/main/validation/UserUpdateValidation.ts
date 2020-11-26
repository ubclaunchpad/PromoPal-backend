import Joi, { ObjectSchema } from 'joi';

/**
 * check the validity of an user, used when we make a PATCH request to /users
 */
export class UserUpdateValidation {
  static schema: ObjectSchema = Joi.object({
    username: Joi.string().allow(''),
    firstName: Joi.string().allow(''),
    lastName: Joi.string().allow(''),
    email: Joi.string().email().allow(''),
    password: Joi.string().min(8).allow(''),
  }).required();
}

export interface UserUpdateDTO {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
