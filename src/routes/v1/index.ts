import { Router } from 'express';
import userRoutes from './userRoutes';
import postRoutes from './postRoutes';
import categoryRoutes from './categoryRoutes';
import contactRoutes from './contactRoutes';

const router = Router();

// API v1 routes
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/categories', categoryRoutes);
router.use('/contacts', contactRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running smoothly',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
