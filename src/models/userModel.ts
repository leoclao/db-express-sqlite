import { getDb } from '../config/database';
import { User } from '../types';

export const createUser = async (user: User) => {
  const { name, username, email, address, phone, website, company } = user;
  const db = getDb();
  const result = await db.run(
    'INSERT INTO users (name, username, email, address, phone, website, company) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      name,
      username || null,
      email,
      address ? JSON.stringify(address) : null,
      phone || null,
      website || null,
      company ? JSON.stringify(company) : null,
    ]
  );
  return result.lastID;
};

export const getUsers = async () => {
  const db = getDb();
  const users = await db.all('SELECT * FROM users');
  return users.map(user => ({
    ...user,
    address: user.address ? JSON.parse(user.address) : null,
    company: user.company ? JSON.parse(user.company) : null,
  }));
};

export const getUserById = async (id: number) => {
  const db = getDb();
  return await db.get('SELECT id FROM users WHERE id = ?', [id]);
};