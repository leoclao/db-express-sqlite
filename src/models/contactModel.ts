import { getDb } from '../config/database';
import { Contact } from '../types';

export const createContact = async (contact: Contact) => {
  const { name, email, message, createdAt } = contact;
  const db = getDb();
  const result = await db.run(
    'INSERT INTO contacts (name, email, message, createdAt) VALUES (?, ?, ?, ?)',
    [name, email, message, createdAt]
  );
  return result.lastID;
};