import { Request, Response, NextFunction } from 'express';

export interface RequestWithTiming extends Request {
  startTime?: number;
}

export const performanceMonitor = (
  req: RequestWithTiming,
  res: Response,
  next: NextFunction
) => {
  req.startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - req.startTime!;
    const { method, url, ip } = req;
    const { statusCode } = res;

    // Log request completion
    console.log(`${method} ${url} - ${statusCode} - ${duration}ms - ${ip}`);

    // Log performance metrics
    const logData = {
      method,
      url,
      statusCode,
      duration,
      ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };

    // Log slow requests
    if (duration > 1000) {
      console.warn('🐌 Slow request detected:', logData);
    }

    // Log errors
    if (statusCode >= 400) {
      console.error('❌ Error response:', logData);
    }

    // Log high traffic
    if (duration > 5000) {
      console.error('🚨 Very slow request:', logData);
    }
  });

  next();
};