"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
class UserRouter {
    constructor(userController, firebaseAuthMiddleware) {
        this.userRouter = express_1.Router();
        this.userController = userController;
        this.firebaseAuthMiddleware = firebaseAuthMiddleware;
    }
    getRoutes() {
        this.userRouter.get('/', this.firebaseAuthMiddleware.isAuthorizedForProtection, this.userController.listAll);
        this.userRouter.get('/:id', this.firebaseAuthMiddleware.isAuthorizedForProtection, this.userController.getOneById);
        this.userRouter.get('/firebase/:firebaseId', this.firebaseAuthMiddleware.isAuthorizedForProtection, this.userController.getOneByFirebaseId);
        this.userRouter.post('/', this.firebaseAuthMiddleware.isAuthorizedForProtection, this.userController.newUser);
        this.userRouter.patch('/:id', this.firebaseAuthMiddleware.isAuthorizedForProtection, this.userController.editUser);
        this.userRouter.delete('/:id', this.firebaseAuthMiddleware.isAuthorizedForProtection, this.userController.deleteUser);
        this.userRouter.get('/:id/savedPromotions/', this.firebaseAuthMiddleware.isAuthorizedForProtection, this.userController.getSaved);
        this.userRouter.post('/:id/savedPromotions/:pid', this.firebaseAuthMiddleware.isAuthorizedForProtection, this.userController.newSaved);
        this.userRouter.delete('/:id/savedPromotions/:pid', this.firebaseAuthMiddleware.isAuthorizedForProtection, this.userController.deleteSaved);
        this.userRouter.get('/:id/uploadedPromotions/', this.firebaseAuthMiddleware.isAuthorizedForProtection, this.userController.getUploaded);
        return this.userRouter;
    }
}
exports.UserRouter = UserRouter;
//# sourceMappingURL=UserRouter.js.map