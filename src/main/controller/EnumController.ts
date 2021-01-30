import { DiscountType } from '../data/DiscountType';
import { PromotionType } from '../data/PromotionType';
import { CuisineType } from '../data/CuisineType';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { Day } from '../data/Day';

enum SupportedEnums {
  DiscountType = 'DiscountType',
  PromotionType = 'PromotionType',
  CuisineType = 'CuisineType',
  Day = 'Day',
}

export class EnumController {
  // validates that incoming string is of type SupportedEnums
  private enumSchemaValidation = Joi.string()
    .valid(...Object.values(SupportedEnums))
    .required();

  /**
   * returns all possible values of an enum. Otherwise throws validation error if not a supported enum
   * */
  getEnum = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const enumString: SupportedEnums = await this.enumSchemaValidation.validateAsync(
        request.params.enum,
        { abortEarly: false }
      );
      const enumClass = this.getEnumClass(enumString);
      const enumValues = this.getEnumValues(enumClass);
      return response.status(200).send(enumValues);
    } catch (e) {
      next(e);
    }
  };

  /**
   * returns the corresponding class matching the enumString
   * */
  private getEnumClass(supportedEnums: SupportedEnums) {
    switch (supportedEnums) {
      case SupportedEnums.DiscountType:
        return DiscountType;
      case SupportedEnums.PromotionType:
        return PromotionType;
      case SupportedEnums.CuisineType:
        return CuisineType;
      case SupportedEnums.Day:
        return Day;
    }
  }

  /**
   * generic function that returns all the values of a specific enum
   * */
  private getEnumValues<T>(arg: T): string[] {
    return Object.values(arg);
  }
}
