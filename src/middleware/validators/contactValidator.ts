// import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
// import { CustomError } from '../errorHandler';

// export const validateCreateContact = [
//   body('name')
//     .notEmpty()
//     .withMessage('Name is required')
//     .isLength({ min: 2, max: 100 })
//     .withMessage('Name must be between 2 and 100 characters')
//     .trim(),
  
//   body('email')
//     .isEmail()
//     .withMessage('Please provide a valid email')
//     .normalizeEmail(),
  
//   body('subject')
//     .notEmpty()
//     .withMessage('Subject is required')
//     .isLength({ min: 5, max: 200 })
//     .withMessage('Subject must be between 5 and 200 characters')
//     .trim(),
  
//   body('message')
//     .notEmpty()
//     .withMessage('Message is required')
//     .isLength({ min: 10, max: 1000 })
//     .withMessage('Message must be between 10 and 1000 characters'),

//   (req: Request, res: Response, next: NextFunction) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       const errorMessage = errors.array().map(error => error.msg).join(', ');
//       return next(new CustomError(errorMessage, 400));
//     }
//     next();
//   }
// ];
export const validateContact = [
  body('name')
    .isString()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('message')
    .isString()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
];