import { Router } from 'express';
import { getAuthTest } from '../services/authProxy.service.js';

const router = Router();

router.get('/test', async (req, res) => {
  try {
    const data = await getAuthTest();
    res.json({
      gateway: 'ok',
      upstream: data
    });
  } catch (error) {
    res.status(500).json({
      error: 'No se pudo consultar auth-service',
      detail: error.message
    });
  }
});

export default router;