import Router from 'express';
import { getOrdersHealthController } from '../controllers/orders.controller.js';
import controller from '../controllers/orders.controller.js';
const router = Router();

router.get('/health', getOrdersHealthController);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
