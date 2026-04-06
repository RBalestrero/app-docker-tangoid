import logger from "../utils/logger.js";

export default function requestLogger(req, res, next) {
  if (req.path === "/health") {
    return next();
  }

  const start = Date.now();
  const requestId = req.id || crypto.randomUUID?.() || `req-${Date.now()}`;

  logger.info(
    {
      service: req.headers["x-service-name"] || "gateway",
      req: {
        id: requestId,
        method: req.method,
        url: req.originalUrl || req.url,
        params: req.params,
        query: req.query,
        headers: req.headers,
      },
      body: req.body,
    },
    "Incoming request"
  );

  res.on("finish", () => {
    logger.info(
      {
        service: req.headers["x-service-name"] || "gateway",
        req: {
          id: requestId,
          method: req.method,
          url: req.originalUrl || req.url,
          params: req.params,
          query: req.query,
          headers: req.headers,
        },
        res: {
          statusCode: res.statusCode,
        },
        responseTime: Date.now() - start,
      },
      `${req.method} ${req.originalUrl || req.url} completed`
    );
  });

  next();
}