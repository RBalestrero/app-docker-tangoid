import Router from 'express';
import { verifyToken } from '../middlewares/auth.middlewares.js';
import controller from '../controllers/returns.controller.js';

const router = Router();

router.get('/', verifyToken, controller.getAllReturns);
router.get('/:id', verifyToken, controller.getReturnById);
router.post('/', verifyToken, controller.createReturn);
router.put('/:id', verifyToken, controller.updateReturn);
router.delete('/:id', verifyToken, controller.deleteReturn);

export default router;