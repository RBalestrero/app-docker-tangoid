import express from 'express';
import usersRoutes from './routes/users.routes.js';


const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ service: 'users-service', status: 'ok' });
});

app.use('/users', usersRoutes);


export default app;