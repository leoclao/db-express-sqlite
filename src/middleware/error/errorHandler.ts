import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/responseFormatter';
import { logger } from '../utils/logger';
import { AppError } from './customErrors';

export interface ErrorWithCode extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string | number;
  keyPattern?: Record<string, any>;
  keyValue?: Record<string, any>;
  errors?: Record<string, any>;
}

export const errorHandler = (
  err: ErrorWithCode,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code;

  // Handle different error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    code = 'VALIDATION_ERROR';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
    code = 'INVALID_ID';
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value';
    code = 'DUPLICATE_FIELD';
    
    // Extract field name from MongoDB duplicate key error
    if (err.keyPattern) {
      const field = Object.keys(err.keyPattern)[0];
      message = `${field} already exists`;
    }
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    code = 'INVALID_TOKEN';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    code = 'TOKEN_EXPIRED';
  } else if (err.name === 'MulterError') {
    statusCode = 400;
    message = 'File upload error';
    code = 'UPLOAD_ERROR';
  }

  // Log error with context
  const errorContext = {
    error: err.message,
    statusCode,
    code,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: (req as any).user?.id,
    body: req.body,
    params: req.params,
    query: req.query
  };

  if (statusCode >= 500) {
    logger.error('Server Error', errorContext, err);
  } else {
    logger.warn('Client Error', errorContext);
  }

  // Send error response
  sendError(res, {
    message,
    code,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    }),
  }, statusCode);
};