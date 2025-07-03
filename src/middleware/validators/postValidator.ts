import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { CustomError } from '../errorHandler';

export const validateCreatePost = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters')
    .trim(),
  
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long'),
  
  body('categoryId')
    .notEmpty()
    .withMessage('Category ID is required')
    .isNumeric()
    .withMessage('Category ID must be a number'),
  
  body('type')
    .optional()
    .isIn(['blog', 'news', 'announcement'])
    .withMessage('Type must be one of: blog, news, announcement'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array().map(error => error.msg).join(', ');
      return next(new CustomError(errorMessage, 400));
    }
    next();
  }
];

export const validateUpdatePost = [
  body('title')
    .optional()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters')
    .trim(),
  
  body('content')
    .optional()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long'),
  
  body('categoryId')
    .optional()
    .isNumeric()
    .withMessage('Category ID must be a number'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array().map(error => error.msg).join(', ');
      return next(new CustomError(errorMessage, 400));
    }
    next();
  }
];