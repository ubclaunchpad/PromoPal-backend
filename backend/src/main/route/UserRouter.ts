import { Router } from "express";
import { UserController } from "../controller/UserController";

export class UserRouter {
    private userRouter = Router();
    private userController;

    constructor(usercontroller: UserController) {
        this.userController = usercontroller;
    }

    getRoutes() : Router {
        this.userRouter.get("/", this.userController.listAll);
        this.userRouter.get("/:id", this.userController.getOneById);
        this.userRouter.post("/", this.userController.newUser);
        this.userRouter.patch("/:id", this.userController.editUser);
        this.userRouter.delete("/:id", this.userController.deleteUser);

        this.userRouter.get("/:id/savedPromotions/", this.userController.getSaved);
        this.userRouter.post("/:id/savedPromotions/:pid", this.userController.newSaved);
        this.userRouter.delete("/:id/savePromotions/:pid", this.userController.deleteSaved);

        return this.userRouter;
    }
}