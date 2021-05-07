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
    this.userRouter
      .route('/')
      .get(
        this.firebaseAuthMiddleware.isAuthorizedForProtection,
        this.userController.listAll
      )
      // unauthorized because we are creating a user in firebase in this controller
      .post(this.userController.newUser);

    this.userRouter
      .route('/:id')
      .all(this.firebaseAuthMiddleware.isAuthorizedForProtection)
      .get(this.userController.getOneById)
      .patch(this.userController.editUser)
      .delete(this.userController.deleteUser);

    this.userRouter.get(
      '/:id/savedPromotions/',
      this.firebaseAuthMiddleware.isAuthorizedForProtection,
      this.userController.getSaved
    );

    this.userRouter
      .route('/:id/savedPromotions/:pid')
      .all(this.firebaseAuthMiddleware.isAuthorizedForProtection)
      .post(this.userController.newSaved)
      .delete(this.userController.deleteSaved);

    this.userRouter.get(
      '/:id/uploadedPromotions/',
      this.firebaseAuthMiddleware.isAuthorizedForProtection,
      this.userController.getUploaded
    );

    return this.userRouter;
  }
}
