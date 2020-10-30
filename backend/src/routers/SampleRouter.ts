import express, { Router } from 'express';
import SampleController from '../controllers/SampleController';

const router = Router();
const sampleController = new SampleController();

router.get('', sampleController.get);

export default router;