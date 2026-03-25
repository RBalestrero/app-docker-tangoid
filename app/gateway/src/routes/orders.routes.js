import Router from 'express';
import { getOrdersTestController } from '../controllers/orders.controller.js';

const router = Router();

router.get('/test', getOrdersTestController);

export default router;
