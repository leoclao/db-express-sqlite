import { Router } from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  resetPosts,
  getPostsByCategory,
  // getLatestPosts,
  // getPostsByType,
  // getHomePosts
} from '../../controllers/postController';
import { validateCreatePost, validateUpdatePost } from '../../middleware/validators/postValidator';
import { catchAsync } from '../../middleware/error/errorHandler';

const router = Router();

// GET routes
router.get('/', catchAsync(getAllPosts));
// router.get('/latest', catchAsync(getLatestPosts));
// router.get('/home', catchAsync(getHomePosts));
router.get('/category/:categoryId', catchAsync(getPostsByCategory));
// router.get('/type/:type', catchAsync(getPostsByType));
router.get('/:id', catchAsync(getPostById));

// POST routes
router.post('/', validateCreatePost, catchAsync(createPost));
router.post('/reset', catchAsync(resetPosts)); // Admin only - add auth middleware

// PUT routes
router.put('/:id', validateUpdatePost, catchAsync(updatePost));

// DELETE routes
router.delete('/:id', catchAsync(deletePost));

export default router;