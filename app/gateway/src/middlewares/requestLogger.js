import pinoHttp from "pino-http";
import logger from "../utils/logger.js";
import crypto from "crypto";

const requestLogger = pinoHttp({
  logger,
  genReqId: (req) => req.headers["x-request-id"] || crypto.randomUUID(),
  customLogLevel: (req, res, err) => {
    if (err || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.originalUrl} completed`;
  },
  customErrorMessage: (req, res, err) => {
    return `${req.method} ${req.originalUrl} failed: ${err.message}`;
  },
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      params: req.params,
      query: req.query,
      body: req.body,
      headers: req.headers,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

export default requestLogger;