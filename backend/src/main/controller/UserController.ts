import { Request, Response, NextFunction, response } from "express";
import { getCustomRepository, getRepository } from "typeorm";
import { User } from "../entity/User";
import { UserRepository } from "../repository/UserRepository";
import { IdValidation } from "../validation/IdValidation";
import { UserDTO, UserValidation } from "../validation/UserValidation";
import { UserUpdateValidation, UserUpdateDTO} from "../validation/UserUpdateValidation";
import * as bcrypt from "bcryptjs";

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
            const user = await userRepository.delete(id);
            return res.status(204).send(user);
        } catch (e) {
            next(e);
        }
    };
}