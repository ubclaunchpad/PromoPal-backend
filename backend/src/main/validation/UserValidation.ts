import Joi, { ObjectSchema } from 'joi';
import { IdValidation } from './IdValidation';

/**
 * check the validity of an user, used when we make a POST request to /users
 */
export class UserValidation {
    static schema: ObjectSchema = Joi.object({
        username: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().min(8).required(),
    }).required();
}

export interface UserDTO {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}