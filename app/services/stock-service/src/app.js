import express from 'express';

const app = express();

app.get('/health', (req, res) => {
  res.json({ service: 'stock-service', status: 'ok' });
});

export default app;