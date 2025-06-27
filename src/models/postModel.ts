import { getDb } from '../config/database';
import { Post } from '../types';

export const createPost = async (post: Post) => {
  const { slug, title, categoryId, excerpt, content, createdAt, userId } = post;
  const db = getDb();
  const result = await db.run(
    'INSERT INTO posts (slug, title, categoryId, excerpt, content, createdAt, userId) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [slug, title, categoryId, excerpt, content, createdAt, userId]
  );
  return result.lastID;
};

export const getPosts = async () => {
  const db = getDb();
  return await db.all('SELECT * FROM posts');
};

export const deletePost = async (id: number) => {
  const db = getDb();
  const result = await db.run('DELETE FROM posts WHERE id = ?', [id]);
  return result.changes; // Số hàng bị xóa
};

export const resetPosts = async () => {
  const db = getDb();
  const result = await db.run('DELETE FROM posts');
  return result.changes;
};

export const getPostsByCategoryId = async (categoryId: number) => {
  const db = getDb();
  return await db.all('SELECT * FROM posts WHERE categoryId = ?', [categoryId]);
};

export const getLatestPosts = async (limit: number = 5) => {
  const db = getDb();
  return await db.all('SELECT * FROM posts ORDER BY createdAt DESC LIMIT ?', [limit]);
};

export const getPostsByType = async (type: string) => {
  const db = getDb();
  return await db.all('SELECT * FROM posts WHERE type = ?', [type]);
};

export const getPostByType = async (type: string) => {
  const db = getDb();
  return await db.get('SELECT * FROM posts WHERE type = ?', [type]);
};
