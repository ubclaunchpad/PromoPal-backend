import { Router } from 'express';
import { UserController } from '../controller/UserController';
import {
  isAuthorizedForNewUser,
  isAuthorizedForProtection,
} from '../middleware/Authentication';

export class UserRouter {
  private userRouter = Router();
  private userController;

  constructor(usercontroller: UserController) {
    this.userController = usercontroller;
  }

  getRoutes(): Router {
    // profile endpoint
    this.userRouter.get(
      '/',
      isAuthorizedForProtection,
      this.userController.listAll
    );
    this.userRouter.get(
      '/:id',
      isAuthorizedForProtection,
      this.userController.getOneById
    );
    this.userRouter.post(
      '/',
      isAuthorizedForNewUser,
      this.userController.newUser
    );
    this.userRouter.patch(
      '/:id',
      isAuthorizedForProtection,
      this.userController.editUser
    );
    this.userRouter.delete(
      '/:id',
      isAuthorizedForProtection,
      this.userController.deleteUser
    );
    // saved promotion endpoint
    this.userRouter.get(
      '/:id/savedPromotions/',
      isAuthorizedForProtection,
      this.userController.getSaved
    );
    this.userRouter.post(
      '/:id/savedPromotions/:pid',
      isAuthorizedForProtection,
      this.userController.newSaved
    );
    this.userRouter.delete(
      '/:id/savedPromotions/:pid',
      isAuthorizedForProtection,
      this.userController.deleteSaved
    );
    // uploaded promotion endpoint
    this.userRouter.get(
      '/:id/uploadedPromotions/',
      isAuthorizedForProtection,
      this.userController.getUploaded
    );

    return this.userRouter;
  }
}
