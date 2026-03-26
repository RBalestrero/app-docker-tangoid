import Router from 'express';
import controller from '../controllers/orders.controller.js';
const router = Router();

router.get('/', controller.getOrders);
router.get('/test', controller.getOrdersTestController);
router.get('/:id', controller.getOrderById);
router.post('/', controller.createOrder);
router.put('/:id', controller.updateOrder);
router.delete('/:id', controller.deleteOrder);


export default router;
