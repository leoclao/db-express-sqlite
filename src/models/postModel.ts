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
