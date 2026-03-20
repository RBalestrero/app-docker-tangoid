import express from 'express';

const app = express();

app.get('/health', (req, res) => {
  res.json({ service: 'warehouse-service', status: 'ok' });
});

export default app;