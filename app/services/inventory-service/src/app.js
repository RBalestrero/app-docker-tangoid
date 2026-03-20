import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ service: 'inventory-service', status: 'ok' });
});

app.get('/inventory/test', (req, res) => {
  res.json({
    message: 'Inventory service operativo'
  });
});

export default app;