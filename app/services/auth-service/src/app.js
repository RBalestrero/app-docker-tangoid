import express from 'express';
import cors from 'cors';
import helthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(cors());
app.use(express.json());


app.use("/health", helthRoutes);
app.use('/auth', authRoutes);


app.get('/auth/test', (req, res) => {
  res.json({
    message: 'Auth service operativo'
  });
});

export default app;