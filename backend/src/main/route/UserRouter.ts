import { Router } from "express";
import UserController from "../controller/UserController";
import UserController from "../controllers/UserController";
import { User } from "../entity/User";

export class UserRouter {
    private userRouter = Router();
    private userController = new UserController();

    constructor(usercontroller: UserController) {
        this.userController = usercontroller;
    }

    getRoutes() : Router {
        this.userRouter.get("/", this.userController.listAll);
        this.userRouter.get("/:id", this.userController.getOneById);
        this.userRouter.post("/", this.userController.newUser);
        this.userRouter.patch("/:id", this.userController.editUser);
        this.userRouter.delete("/:id", this.userController.deleteUser);

        this.userRouter.get("/:id/savedPromotions", this.userController.getSaved);
        this.userRouter.post("/:id/savedPromotions", this.userController.newSaved);
        this.userRouter.delete("/:id/savePromotions/:pid", this.userController.deleteSaved);

        return this.userRouter;
    }
}