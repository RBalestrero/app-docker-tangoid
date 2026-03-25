import express from 'express';
import cors from 'cors';
import ordersRouter from './routes/orders.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/orders', ordersRouter);

app.get('/health', (req, res) => {
  res.json({ service: 'orders-service', status: 'ok' });
});

app.get('/orders/test', (req, res) => {
  res.json({
    message: 'Orders service operativo'
  });
});

export default app;