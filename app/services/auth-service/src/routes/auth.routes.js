import Router from 'express';
import controller from '../controllers/auth.controller.js';


const router = Router();

router.get('/login', controller.loginController);

export default router;