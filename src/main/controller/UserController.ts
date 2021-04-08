import { Request, Response, NextFunction } from 'express';
import { EntityManager, getManager, In } from 'typeorm';
import { UserRepository } from '../repository/UserRepository';
import { IdValidation } from '../validation/IdValidation';
import { UserDTO, UserValidation } from '../validation/UserValidation';
import {
  UserUpdateValidation,
  UserUpdateDTO,
} from '../validation/UserUpdateValidation';
import { PromotionRepository } from '../repository/PromotionRepository';
import { SavedPromotionRepository } from '../repository/SavedPromotionRepository';
import { DTOConverter } from '../validation/DTOConverter';
import { SavedPromotion } from '../entity/SavedPromotion';
import { Promotion } from '../entity/Promotion';
import { ForbiddenError } from '../errors/Error';
import { ResourceCleanupService } from '../service/ResourceCleanupService';
import { FirebaseService } from '../service/FirebaseService';

export class UserController {
  private resourceCleanupService: ResourceCleanupService;
  private firebaseService: FirebaseService;

  constructor(
    resourceCleanupService: ResourceCleanupService,
    firebaseService: FirebaseService
  ) {
    this.resourceCleanupService = resourceCleanupService;
    this.firebaseService = firebaseService;
  }

  /**
   * Access user profile data
   * * validate query first
   * * apply them into query builder
   */

