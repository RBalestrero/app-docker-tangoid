import express from 'express';
import returnsRoutes from './routes/returns.routes.js';

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "returns-service" });
});

app.use('/returns', returnsRoutes);

export default app;