import Joi, { StringSchema } from 'joi';

/**
 * Class to validate firebase id
 * */
export class FirebaseIdValidation {
  static schema: StringSchema = Joi.string().required();
}
