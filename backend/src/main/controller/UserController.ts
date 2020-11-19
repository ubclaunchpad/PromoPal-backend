import { Request, Response, NextFunction, response } from "express";
import { getConnection, getCustomRepository, getRepository } from "typeorm";
import { User } from "../entity/User";
import { UserRepository } from "../repository/UserRepository";
import { IdValidation } from "../validation/IdValidation";
import { UserDTO, UserValidation } from "../validation/UserValidation";
import { UserUpdateValidation, UserUpdateDTO} from "../validation/UserUpdateValidation";
import * as bcrypt from "bcryptjs";
import { PromotionRepository } from "../repository/PromotionRepository";
import { SavedPromotion } from "../entity/SavedPromotion";
import { SavedPromotionRepository } from "../repository/SavedPromotionRepository";

export class UserController {
    /**
     * Access user profile data
     * * validate query first
     * * apply them into query builder
     */

    // return all user
    listAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // get users from database
            const userRepository = getCustomRepository(UserRepository);
            const users = await userRepository.find({
                select: ["id", "username", "firstName", "lastName"]
            });
    
            // send the users object
            res.send(users);
        } catch (e) {
            return next(e);
        }
    };

    // return one user
    getOneById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // get the id from the url
            const id = await IdValidation.schema.validateAsync(req.params.id, {
                abortEarly: false,
            });
            const userRepository = getCustomRepository(UserRepository);
            const user = await userRepository.findOneOrFail(id);
            return res.send(user);
        } catch (e) {
            return next(e);
        }
    };

    // create new user
    newUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // get parameters from the body
            const userDTO: UserDTO = await UserValidation.schema.validateAsync(
                req.body,
                { abortEarly: false }
            );
            let user = new User(userDTO.firstName, userDTO.lastName, userDTO.email, userDTO.username, userDTO.password);
            
            // try to save, if fails, the username is already in use
            const userRepository = getCustomRepository(UserRepository);
            const result = await userRepository.save(user);
            return res.status(201).send(result);
        } catch (e) {
            return next(e);
        }
    };

    // update one user
    editUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // get the ID from the url
            const id = await IdValidation.schema.validateAsync(req.params.id, {
                abortEarly: false,
            });
            const userRepository = getCustomRepository(UserRepository);
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
        } catch (e) {
            next(e);
        }
    };

    // delete one user
    deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // get the ID from the url
            const id = await IdValidation.schema.validateAsync(req.params.id, {
                abortEarly: false,
            });
            const userRepository = getCustomRepository(UserRepository);
            const result = await userRepository.delete(id);
            return res.status(204).send(result);
        } catch (e) {
            next(e);
        }
    };

    // get all saved promotion
    getSaved = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // get the id of user from the url
            const id = await IdValidation.schema.validateAsync(req.params.id, {
                abortEarly: false,
            });
            const userRepository = getCustomRepository(UserRepository);
            const savedpromotions = await userRepository.findOneOrFail(id, {
                relations: ["savedPromotions"]
            });
            
            res.status(200).send(savedpromotions);
        } catch (e) {
            next(e);
        }
    };
    // saved new promotion
    newSaved = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // get the id of user and promotion from the url
            const uid = await IdValidation.schema.validateAsync(req.params.id, {
                abortEarly: false,
            });
            const pid = await IdValidation.schema.validateAsync(req.params.pid, {
                abortEarly: false,
            });
            // create new saved promotion for the user based on promotion id
            const promotion = await getCustomRepository(PromotionRepository).findOneOrFail(pid);
            const user = await getCustomRepository(UserRepository).findOneOrFail(uid);
            const result = await getCustomRepository(UserRepository).addSavedPromotion(user, promotion);

            res.status(201).send(result);
        } catch (e) {
            next(e);
        }
    };

    // delete promotion
    deleteSaved = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // get the id of user and promotion from the url
            const uid = await IdValidation.schema.validateAsync(req.params.id, {
                abortEarly: false,
            });
            const pid = await IdValidation.schema.validateAsync(req.params.pid, {
                abortEarly: false,
            });
            // get saved promotion and user
            const promotion = await getCustomRepository(PromotionRepository).findOneOrFail(pid);
            const user = await getCustomRepository(UserRepository).findOneOrFail(uid);
            // remove the promotion from user's list of saved promotions
            const result = await getCustomRepository(UserRepository).removeSavedPromotion(user, promotion);

            return res.status(204).send(result);
        } catch (e) {
            next(e);
        }
    };

    // get uploaded promotion
    getUploaded = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // get the id of user from the url
            const id = await IdValidation.schema.validateAsync(req.params.id, {
                abortEarly: false,
            });
            const userRepository = getCustomRepository(UserRepository);
            const uploadedpromotions = await userRepository.findOneOrFail(id, {
                relations: ["uploadedPromotions"]
            });
            
            res.status(200).send(uploadedpromotions);
        } catch (e) {
            next(e);
        }
    };
}