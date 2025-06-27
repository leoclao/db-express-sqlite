import { Request, Response, NextFunction, RequestHandler } from 'express';
import { createPost as createPostModel, getPosts, deletePost as deletePostModel } from '../models/postModel';
import { getCategoryById } from '../models/categoryModel';
import { getUserById } from '../models/userModel';
import { Post } from '../types';

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await getPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
};

export const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const post: Post = req.body;
  try {
    if (!post.slug || !post.title || !post.categoryId || !post.excerpt || !post.content || !post.createdAt || !post.userId) {
      res.status(400).json({ error: 'slug, title, categoryId, excerpt, content, createdAt, and userId are required' });
      return;
    }
    const category = await getCategoryById(post.categoryId);
    if (!category) {
      res.status(400).json({ error: 'Category not found' });
      return;
    }
    const user = await getUserById(Number(post.userId));
    if (!user) {
      res.status(400).json({ error: 'User not found' });
      return;
    }
    const postId = await createPostModel(post);
    res.status(201).json({ message: 'Post created', postId });
  } catch (error: any) {
    if (error.message.includes('SQLITE_CONSTRAINT: UNIQUE constraint failed')) {
      res.status(400).json({ error: 'Slug already exists' });
      return;
    }
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

export const deletePost = async (req: Request, res: Response, next?: NextFunction): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  try {
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid post ID' });
      return;
    }
    const changes = await deletePostModel(id);
    if (changes === 0) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
};
