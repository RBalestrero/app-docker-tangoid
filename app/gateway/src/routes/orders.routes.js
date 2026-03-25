import Router from 'express';
import { getOrdersTestController, getOrdersController } from '../controllers/orders.controller.js';
const router = Router();

router.get('/', getOrdersController);
router.get('/test', getOrdersTestController);


export default router;
