import express from 'express';
import { MetricsCollector } from '../utils/metrics';
import { cache } from '../utils/cache';
import { AppDataSource } from '../config/ormconfig';

const router = express.Router();

interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  memory: NodeJS.MemoryUsage;
  pid: number;
  database: {
    status: string;
    version: any;
    error?: string;
  };
  cache: {
    status: string;
    error?: string;
  };
}

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    pid: process.pid
  });
});

// Detailed health check
router.get('/health/detailed', async (req, res) => {
  const health: HealthStatus = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    pid: process.pid,
    database: {
      status: 'unknown',
      version: null
    },
    cache: {
      status: 'unknown'
    }
  };

  // Check database connection
  try {
    await AppDataSource.query('SELECT');
    health.database.status = 'OK';
    health.database.version = await AppDataSource.query('SELECT version()');
  } catch (error: any) {
    health.database.status = 'ERROR';
    health.database.error = error.message;
  }

  // Check cache status
  try {
    const cacheStatus = await cache.get('health_check');
    if (cacheStatus) {
      health.cache.status = 'OK';
    } else {
      await cache.set('health_check', 'OK', 60); // Set a temporary value
      health.cache.status = 'OK';
    }
  } catch (error: any) {
    health.cache.status = 'ERROR';
    health.cache.error = error.message;
  }

  res.json(health);
});

export default router;