import express, { Router, RequestHandler } from 'express';
import { body } from 'express-validator';
import { getAllUsers, createUser } from '../controllers/userController';
import { validateRequest } from '../middlewares/validation';

const router: Router = express.Router();

router.get('/', getAllUsers);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('username').optional().isString().withMessage('Username must be a string'),
    body('address').optional().isString().withMessage('Address must be a string'),
    body('phone').optional().isString().withMessage('Phone must be a string'),
    body('website').optional().isURL().withMessage('Invalid website URL'),
    body('company').optional().isString().withMessage('Company must be a string'),
    validateRequest as RequestHandler,
  ],
  createUser
);

export default router;