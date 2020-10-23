import express, { Router } from 'express';
import TodosController from '../controllers/TodosController';

const router = Router();
const todosController = new TodosController();

router.get('/list', todosController.get);
router.get('/', todosController.getById);

export default router;