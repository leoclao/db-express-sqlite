import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { sendError } from '../utils/responseFormatter';
import { logger } from '../utils/logger';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value,
      location: error.location
    }));
    
    logger.warn('Validation Error', {
      url: req.url,
      method: req.method,
      errors: formattedErrors,
      body: req.body
    });
    
    sendError(res, {
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: formattedErrors
    }, 400);
    return;
  }
  
  next();
};

// Utility to validate required fields
export const validateRequired = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields = fields.filter(field => {
      const value = req.body[field];
      return value === undefined || value === null || value === '';
    });
    
    if (missingFields.length > 0) {
      logger.warn('Missing Required Fields', {
        url: req.url,
        method: req.method,
        missingFields,
        body: req.body
      });
      
      sendError(res, {
        message: 'Missing required fields',
        code: 'MISSING_REQUIRED_FIELDS',
        missingFields
      }, 400);
      return;
    }
    
    next();
  };
};
