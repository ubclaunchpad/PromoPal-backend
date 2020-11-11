import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { validate } from "class-validator";

class UserController {

    // return all user
    static listAll = async (req: Request, res: Response) => {
        // get users from database
        const userRepository = getRepository(User);
        const users = await userRepository.find({
            select: ["id", "username", "firstName", "lastName"]
        });

        // send the users object
        res.send(users);
    };

    // return one user
    static getOneById = async (req: Request, res: Response) => {
        // get the id from the url
        const id: string = req.params.id;
        console.log(id);

        // get user from database
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail(id, {
                select: ["id", "username", "firstName", "lastName", "email"], 
                relations: ["uploadedPromotions", "savedPromotions"]
            });
            res.send(user);
            return;
        } catch (err) {
            res.status(404).send("User not found");
            return;
        }
    };

    // create new user
    static newUser = async (req: Request, res: Response) => {
        // get parameters from the body
        let {username, password, email, firstName, lastName} = req.body;
        let user = new User(firstName, lastName, email, username, password);

        // validate the parameters
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        // hash the password, to securely store on DB
        user.hashPassword();

        // try to save, if fails, the username is already in use
        const userRepository = getRepository(User);
        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send("username already in use");
            return;
        }

        // If all ok, send 201
        res.status(201).send("User created");
    };

    // update one user
    static editUser = async (req: Request, res: Response) => {
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
    static deleteUser = async (req: Request, res: Response) => {
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

export default UserController;