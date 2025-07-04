// import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
// import { CustomError } from '../errorHandler';

// export const validateCreateCategory = [
//   body('name')
//     .notEmpty()
//     .withMessage('Category name is required')
//     .isLength({ min: 2, max: 50 })
//     .withMessage('Category name must be between 2 and 50 characters')
//     .trim(),
  
//   body('description')
//     .optional()
//     .isLength({ max: 500 })
//     .withMessage('Description must not exceed 500 characters'),

//   (req: Request, res: Response, next: NextFunction) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       const errorMessage = errors.array().map(error => error.msg).join(', ');
//       return next(new CustomError(errorMessage, 400));
//     }
//     next();
//   }
// ];

export const validateCategory = [
  body('name')
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category name must be between 1 and 100 characters'),
];
