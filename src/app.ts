import express, { Application } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { AppDataSource } from "./config/ormconfig";
import { apiRoutes } from "./routes";
import { globalErrorHandler, notFoundHandler, rateLimiter } from "./middleware";
import { requestLogger, logger } from "./utils/logger";

dotenv.config();

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API routes
app.use("/api/v1", apiRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to DB Express SQLite API",
    version: "1.0.0",
    docs: "/api/v1/docs",
    health: "/api/v1/health",
  });
});

// Routes
app.use(apiRoutes);

// 404 handler
app.use("*", notFoundHandler);

// Global error handler
app.use(globalErrorHandler);

// Start server
const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    logger.info("Database connected successfully");

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((error) => {
    logger.error("Database connection failed:", error);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});

export default app;
