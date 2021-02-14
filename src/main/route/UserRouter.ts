import { Router } from 'express';
import { UserController } from '../controller/UserController';
import { isAuthorized } from '../middleware/Authentication';

export class UserRouter {
  private userRouter = Router();
  private userController;

  constructor(usercontroller: UserController) {
    this.userController = usercontroller;
  }

  getRoutes(): Router {
    // profile endpoint
    this.userRouter.get('/', isAuthorized, this.userController.listAll);
    this.userRouter.get('/:id', isAuthorized, this.userController.getOneById);
    this.userRouter.post('/', isAuthorized, this.userController.newUser);
    this.userRouter.patch('/:id', isAuthorized, this.userController.editUser);
    this.userRouter.delete(
      '/:id',
      isAuthorized,
      this.userController.deleteUser
    );
    // saved promotion endpoint
    this.userRouter.get(
      '/:id/savedPromotions/',
      isAuthorized,
      this.userController.getSaved
    );
    this.userRouter.post(
      '/:id/savedPromotions/:pid',
      isAuthorized,
      this.userController.newSaved
    );
    this.userRouter.delete(
      '/:id/savedPromotions/:pid',
      isAuthorized,
      this.userController.deleteSaved
    );
    // uploaded promotion endpoint
    this.userRouter.get(
      '/:id/uploadedPromotions/',
      isAuthorized,
      this.userController.getUploaded
    );

    return this.userRouter;
  }
}
