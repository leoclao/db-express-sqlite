import { Request, Response } from 'express';
import { createPost, getPosts, deletePost, resetPosts, getPostsByCategoryId, getLatestPosts, getPostsByType, getPostByType } from '../models/postModel';
import { getCategoryById } from '../models/categoryModel';
import { getUserById } from '../models/userModel';
import { getCategories } from '../models/categoryModel';
import { Post } from '../types';

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await getPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
};

export const createPost = async (req: Request, res: Response) => {
  const post: Post = req.body;
  try {
    if (!post.slug || !post.title || !post.categoryId || !post.excerpt || !post.content || !post.createdAt || !post.userId || !post.type) {
      return res.status(400).json({ error: 'slug, title, categoryId, excerpt, content, createdAt, userId, and type are required' });
    }
    if (!['about', 'blog', 'event', 'service'].includes(post.type)) {
      return res.status(400).json({ error: 'Invalid type, must be about, blog, event, or service' });
    }
    const category = await getCategoryById(post.categoryId);
    if (!category) {
      return res.status(400).json({ error: 'Category not found' });
    }
    const user = await getUserById(post.userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    const postId = await createPost(post);
    res.status(201).json({ message: 'Post created', postId });
  } catch (error: any) {
    if (error.message.includes('SQLITE_CONSTRAINT: UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    const changes = await deletePost(id);
    if (changes === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
};

export const resetAllPosts = async (req: Request, res: Response) => {
  try {
    await resetPosts();
    res.json({ message: 'All posts reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
};

export const getPostsByCategory = async (req: Request, res: Response) => {
  const categoryId = parseInt(req.params.categoryId, 10);
  try {
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }
    const category = await getCategoryById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    const posts = await getPostsByCategoryId(categoryId);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
};

export const getLatestPosts = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 5;
    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({ error: 'Invalid limit parameter' });
    }
    const posts = await getLatestPosts(limit);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
};

export const getPostsByType = async (req: Request, res: Response) => {
  const { type } = req.params;
  try {
    if (!['about', 'blog', 'event', 'service'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type, must be about, blog, event, or service' });
    }
    const posts = await getPostsByType(type);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
};

export const getHomeData = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 5;
    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({ error: 'Invalid limit parameter' });
    }
    const latestBlogs = await getPostsByType('blog');
    const latestEvents = await getPostsByType('event');
    const categories = await getCategories();
    res.json({
      latestBlogs: latestBlogs.slice(0, limit),
      latestEvents: latestEvents.slice(0, limit),
      categories,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
};