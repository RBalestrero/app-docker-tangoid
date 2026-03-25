import { Router } from 'express';
import { testController, loginController, testTokenController } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middlewares.js';

const router = Router();

router.get('/test', testController);
router.get('/login', loginController);
router.get('/verify', verifyToken, testTokenController);


export default router;