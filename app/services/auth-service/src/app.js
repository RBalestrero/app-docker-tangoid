import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ service: 'auth-service', status: 'ok' });
});

app.get('/auth/test', (req, res) => {
  res.json({
    message: 'Auth service operativo'
  });
});

export default app;