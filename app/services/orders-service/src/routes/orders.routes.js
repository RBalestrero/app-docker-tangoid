import Router from 'express';
import { getOrdersHealthController } from '../controllers/orders.controller.js';

const router = Router();

router.get('/health', getOrdersHealthController);

export default router;
