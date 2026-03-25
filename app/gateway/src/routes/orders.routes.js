import Router from 'express';
import { getOrdersTestController, getUsersController, getOrdersController } from '../controllers/orders.controller.js';
const router = Router();

router.get('/test', getOrdersTestController);
router.get('/users', getUsersController);
router.get('/orders', getOrdersController);

export default router;
