import express, { Router } from 'express';
import { createContact } from '../controllers/contactController';

const router: Router = express.Router();

router.post('/', createContact);

export default router;