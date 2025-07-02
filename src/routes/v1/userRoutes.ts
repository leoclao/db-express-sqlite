/**
 * Express router for user-related API endpoints (version 1).
 *
 * @module routes/v1/userRoutes
 *
 * @remarks
 * This router handles HTTP requests for user resources, including retrieving all users and creating a new user.
 *
 * @see {@link ../../controllers/userController} for controller logic.
 * @see {@link ../../middlewares/validation} for request validation middleware.
 *
 * @example
 * // Register the router in your Express app:
 * import userRoutes from './routes/v1/userRoutes';
 * app.use('/api/v1/users', userRoutes);
 *
 * @route GET / - Retrieve all users.
 * @route POST / - Create a new user with validation.
 */
import express, { Router, RequestHandler } from 'express';
import { body } from 'express-validator';
import { getAllUsers, createUser } from '../../controllers/userController';
import { validateRequest } from '../../middlewares/validation';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 */

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