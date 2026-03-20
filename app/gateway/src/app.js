import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ service: 'gateway', status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/inventory', inventoryRoutes);

export default app;