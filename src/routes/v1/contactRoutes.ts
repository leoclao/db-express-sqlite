/**
 * Express router for contact-related endpoints (API v1).
 *
 * @module routes/v1/contactRoutes
 * @remarks
 * This router handles contact creation requests. It applies authentication middleware
 * to ensure only authorized users can create contacts.
 *
 * @see {@link ../../controllers/contactController.createContact}
 * @see {@link ../../middlewares/authMiddleware}
 */
import express, { Router } from 'express';
import { authMiddleware } from "../../middleware/auth/authMiddleware";
import { createContact } from '../../controllers/contactController';

/**
 * @swagger
 * /api/v1/contacts:
 *   post:
 *     summary: Create a new contact
 *     tags:
 *       - Contacts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       201:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */

const router: Router = express.Router();

router.post('/', authMiddleware, createContact);

export default router;