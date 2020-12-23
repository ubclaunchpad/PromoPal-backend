import { NextFunction, Request, Response } from 'express';
import { PromotionRepository } from '../repository/PromotionRepository';
import { getCustomRepository } from 'typeorm';
import { Promotion } from '../entity/Promotion';
import { UserRepository } from '../repository/UserRepository';
import { Discount } from '../entity/Discount';
import {
  PromotionDTO,
  PromotionValidation,
} from '../validation/PromotionValidation';
import { IdValidation } from '../validation/IdValidation';
import {
  PromotionQueryDTO,
  PromotionQueryValidation,
} from '../validation/PromotionQueryValidation';
import { ScheduleDTO } from '../validation/ScheduleValidation';
import { Schedule } from '../entity/Schedule';

export class PromotionController {
  /**
   * Retrieves all promotions and their discounts
   * * First we need to validate the query params and cast that into a PromotionQueryDTO
   * * Then we apply the query options into the query builder depending on which properties are present
   * * Now we execute the query builder and return its results
   *
   * Note: if request.query contains searchQuery property, result returned back will have new property rank and will be sorted by rank non-ascending.
   * Rank represents how relevant the search query applies to the promotion
   */
  getAllPromotions = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const promotionQuery: PromotionQueryDTO = await PromotionQueryValidation.schema.validateAsync(
        request.query,
        {
          abortEarly: false,
        }
      );
      const promotions = await getCustomRepository(
        PromotionRepository
      ).getAllPromotions(promotionQuery);
      return response.send(promotions);
    } catch (e) {
      return next(e);
    }
  };

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
      ).findOneOrFail(id, {
        relations: ['discount', 'schedules'],
        cache: true,
      });
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
        promotionDTO.discount.discountType,
        promotionDTO.discount.discountValue
      );
      const schedules = promotionDTO.schedules.map(
        (scheduleDTO: ScheduleDTO) => {
          return new Schedule(
            scheduleDTO.startTime,
            scheduleDTO.endTime,
            scheduleDTO.dayOfWeek,
            scheduleDTO.isRecurring
          );
        }
      );

      const promotion = new Promotion(
        user,
        discount,
        schedules,
        promotionDTO.placeId,
        promotionDTO.promotionType,
        promotionDTO.cuisine,
        promotionDTO.name,
        promotionDTO.description,
        promotionDTO.startDate,
        promotionDTO.expirationDate
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
