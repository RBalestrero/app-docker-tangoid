import Router from 'express';
import controller from '../controllers/returns.controller.js';

const router = Router();

router.get('/', controller.getAllReturns);
router.get('/:id', controller.getReturnById);
router.post('/', controller.createReturn);
router.put('/:id', controller.updateReturn);
router.delete('/:id', controller.deleteReturn);

export default router;
