import express, { Application } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { DatabaseManager } from "./utils/DatabaseManager";
import { apiRoutes } from "./routes";
import { errorHandler, notFoundHandler, apiRateLimiter } from "./middleware";
import { requestLogger, logger } from "./utils/logger";

dotenv.config();

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(apiRateLimiter);

// Request logging
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint (trước khi database khởi tạo)
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || "1.0.0",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to DB Express SQLite API",
    version: "1.0.0",
    docs: "/api/v1/docs",
    health: "/health",
    endpoints: {
      api: "/api/v1",
      health: "/health",
    },
  });
});

// API routes
app.use("/api/v1", apiRoutes);

// 404 handler
app.use("*", notFoundHandler);

// Global error handler
// app.use(globalErrorHandler);
app.use(errorHandler);

// Database và Server startup function
async function startServer() {
  try {
    logger.info("Starting application...");
    
    // 1. Khởi tạo database
    await DatabaseManager.initialize();
    logger.info("Database initialized successfully");
    
    // 2. Chạy migrations nếu cần
    await DatabaseManager.runMigrations();
    logger.info("Database migrations completed");
    
    // 3. Backup database nếu được cấu hình
    if (config.database.backup.enabled) {
      await DatabaseManager.scheduleBackup();
      logger.info("Database backup scheduled");
    }
    
    // 4. Vacuum database nếu cần (chỉ chạy khi cần thiết)
    if (await DatabaseManager.needsVacuum()) {
      await DatabaseManager.vacuum();
      logger.info("Database vacuum completed");
    }
    
    // 5. Start server
    const PORT = config.port;
    const server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${config.nodeEnv}`);
      logger.info(`Database: ${config.database.database}`);
    });
    
    // 6. Graceful shutdown handlers
    setupGracefulShutdown(server);
    
    return server;
    
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown setup
function setupGracefulShutdown(server: any) {
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully...`);
    
    try {
      // 1. Stop accepting new connections
      server.close(async () => {
        logger.info("HTTP server closed");
        
        try {
          // 2. Close database connections
          await DatabaseManager.close();
          logger.info("Database connections closed");
          
          // 3. Exit process
          process.exit(0);
        } catch (error) {
          logger.error("Error during shutdown:", error);
          process.exit(1);
        }
      });
      
      // 4. Force shutdown after timeout
      setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10000); // 10 seconds timeout
      
    } catch (error) {
      logger.error("Error during graceful shutdown:", error);
      process.exit(1);
    }
  };
  
  // Handle signals
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
  
  // Handle uncaught exceptions
  process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception:", error);
    shutdown("UNCAUGHT_EXCEPTION");
  });
  
  process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at:", promise, "reason:", reason);
    shutdown("UNHANDLED_REJECTION");
  });
}

// Start the server
if (require.main === module) {
  startServer();
}

export default app;
export { startServer };
