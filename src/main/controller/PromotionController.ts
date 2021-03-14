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
import { CachingService } from '../service/CachingService';
import { DTOConverter } from '../validation/DTOConverter';
import { VoteState } from '../entity/VoteRecord';
import { VoteRecordRepository } from '../repository/VoteRecordRepository';

export class PromotionController {
  private cachingService: CachingService;

  constructor(cachingService: CachingService) {
    this.cachingService = cachingService;
  }

  /**
   * Retrieves all promotions and their discounts
   * * First we need to validate the query params and cast that into a PromotionQueryDTO
   * * Then we apply the query options into the query builder depending on which properties are present
   * * Now we execute the query builder, get the lat/lon values per promotion from cache and return its results
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

        await this.cachingService.setLatLonForPromotions(promotions);
        return response.send(promotions);
      });
    } catch (e) {
      return next(e);
    }
  };

  /**
   * Retrieves a single promotion, its discount, and lat/lon values of associated restaurant
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
            relations: ['discount', 'schedules'],
            cache: true,
          });

        await this.cachingService.setLatLonForPromotion(promotion);
        return response.send(promotion);
      });
    } catch (e) {
      return next(e);
    }
  };

  /**
   * Adds a promotion to the database
   * * First, we need to validate the contents of request body and then cast that into PromotionDTO
   * * Then we construct a new Promotion using user, discount, and promotionDTO. (Note user and discount depend on promotionDTO)
   * * Lastly, we cache the lat/lon values of the promotion's restaurant
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
        const promotion = DTOConverter.promotionDTOtoPromotion(
          promotionDTO,
          user
        );

        const result = await transactionalEntityManager
          .getCustomRepository(PromotionRepository)
          .save(promotion);

        await this.cachingService.cacheLatLonValues(
          promotion.placeId,
          promotionDTO.lat,
          promotionDTO.lon
        );

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
        const uid = await IdValidation.schema.validateAsync(request.body, {
          abortEarly: false,
        });

        await this.checkIfUserAndPromotionExist(
          transactionalEntityManager,
          pid,
          uid
        );

        let voteRecord;
        try {
          voteRecord = await transactionalEntityManager
            .getCustomRepository(VoteRecordRepository)
            .findOneOrFail({ userId: uid, promotionId: pid });
        } catch (e) {
          // user vote first time
          voteRecord = transactionalEntityManager
            .getCustomRepository(VoteRecordRepository)
            .create({ userId: uid, promotionId: pid });
        }

        if (voteRecord.voteState === VoteState.UP) {
          // user cannot vote twice
          return response.status(204).send();
        } else {
          // user vote first time
          await transactionalEntityManager
            .getCustomRepository(PromotionRepository)
            .increment({ id: pid }, 'votes', 1);
        }
        voteRecord.voteState =
          voteRecord.voteState === VoteState.INIT
            ? VoteState.UP
            : VoteState.INIT;
        await transactionalEntityManager
          .getCustomRepository(VoteRecordRepository)
          .save(voteRecord);
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
        const uid = await IdValidation.schema.validateAsync(request.body, {
          abortEarly: false,
        });

        await this.checkIfUserAndPromotionExist(
          transactionalEntityManager,
          pid,
          uid
        );

        let voteRecord;
        try {
          voteRecord = await transactionalEntityManager
            .getCustomRepository(VoteRecordRepository)
            .findOneOrFail({ userId: uid, promotionId: pid });
        } catch (e) {
          // user vote first time
          voteRecord = transactionalEntityManager
            .getCustomRepository(VoteRecordRepository)
            .create({ userId: uid, promotionId: pid });
        }
        if (voteRecord.voteState === VoteState.DOWN) {
          // user cannot downvote twice
          return response.status(204).send();
        } else {
          // user downvote first time
          await transactionalEntityManager
            .getCustomRepository(PromotionRepository)
            .decrement({ id: pid }, 'votes', 1);
        }
        voteRecord.voteState =
          voteRecord.voteState === VoteState.INIT
            ? VoteState.DOWN
            : VoteState.INIT;
        await transactionalEntityManager
          .getCustomRepository(VoteRecordRepository)
          .save(voteRecord);
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
