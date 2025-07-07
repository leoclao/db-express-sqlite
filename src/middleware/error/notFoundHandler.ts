import { Request, Response } from 'express';
import { sendError } from '../utils/responseFormatter';
import { logger } from '../utils/logger';

export const notFoundHandler = (req: Request, res: Response) => {
  const message = `Route ${req.method} ${req.originalUrl} not found`;
  
  logger.warn('Route Not Found', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  sendError(res, {
    message,
    code: 'ROUTE_NOT_FOUND',
    availableRoutes: process.env.NODE_ENV === 'development' ? [
      'GET /api/health',
      'POST /api/auth/login',
      'GET /api/users',
      // Add your routes here for development
    ] : undefined
  }, 404);
};