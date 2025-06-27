import express, { Router } from 'express';
import { getAllPosts, createPost, deletePost, resetAllPosts, getPostsByCategory, getLatestPosts, getPostsByType, getHomeData } from '../controllers/postController';

const router: Router = express.Router();

router.get('/', getAllPosts);
router.post('/', createPost);
router.delete('/:id', deletePost);
router.delete('/', resetAllPosts);
router.get('/category/:categoryId', getPostsByCategory);
router.get('/latest', getLatestPosts);
router.get('/type/:type', getPostsByType);
router.get('/home', getHomeData);

export default router;