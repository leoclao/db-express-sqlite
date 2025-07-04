import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface RequestWithTiming extends Request {
  startTime?: number;
}

export const performanceMiddleware = (
  req: RequestWithTiming,
  res: Response,
  next: NextFunction
) => {
  req.startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - req.startTime!;
    const { method, url, ip } = req;
    const { statusCode } = res;

    logger.info('Request completed', {
      method,
      url,
      statusCode,
      duration,
      ip,
      userAgent: req.get('User-Agent')
    });

    // Log slow requests
    if (duration > 1000) {
      logger.warn('Slow request detected', {
        method,
        url,
        duration,
        statusCode
      });
    }
  });

  next();
};