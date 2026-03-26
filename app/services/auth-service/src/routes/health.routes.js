import Router from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ service: 'auth-service', status: 'ok' });
});

export default router;
