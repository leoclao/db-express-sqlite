import { body, validationResult } from 'express-validator';

export const validatePost = [
  body('title')
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  body('content')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Content is required'),
  body('categoryId')
    .isInt({ min: 1 })
    .withMessage('Category ID must be a valid integer'),
];