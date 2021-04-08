import { Router } from 'express';
import { UserController } from '../controller/UserController';
import { FirebaseAuthMiddleware } from '../middleware/FirebaseAuthMiddleware';

export class UserRouter {
  private userRouter = Router();
  private userController;
  private firebaseAuthMiddleware: FirebaseAuthMiddleware;

  constructor(
    userController: UserController,
    firebaseAuthMiddleware: FirebaseAuthMiddleware
  ) {
    this.userController = userController;
    this.firebaseAuthMiddleware = firebaseAuthMiddleware;
  }

  getRoutes(): Router {
    // profile endpoint
    this.userRouter.get(
      '/',
      this.firebaseAuthMiddleware.isAuthorizedForProtection,
      this.userController.listAll
    );
    this.userRouter.get(
      '/:id',
      this.firebaseAuthMiddleware.isAuthorizedForProtection,
      this.userController.getOneById
    );
    // unauthorized because we are creating a user in firebase in this controller
    this.userRouter.post('/', this.userController.newUser);
    this.userRouter.patch(
      '/:id',
      this.firebaseAuthMiddleware.isAuthorizedForProtection,
      this.userController.editUser
    );
    this.userRouter.delete(
      '/:id',
      this.firebaseAuthMiddleware.isAuthorizedForProtection,
      this.userController.deleteUser
    );
    // saved promotion endpoint
    this.userRouter.get(
      '/:id/savedPromotions/',
      this.firebaseAuthMiddleware.isAuthorizedForProtection,
      this.userController.getSaved
    );
    this.userRouter.post(
      '/:id/savedPromotions/:pid',
      this.firebaseAuthMiddleware.isAuthorizedForProtection,
      this.userController.newSaved
    );
    this.userRouter.delete(
      '/:id/savedPromotions/:pid',
      this.firebaseAuthMiddleware.isAuthorizedForProtection,
      this.userController.deleteSaved
    );
    // uploaded promotion endpoint
    this.userRouter.get(
      '/:id/uploadedPromotions/',
      this.firebaseAuthMiddleware.isAuthorizedForProtection,
      this.userController.getUploaded
    );

    return this.userRouter;
  }
}
