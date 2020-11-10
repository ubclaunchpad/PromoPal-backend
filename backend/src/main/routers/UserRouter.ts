import { Router } from "express";
import UserController from "../controllers/UserController";
import { User } from "../entity/User";

const router = Router();

// get all users
router.get("", UserController.listAll);

// get one user
router.get(":id([0-9]+)", UserController.getOneById);

// create a new user
router.post("", UserController.newUser);

// edit one user
router.patch(":id([0-9]+)", UserController.editUser);

// delete one user
router.delete(":id([0-9]+)", UserController.deleteUser);

export default router;