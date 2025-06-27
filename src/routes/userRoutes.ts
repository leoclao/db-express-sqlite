import express, { RequestHandler } from 'express';
import { getAllUsers, createUser } from '../controllers/userController';

const router = express.Router();

router.get('/', getAllUsers as RequestHandler);
router.post('/', createUser as RequestHandler);

export default router;