import Router from 'express';
import controller from '../controllers/users.controller.js';
import { verifyToken } from '../middlewares/auth.middlewares.js';

const router = Router();

router.get('/', verifyToken, controller.getUsers);
router.get('/:id', verifyToken, controller.getUserById);
router.post('/', verifyToken, controller.createUser);
router.put('/:id', verifyToken, controller.updateUser);
router.delete('/:id', verifyToken, controller.deleteUser);

export default router;
