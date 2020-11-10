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
            select: ["id", "username", "first_name", "last_name"]
        });

        // send the users object
        res.send(users);
    };

    // return one user
    static getOneById = async (req: Request, res: Response) => {
        // get the id from the url
        const id: number = req.params.id;

        // get user from database
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail(id, {
                select: ["id", "username", "first_name", "last_name", "uploadedPromotions", "savedPromotions"]
            });
        } catch (err) {
            res.status(404).send("User not found");
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
}