  // return all user
  listAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await getManager().transaction(async (transactionalEntityManager) => {
        // get users from database
        const userRepository = transactionalEntityManager.getCustomRepository(
          UserRepository
        );
        const users = await userRepository.find({ cache: true });

        // send the users object
        return res.status(200).send(users);
      });
    } catch (e) {
      return next(e);
    }
  };

  // return one user
  getOneById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await getManager().transaction(async (transactionalEntityManager) => {
        const id = await IdValidation.schema.validateAsync(req.params.id, {
          abortEarly: false,
        });
        const userRepository = transactionalEntityManager.getCustomRepository(
          UserRepository
        );
        const user = await userRepository.findOneOrFail(id, { cache: true });
        return res.send(user);
      });
    } catch (e) {
      return next(e);
    }
  };

  /**
   * Create a new user in our database and then create a user in firebase.
   * * To guarantee ACID properties, if creating a user in firebase fails, we must delete the user in our database
   * */
  newUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await getManager().transaction(async (transactionalEntityManager) => {
        // get parameters from the body
        const userDTO: UserDTO = await UserValidation.schema.validateAsync(
          req.body,
          { abortEarly: false }
        );
        const user = DTOConverter.userDTOtoUser(userDTO);

        // try to save, if fails, the username is already in use
        const userRepository = transactionalEntityManager.getCustomRepository(
          UserRepository
        );
        const savedUser = await userRepository.save(user);
        try {
          await this.firebaseService.createUserFromEmailAndPassword(
            savedUser.id,
            userDTO.email,
            userDTO.password
          );
        } catch (e) {
          await userRepository.delete(savedUser);
          throw e;
        }
        return res.status(201).send(savedUser);
      });
    } catch (e) {
      return next(e);
    }
  };

  // update one user
  editUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await getManager().transaction(async (transactionalEntityManager) => {
        // get the ID from the url
        const id = await IdValidation.schema.validateAsync(req.params.id, {
          abortEarly: false,
        });
        const userRepository = transactionalEntityManager.getCustomRepository(
          UserRepository
        );
        // get parameters from the body
        const userUpdateDTO: UserUpdateDTO = await UserUpdateValidation.schema.validateAsync(
          req.body,
          { abortEarly: false }
        );
        const result = await userRepository.update(id, userUpdateDTO);
        res.status(204).send(result);
      });
    } catch (e) {
      next(e);
    }
  };

  /**
   * Delete a user.
   * We need to ensure that a user can only delete their own account.
   * */
  deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await getManager().transaction(async (transactionalEntityManager) => {
        // get the ID from the url
        const id = await IdValidation.schema.validateAsync(req.params.id, {
          abortEarly: false,
        });

        const userRepository = transactionalEntityManager.getCustomRepository(
          UserRepository
        );

        // the firebaseId and userId should be the same if a user is trying to delete their own account
        if (res.locals.firebaseUserId !== id) {
          throw new ForbiddenError();
        }

        const uploadedPromotions = await transactionalEntityManager
          .getCustomRepository(PromotionRepository)
          .find({
            select: ['id'],
            where: {
              user: {
                id,
              },
            },
          });
        const uploadedPromotionIds = uploadedPromotions.map(
          (promotion) => promotion.id
        );

        const result = await userRepository.delete(id);
        await this.resourceCleanupService.cleanupResourceForPromotions(
          uploadedPromotionIds
        );
        return res.status(204).send(result);
      });
    } catch (e) {
      next(e);
    }
  };

  // get all saved promotion
  getSaved = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await getManager().transaction(async (transactionalEntityManager) => {
        // get the id of user from the url
        const id = await IdValidation.schema.validateAsync(req.params.id, {
          abortEarly: false,
        });

        // get all ids of promotions that user has saved
        const rawPromotionIds = await transactionalEntityManager
          .createQueryBuilder()
          .select('savedPromotions.promotionId')
          .from(SavedPromotion, 'savedPromotions')
          .where('savedPromotions.userId = :id', { id })
          .cache(true)
          .getRawMany();
        const promotionIds = rawPromotionIds.map(
          (rawPromotion) => rawPromotion.savedPromotions_promotionId
        );

        let promotions: Promotion[] = [];

        if (promotionIds.length) {
          // get all promotions using the promotion id's, DO NOT join to discount/schedules, we don't need all the information
          promotions = await transactionalEntityManager
            .getCustomRepository(PromotionRepository)
            .find({
              where: {
                id: In(promotionIds),
              },
              relations: ['discount', 'schedules', 'restaurant'],
            });
        }

        res.status(200).send(promotions);
      });
    } catch (e) {
      next(e);
    }
  };

  // saved new promotion
  newSaved = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await getManager().transaction(async (transactionalEntityManager) => {
        // get the id of user and promotion from the url
        const uid = await IdValidation.schema.validateAsync(req.params.id, {
          abortEarly: false,
        });
        const pid = await IdValidation.schema.validateAsync(req.params.pid, {
          abortEarly: false,
        });

        await this.checkIfUserAndPromotionExist(
          transactionalEntityManager,
          pid,
          uid
        );

        // create new saved promotion for the user based on promotion id
        const savedPromotion = transactionalEntityManager
          .getCustomRepository(SavedPromotionRepository)
          .create({ userId: uid, promotionId: pid });

        const result = await transactionalEntityManager
          .getCustomRepository(SavedPromotionRepository)
          .save(savedPromotion);
        return res.status(201).send(result);
      });
    } catch (e) {
      next(e);
    }
  };

  // delete saved promotion
  deleteSaved = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await getManager().transaction(async (transactionalEntityManager) => {
        // get the id of user and promotion from the url
        const uid = await IdValidation.schema.validateAsync(req.params.id, {
          abortEarly: false,
        });
        const pid = await IdValidation.schema.validateAsync(req.params.pid, {
          abortEarly: false,
        });

        // remove the promotion from user's list of saved promotions
        const result = await transactionalEntityManager
          .getCustomRepository(SavedPromotionRepository)
          .delete({
            userId: uid,
            promotionId: pid,
          });
        return res.status(204).send(result);
      });
    } catch (e) {
      next(e);
    }
  };

  // get uploaded promotion
  getUploaded = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await getManager().transaction(async (transactionalEntityManager) => {
        // get the id of user from the url
        const id = await IdValidation.schema.validateAsync(req.params.id, {
          abortEarly: false,
        });
        const userRepository = transactionalEntityManager.getCustomRepository(
          UserRepository
        );
        const uploadedPromotions = await userRepository.findOneOrFail(id, {
          relations: ['uploadedPromotions'],
          cache: true,
        });

        return res.status(200).send(uploadedPromotions);
      });
    } catch (e) {
      next(e);
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
