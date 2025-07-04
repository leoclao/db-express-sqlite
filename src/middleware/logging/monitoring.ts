import { Request, Response, NextFunction } from 'express';

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

    // Console log thay vì logger dependency
    console.log(`${method} ${url} - ${statusCode} - ${duration}ms - ${ip}`);

    // Log slow requests
    if (duration > 1000) {
      console.warn(`⚠️  Slow request: ${method} ${url} - ${duration}ms`);
    }

    // Log errors
    if (statusCode >= 400) {
      console.error(`❌ Error: ${method} ${url} - ${statusCode}`);
    }
  });

  next();
};