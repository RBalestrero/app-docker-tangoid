import express from 'express';
import usersRoutes from './routes/users.routes.js';


const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "users-service" });
});

app.use('/users', usersRoutes);


export default app;