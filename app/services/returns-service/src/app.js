import express from 'express';
import returnsRoutes from './routes/returns.routes.js';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ service: 'returns-service', status: 'ok' });
});

app.use('/returns', returnsRoutes);

export default app;