import { NextFunction, Request, Response } from 'express';
import { PromotionRepository } from '../repository/PromotionRepository';
import { getCustomRepository, SelectQueryBuilder } from 'typeorm';
import { Promotion } from '../entity/Promotion';
import { UserRepository } from '../repository/UserRepository';
import { Discount } from '../entity/Discount';
import {
  PromotionDTO,
  PromotionValidation,
} from '../validation/PromotionValidation';
import {
  PromotionQueryDTO,
  PromotionQueryValidation,
} from '../validation/PromotionQueryValidation';
import { IdValidation } from '../validation/IdValidation';

/* eslint-disable  @typescript-eslint/no-explicit-any */
export class PromotionController {
  /**
   * Retrieves all promotions and their discounts
   * * First we need to validate the query params and cast that into a PromotionQueryDTO
   * * Then we apply the query options into the query builder depending on which properties are present
   * * Now we execute the query builder and return its results
   */
  getAllPromotions = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      let queryBuilder = getCustomRepository(PromotionRepository)
        .createQueryBuilder('promotion')
        .innerJoinAndSelect('promotion.discount', 'discount');

      if (request.query) {
        const promotionQuery: PromotionQueryDTO = await PromotionQueryValidation.schema.validateAsync(
          request.query,
          { abortEarly: false }
        );
        queryBuilder = this.applyQueryOptions(queryBuilder, promotionQuery);
      }

      const promotions = await queryBuilder.getMany();
      return response.send(promotions);
    } catch (e) {
      return next(e);
    }
  };

  /**
   * Depending on which properties are defined inside promotionQuery, we add those properties into our query for the queryBuilder to execute.
   */
  private applyQueryOptions(
    queryBuilder: SelectQueryBuilder<Promotion>,
    promotionQuery: PromotionQueryDTO
  ): SelectQueryBuilder<Promotion> {
    if (promotionQuery?.category) {
      queryBuilder = queryBuilder.andWhere('promotion.category = :category', {
        category: promotionQuery.category,
      });
    }

    if (promotionQuery?.cuisine) {
      queryBuilder = queryBuilder.andWhere('promotion.cuisine = :cuisine', {
        cuisine: promotionQuery.cuisine,
      });
    }

    if (promotionQuery?.discountType) {
      queryBuilder = queryBuilder.andWhere('discount.type = :type', {
        type: promotionQuery.discountType,
      });
    }

    if (promotionQuery?.expirationDate) {
      queryBuilder = queryBuilder.andWhere(
        'promotion.expirationDate >= :date',
        {
          date: new Date(promotionQuery.expirationDate),
        }
      );
    }

    if (promotionQuery?.name) {
      let name = promotionQuery.name;

      // first escape % and _ (request needs to show it as https://stackoverflow.com/questions/17342671/pass-a-percent-sign-in-a-url-and-get-exact-value-of-it-using-php)
      // this way users can query promotions that contain % or _
      name = name.replace('%', '\\%');
      name = name.replace('_', '\\_');

      // add wildcards
      name = `%${name.replace(/ /g, '%')}%`;

      queryBuilder = queryBuilder.andWhere('promotion.name ilike :name', {
        name: name,
      });
    }

    return queryBuilder;
  }

  /**
   * Retrieves a single promotion and its discount
   */
  getPromotion = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const id = await IdValidation.schema.validateAsync(request.params.id, {
        abortEarly: false,
      });
      const promotion = await getCustomRepository(
        PromotionRepository
      ).findOneOrFail(id, { relations: ['discount'] });
      return response.send(promotion);
    } catch (e) {
      return next(e);
    }
  };

  /**
   * Adds a promotion to the database
   * * First, we need to validate the contents of request body and then cast that into PromotionDTO
   * * Then we construct a new Promotion using user, discount, and promotionDTO. (Note user and discount depend on promotionDTO)
   */
  addPromotion = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const promotionDTO: PromotionDTO = await PromotionValidation.schema.validateAsync(
        request.body,
        { abortEarly: false }
      );

      const user = await getCustomRepository(UserRepository).findOneOrFail(
        promotionDTO.userId
      );
      const discount = new Discount(
        promotionDTO.discount.type,
        promotionDTO.discount.discountValue
      );
      const expirationDate = new Date(promotionDTO.expirationDate);
      const promotion = new Promotion(
        user,
        discount,
        promotionDTO.placeId,
        promotionDTO.category,
        promotionDTO.cuisine,
        promotionDTO.name,
        promotionDTO.description,
        expirationDate
      );

      const result = await getCustomRepository(PromotionRepository).save(
        promotion
      );
      return response.status(201).send(result);
    } catch (e) {
      return next(e);
    }
  };

  /**
   * Deletes a promotion
   */
  deletePromotion = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const id = await IdValidation.schema.validateAsync(request.params.id, {
        abortEarly: false,
      });
      const promotion = await getCustomRepository(PromotionRepository).delete(
        id
      );
      return response.status(204).send(promotion);
    } catch (e) {
      return next(e);
    }
  };
}
