import { NextFunction, Request, Response } from 'express';
import { PromotionRepository } from '../repository/PromotionRepository';
import { EntityManager, getManager } from 'typeorm';
import { UserRepository } from '../repository/UserRepository';
import {
  PromotionDTO,
  PromotionValidation,
} from '../validation/PromotionValidation';
import { IdValidation } from '../validation/IdValidation';
import {
  PromotionQueryDTO,
  PromotionQueryValidation,
} from '../validation/PromotionQueryValidation';
import * as querystring from 'querystring';
import { DTOConverter } from '../validation/DTOConverter';
import { VoteState } from '../entity/VoteRecord';
import { VoteRecordRepository } from '../repository/VoteRecordRepository';
import { RestaurantRepository } from '../repository/RestaurantRepository';
import { Restaurant } from '../entity/Restaurant';
import { GeocodingService } from '../service/GeocodingService';

export class PromotionController {
  private geocodingService: GeocodingService;

  constructor(geocodingService: GeocodingService) {
    this.geocodingService = geocodingService;
  }

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
      await getManager().transaction(async (transactionalEntityManager) => {
        const promotionQuery: PromotionQueryDTO = await PromotionQueryValidation.schema.validateAsync(
          request.query,
          {
            abortEarly: false,
          }
        );
        // todo: may need to decode entire promotionQueryDTO
        // need to decode since request query will be encoded (e.g. spaces are %20)
        if (promotionQuery.searchQuery) {
          promotionQuery.searchQuery = querystring.unescape(
            promotionQuery.searchQuery
          );
        }
        const promotions = await transactionalEntityManager
          .getCustomRepository(PromotionRepository)
          .getAllPromotions(promotionQuery);

        return response.send(promotions);
      });
    } catch (e) {
      return next(e);
    }
  };

  /**
   * Retrieves a single promotion and its associated entities
   */
  getPromotion = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await getManager().transaction(async (transactionalEntityManager) => {
        const id = await IdValidation.schema.validateAsync(request.params.id, {
          abortEarly: false,
        });
        const promotion = await transactionalEntityManager
          .getCustomRepository(PromotionRepository)
          .findOneOrFail(id, {
            relations: ['discount', 'restaurant', 'schedules'],
            cache: true,
          });

        return response.send(promotion);
      });
    } catch (e) {
      return next(e);
    }
  };

  /**
   * Adds a promotion to the database
   * * First, we need to validate the contents of request body and then cast that into PromotionDTO
   * * Next, if our DB does not contain the restaurant yet, we use Geocoder to get the coordinates
   * * After, we save a new restaurant with these coordinates into the DB
   * * Then we construct a new Promotion along with its associated entities and the user
   * * Lastly, save promotion along with associated entities in DB and return result
   */
  addPromotion = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await getManager().transaction(async (transactionalEntityManager) => {
        const promotionDTO: PromotionDTO = await PromotionValidation.schema.validateAsync(
          request.body,
          { abortEarly: false }
        );

        const user = await transactionalEntityManager
          .getCustomRepository(UserRepository)
          .findOneOrFail(promotionDTO.userId);

        // find existing restaurant
        let restaurant = await transactionalEntityManager
          .getCustomRepository(RestaurantRepository)
          .findOne({ placeId: promotionDTO.placeId });

        if (!restaurant) {
          const geoCoordinate = await this.geocodingService.getGeoCoordinateFromAddress(
            promotionDTO.address
          );

          restaurant = new Restaurant(
            promotionDTO.placeId,
            geoCoordinate.lat,
            geoCoordinate.lon
          );
        }

        const promotion = DTOConverter.promotionDTOtoPromotion(
          promotionDTO,
          user,
          restaurant
        );

        const result = await transactionalEntityManager
          .getCustomRepository(PromotionRepository)
          .save(promotion);

        return response.status(201).send(result);
      });
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
      await getManager().transaction(async (transactionalEntityManager) => {
        const id = await IdValidation.schema.validateAsync(request.params.id, {
          abortEarly: false,
        });
        const promotion = await transactionalEntityManager
          .getCustomRepository(PromotionRepository)
          .delete(id);
        return response.status(204).send(promotion);
      });
    } catch (e) {
      return next(e);
    }
  };

  /**
   * Upvotes a promotion
   * todo: this endpoint should not be used until https://github.com/ubclaunchpad/foodies/issues/104 is finished
   */
  upVotePromotion = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await getManager().transaction(async (transactionalEntityManager) => {
        const pid = await IdValidation.schema.validateAsync(request.params.id, {
          abortEarly: false,
        });
        const uid = await IdValidation.schema.validateAsync(request.body.uid, {
          abortEarly: false,
        });

        await this.checkIfUserAndPromotionExist(
          transactionalEntityManager,
          pid,
          uid
        );

        const voteRecordRepository = transactionalEntityManager.getCustomRepository(
          VoteRecordRepository
        );

        const voteRecord = await voteRecordRepository.findOne({
          userId: uid,
          promotionId: pid,
        });
        if (!voteRecord) {
          await voteRecordRepository.save({
            userId: uid,
            promotionId: pid,
            voteState: VoteState.UP,
          });
          await transactionalEntityManager
            .getCustomRepository(PromotionRepository)
            .increment({ id: pid }, 'votes', 1);
          return response.status(204).send();
        }
        const voteValue: number =
          voteRecord.voteState === VoteState.UP
            ? -1
            : voteRecord.voteState === VoteState.DOWN
            ? 2
            : 1;
        voteRecord.voteState =
          voteRecord.voteState === VoteState.UP ? VoteState.INIT : VoteState.UP;
        await transactionalEntityManager
          .getCustomRepository(PromotionRepository)
          .increment({ id: pid }, 'votes', voteValue);
        await voteRecordRepository.save(voteRecord);
        return response.status(204).send();
      });
    } catch (e) {
      return next(e);
    }
  };

  /**
   * Downvotes a promotion
   * todo: this endpoint should not be used until https://github.com/ubclaunchpad/foodies/issues/104 is finished
   */
  downVotePromotion = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await getManager().transaction(async (transactionalEntityManager) => {
        const pid = await IdValidation.schema.validateAsync(request.params.id, {
          abortEarly: false,
        });
        const uid = await IdValidation.schema.validateAsync(request.body.uid, {
          abortEarly: false,
        });

        await this.checkIfUserAndPromotionExist(
          transactionalEntityManager,
          pid,
          uid
        );

        const voteRecordRepository = transactionalEntityManager.getCustomRepository(
          VoteRecordRepository
        );

        const voteRecord = await voteRecordRepository.findOne({
          userId: uid,
          promotionId: pid,
        });
        if (!voteRecord) {
          await voteRecordRepository.save({
            userId: uid,
            promotionId: pid,
            voteState: VoteState.DOWN,
          });
          await transactionalEntityManager
            .getCustomRepository(PromotionRepository)
            .decrement({ id: pid }, 'votes', 1);
          return response.status(204).send();
        }
        const voteValue: number =
          voteRecord.voteState === VoteState.DOWN
            ? -1
            : voteRecord.voteState === VoteState.UP
            ? 2
            : 1;
        voteRecord.voteState =
          voteRecord.voteState === VoteState.DOWN
            ? VoteState.INIT
            : VoteState.DOWN;
        await transactionalEntityManager
          .getCustomRepository(PromotionRepository)
          .decrement({ id: pid }, 'votes', voteValue);
        await voteRecordRepository.save(voteRecord);
        return response.status(204).send();
      });
    } catch (e) {
      return next(e);
    }
  };

  /**
   * Checks if repositories contain entity with respective IDs
   * */
  private async checkIfUserAndPromotionExist(
    transactionalEntityManager: EntityManager,
    pid: string,
    uid: string
  ) {
    await transactionalEntityManager
      .getCustomRepository(PromotionRepository)
      .findOneOrFail(pid);
    await transactionalEntityManager
      .getCustomRepository(UserRepository)
      .findOneOrFail(uid);
  }
}
