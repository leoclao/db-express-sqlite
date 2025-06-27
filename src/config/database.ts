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

    // Tạo bảng users (giữ nguyên)
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

    // Tạo bảng posts (cập nhật với các trường mới)
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
        FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE RESTRICT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE RESTRICT
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

export const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};