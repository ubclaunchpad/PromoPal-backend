import { Request, Response, NextFunction } from "express";
import { getCustomRepository, getRepository } from "typeorm";
import { User } from "../entity/User";
import { validate } from "class-validator";
import { UserRepository } from "../repository/UserRepository";
import { IdValidation } from "../validation/IdValidation";
import { UserDTO, UserValidation } from "../validation/UserValidation";

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
            const user = await userRepository.findOneOrFail(id, {
                select: ["id", "username", "firstName", "lastName", "email"]
            });
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
            //  hash the password, to securely store on DB
            user.hashPassword();
            
            // try to save, if fails, the username is already in use
            const userRepository = getCustomRepository(UserRepository);
            const result = await userRepository.save(user);
            return res.status(201).send(result);
        } catch (e) {
            return next(e);
        }
    };

    // update one user
    public editUser = async (req: Request, res: Response) => {
        // get the ID from the url
        const id: string = req.params.id;

        // get values from the body
        const {username, email, firstName, lastName} = req.body;

        // try to find user on db
        const userRepository = getRepository(User);
        let user;
        try {
            user = await userRepository.findOneOrFail(id, {
                select: ["id", "username", "firstName", "lastName", "email"]
            });
        } catch (error) {
            // not found
            res.status(404).send("User not found");
            return;
        }

        // validate the new values on model
        user.username = username;
        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send("username already in use");
            return;
        }

        res.status(204).send();
    };

    // delete one user
    public deleteUser = async (req: Request, res: Response) => {
        // get the ID from the url
        const id: number = +req.params.id;

        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }

        // delete
        userRepository.delete(id);

        // success
        res.status(204).send();
    };
}