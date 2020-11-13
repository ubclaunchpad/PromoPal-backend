import Joi, { StringSchema } from 'joi';

/**
 * Class to validate whether id is of type UUID
 * */
export class IdValidation {
  static schema: StringSchema = Joi.string().uuid().required();
}