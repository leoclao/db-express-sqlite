import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import dotenv from 'dotenv';

dotenv.config();

let db: Database;

export const initDatabase = async () => {
  try {
    db = await open({
      filename: process.env.DATABASE_PATH || './database.sqlite',
      driver: sqlite3.Database,
    });

    // Tạo bảng users
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        username TEXT,
        email TEXT NOT NULL UNIQUE,
        address TEXT,
        phone TEXT,
        website TEXT,
        company TEXT
      )
    `);

    // Tạo bảng categories
    await db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      )
    `);

    // Tạo bảng contacts
    await db.exec(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        createdAt TEXT NOT NULL
      )
    `);

    // Kiểm tra schema bảng posts
    const tableInfo = await db.all('PRAGMA table_info(posts)');
    const hasTypeColumn = tableInfo.some((column: any) => column.name === 'type');

    if (!hasTypeColumn) {
      // Tạo bảng tạm với cột type
      await db.exec(`
        CREATE TABLE posts_temp (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          slug TEXT NOT NULL UNIQUE,
          title TEXT NOT NULL,
          categoryId INTEGER NOT NULL,
          excerpt TEXT NOT NULL,
          content TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          userId INTEGER NOT NULL,
          type TEXT NOT NULL CHECK(type IN ('about', 'blog', 'event', 'service')),
          FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE RESTRICT,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE RESTRICT
        )
      `);

      // Di chuyển dữ liệu, mặc định type = 'blog' cho dữ liệu cũ
      await db.exec(`
        INSERT INTO posts_temp (id, slug, title, categoryId, excerpt, content, createdAt, userId, type)
        SELECT id, slug, title, categoryId, excerpt, content, createdAt, userId, 'blog'
        FROM posts
      `);

      // Xóa bảng cũ và đổi tên
      await db.exec('DROP TABLE posts');
      await db.exec('ALTER TABLE posts_temp RENAME TO posts');
    } else {
      // Nếu bảng posts chưa tồn tại, tạo mới
      await db.exec(`
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          slug TEXT NOT NULL UNIQUE,
          title TEXT NOT NULL,
          categoryId INTEGER NOT NULL,
          excerpt TEXT NOT NULL,
          content TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          userId INTEGER NOT NULL,
          type TEXT NOT NULL CHECK(type IN ('about', 'blog', 'event', 'service')),
          FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE RESTRICT,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE RESTRICT
        )
      `);
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

export const resetPosts = async () => {
  try {
    const db = getDb();
    await db.exec('DELETE FROM posts');
    console.log('Posts table reset successfully');
  } catch (error) {
    console.error('Failed to reset posts table:', error);
    throw error;
  }
};

export const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};