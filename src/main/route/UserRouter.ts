import { Router } from 'express';
import { UserController } from '../controller/UserController';
import { FirebaseAuth } from '../middleware/Authentication';

export class UserRouter {
  private userRouter = Router();
  private userController;
  private firebaseAuth: any;

  constructor(usercontroller: UserController, firebaseadmin: any) {
    this.userController = usercontroller;
    this.firebaseAuth = new FirebaseAuth(firebaseadmin);
  }

  getRoutes(): Router {
    // profile endpoint
    this.userRouter.get(
      '/',
      this.firebaseAuth.isAuthorizedForProtection,
      this.userController.listAll
    );
    this.userRouter.get(
      '/:id',
      this.firebaseAuth.isAuthorizedForProtection,
      this.userController.getOneById
    );
    this.userRouter.post(
      '/',
      this.firebaseAuth.isAuthorizedForNewUser,
      this.userController.newUser
    );
    this.userRouter.patch(
      '/:id',
      this.firebaseAuth.isAuthorizedForProtection,
      this.userController.editUser
    );
    this.userRouter.delete(
      '/:id',
      this.firebaseAuth.isAuthorizedForProtection,
      this.userController.deleteUser
    );
    // saved promotion endpoint
    this.userRouter.get(
      '/:id/savedPromotions/',
      this.firebaseAuth.isAuthorizedForProtection,
      this.userController.getSaved
    );
    this.userRouter.post(
      '/:id/savedPromotions/:pid',
      this.firebaseAuth.isAuthorizedForProtection,
      this.userController.newSaved
    );
    this.userRouter.delete(
      '/:id/savedPromotions/:pid',
      this.firebaseAuth.isAuthorizedForProtection,
      this.userController.deleteSaved
    );
    // uploaded promotion endpoint
    this.userRouter.get(
      '/:id/uploadedPromotions/',
      this.firebaseAuth.isAuthorizedForProtection,
      this.userController.getUploaded
    );

    return this.userRouter;
  }
}
