import express, { Router } from 'express';
import { EnumController } from '../controller/EnumController';

export class EnumRouter {
  private enumRouter = express.Router();
  private enumController: EnumController;
  constructor(enumController: EnumController) {
    this.enumController = enumController;
  }

  getRoutes(): Router {
    this.enumRouter.get('/:enum', this.enumController.getEnum);
    return this.enumRouter;
  }
}
