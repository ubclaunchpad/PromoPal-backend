import Joi, { ObjectSchema } from 'joi';

/**
 * check the validity of an user, used when we make a PATCH request to /users
 */
export class UserUpdateValidation {
  static schema: ObjectSchema = Joi.object({
    username: Joi.string().allow(''),
    firstName: Joi.string().allow(''),
    lastName: Joi.string().allow(''),
  }).required();
}

export interface UserUpdateDTO {
  username: string;
  firstName: string;
  lastName: string;
}
