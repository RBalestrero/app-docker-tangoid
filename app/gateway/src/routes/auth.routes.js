import { Router } from 'express';
import controller from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middlewares.js';

const router = Router();

router.get('/test', controller.testController);
router.get('/token', controller.getAuthToken);
router.get('/verify', verifyToken, controller.testTokenController);

export default router;