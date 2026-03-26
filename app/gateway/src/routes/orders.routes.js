import Router from 'express';
import controller from '../controllers/orders.controller.js';
import { verifyToken } from '../middlewares/auth.middlewares.js';
const router = Router();

router.get('/', verifyToken, controller.getOrders);
router.get('/test', verifyToken, controller.getOrdersTestController);
router.get('/:id', verifyToken, controller.getOrderById);
router.post('/', verifyToken, controller.createOrder);
router.put('/:id', verifyToken, controller.updateOrder);
router.delete('/:id', verifyToken, controller.deleteOrder);

export default router;
