/**
 * Express router for category-related API endpoints (v1).
 *
 * @module routes/v1/categoryRoutes
 *
 * @remarks
 * This router handles HTTP requests for category resources, including:
 * - Retrieving all categories (`GET /`)
 * - Creating a new category (`POST /`)
 *
 * The actual logic for handling these requests is delegated to the
 * corresponding controller functions: `getAllCategories` and `createCategory`.
 *
 * @see getAllCategories
 * @see createCategory
 */

import express from 'express';
import { authMiddleware } from "../../middlewares/authMiddleware";
import { getAllCategories, createCategory } from '../../controllers/categoryController';

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /v1/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Category created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', authMiddleware, createCategory);

export default router;