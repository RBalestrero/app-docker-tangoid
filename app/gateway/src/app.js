import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import usersRoutes from "./routes/users.routes.js";
import returnsRoutes from "./routes/returns.routes.js";
import requestLogger from "./middlewares/requestLogger.js";
import logger from "./utils/logger.js";

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(requestLogger);

let count = 0;
app.use((req, res, next) => {

  if (req.path === "/health") return next();

  const isHealthCheck =
    req.url === "/health" &&
    req.headers["user-agent"]?.includes("Wget");

  if (isHealthCheck) {
    return next();
  }

  count++;
  req.log.info({
    origin: req.headers.origin,
    body: req.body,
    contentType: req.headers["content-type"],
    requestCount: count,
  });

  next();
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "gateway" });
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