import Router from 'express';
import controller from '../controllers/users.controller.js';

const router = Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

export default router;