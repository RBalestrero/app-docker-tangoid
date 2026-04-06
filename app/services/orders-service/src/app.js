import express from 'express';
import cors from 'cors';
import ordersRoutes from './routes/orders.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "orders-service" });
});

app.use('/orders', ordersRoutes);


export default app;