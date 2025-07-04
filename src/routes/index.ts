import { Router } from 'express';
import { userRoutes, postRoutes, categoryRoutes, contactRoutes} from './v1';

const router = Router();

// API v1 routes
router.use('/api/v1/users', userRoutes);
router.use('/api/v1/posts', postRoutes);
router.use('/api/v1/categories', categoryRoutes);
router.use('/api/v1/contacts', contactRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export { router as apiRoutes };
