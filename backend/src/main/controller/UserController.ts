import { Request, Response, NextFunction } from 'express';
import { EntityManager, getManager } from 'typeorm';
import { User } from '../entity/User';
import { UserRepository } from '../repository/UserRepository';
import { IdValidation } from '../validation/IdValidation';
import { UserDTO, UserValidation } from '../validation/UserValidation';
import {
  UserUpdateValidation,
  UserUpdateDTO,
} from '../validation/UserUpdateValidation';
import * as bcrypt from 'bcryptjs';
import { PromotionRepository } from '../repository/PromotionRepository';
import { SavedPromotionRepository } from '../repository/SavedPromotionRepository';

export class UserController {
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
        const users = await userRepository.find();

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
        const user = await userRepository.findOneOrFail(id);
        return res.send(user);
      });
    } catch (e) {
      return next(e);
    }
  };

  // create new user
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
        const user = new User(
          userDTO.firstName,
          userDTO.lastName,
          userDTO.email,
          userDTO.username,
          userDTO.password
        );

        // try to save, if fails, the username is already in use
        const userRepository = transactionalEntityManager.getCustomRepository(
          UserRepository
        );
        const result = await userRepository.save(user);
        return res.status(201).send(result);
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
        if (userUpdateDTO.password) {
          userUpdateDTO.password = bcrypt.hashSync(userUpdateDTO.password, 8);
        }
        const result = await userRepository.update(id, userUpdateDTO);
        res.status(204).send(result);
      });
    } catch (e) {
      next(e);
    }
  };

  // delete one user
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
        const result = await userRepository.delete(id);
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
        const userRepository = transactionalEntityManager.getCustomRepository(
          UserRepository
        );
        const savedPromotions = await userRepository.findOneOrFail(id, {
          relations: ['savedPromotions', 'savedPromotions.promotion'],
        });

        res.status(200).send(savedPromotions);
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

  // delete promotion
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

        await this.checkIfUserAndPromotionExist(
          transactionalEntityManager,
          pid,
          uid
        );

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
          relations: ['uploadedPromotions', 'uploadedPromotions.promotion'],
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
