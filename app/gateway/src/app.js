import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import usersRoutes from "./routes/users.routes.js";
import returnsRoutes from "./routes/returns.routes.js";
import requestLogger from "./middlewares/requestLogger.js";
import logger from "./utils/logger.js";


const app = express();

const allowedOrigins = [
  "http://localhost",
  "http://localhost:80",
  "http://localhost:8080",
  "http://localhost:5173",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(requestLogger);
let count = 0;
app.use((req, res, next) => {
  count++;
  req.log.info({
    origin: req.headers.origin,
    body: req.body,
    contentType: req.headers["content-type"],
    requestCount: count,
  }, "Incoming request");
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/returns", returnsRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
