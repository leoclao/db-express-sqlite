import { body } from 'express-validator';
import { handleValidationErrors } from './common';

export const validateCategory = [
  body('name')
    .trim()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  handleValidationErrors
];