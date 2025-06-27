import { getDb } from '../config/database';
import { Category } from '../types';

export const createCategory = async (category: Category) => {
  const { name } = category;
  const db = getDb();
  const result = await db.run('INSERT INTO categories (name) VALUES (?)', [name]);
  return result.lastID;
};

export const getCategories = async () => {
  const db = getDb();
  return await db.all('SELECT * FROM categories');
};

export const getCategoryById = async (id: number) => {
  const db = getDb();
  return await db.get('SELECT id FROM categories WHERE id = ?', [id]);
};