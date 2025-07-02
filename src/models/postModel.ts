import { getDb } from '../config/database';
import { Post } from '../types';

export const createPostModel = async (post: Post) => {
  const { slug, title, categoryId, excerpt, content, createdAt, userId, type } = post;
  const db = getDb();
  const result = await db.run(
    'INSERT INTO posts (slug, title, categoryId, excerpt, content, createdAt, userId, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [slug, title, categoryId, excerpt, content, createdAt, userId, type]
  );
  return result.lastID;
};

export const updatePostModel = async (id: number, post: Partial<Post>) => {
  const db = getDb();

  // Lọc ra các trường hợp lệ để update
  const fields = [
    "slug",
    "title",
    "categoryId",
    "excerpt",
    "content",
    "createdAt",
    "userId",
    "type",
  ] as const;

  const setClauses: string[] = [];
  const values: any[] = [];

  fields.forEach((field) => {
    if (post[field] !== undefined) {
      setClauses.push(`${field} = ?`);
      values.push(post[field]);
    }
  });

  if (setClauses.length === 0) {
    return 0; // Không có gì để update
  }

  values.push(id);

  const result = await db.run(
    `UPDATE posts SET ${setClauses.join(", ")} WHERE id = ?`,
    values
  );
  return result.changes; // Số hàng bị cập nhật
};

export const deletePostModel = async (id: number) => {
  const db = getDb();
  const result = await db.run('DELETE FROM posts WHERE id = ?', [id]);
  return result.changes; // Số hàng bị xóa
};

export const resetPostsModel = async () => {
  const db = getDb();
  const result = await db.run('DELETE FROM posts');
  return result.changes;
};

export const getPostsModel = async (
  limit: number = 10,
  offset: number = 0,
  sort: string = 'createdAt',
  order: string = 'DESC'
) => {
  const db = getDb();
  const allowedSortFields = [
    "id", "slug", "title", "categoryId", "excerpt", "content", "createdAt", "userId", "type"
  ];
  const sortField = allowedSortFields.includes(sort) ? sort : "createdAt";
  const sortOrder = order === "ASC" ? "ASC" : "DESC";
  return await db.all(
    `SELECT * FROM posts ORDER BY ${sortField} ${sortOrder} LIMIT ? OFFSET ?`,
    [limit, offset]
  );
};

export const getPostsByIdModel = async ( id: number ) => {
  const db = getDb();
  return await db.all('SELECT FROM posts WHERE id = ?', [id]);
};

export const getPostsByCategoryIdModel = async (categoryId: number) => {
  const db = getDb();
  return await db.all('SELECT * FROM posts WHERE categoryId = ?', [categoryId]);
};

export const getLatestPostsModel = async (limit: number = 5) => {
  const db = getDb();
  return await db.all('SELECT * FROM posts ORDER BY createdAt DESC LIMIT ?', [limit]);
};

export const getPostsByTypeModel = async (type: string) => {
  const db = getDb();
  return await db.all('SELECT * FROM posts WHERE type = ?', [type]);
};
