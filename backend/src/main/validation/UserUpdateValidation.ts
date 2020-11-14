import Joi, { ObjectSchema } from 'joi';

/**
 * check the validity of an user, used when we make a POST request to /users
 */
export class UserUpdateValidation {
    static schema: ObjectSchema = Joi.object({
        username: Joi.string(),
        firstName: Joi.string(),
        lastName: Joi.string(),
        email: Joi.string(),
        password: Joi.string().min(8),
    }).required();
}

export interface UserUpdateDTO {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}