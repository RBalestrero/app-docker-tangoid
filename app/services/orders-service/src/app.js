import express from 'express';
import cors from 'cors';
import ordersRoutes from './routes/orders.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ service: 'orders-service', status: 'ok' });
});

app.use('/orders', ordersRoutes);


export default app;