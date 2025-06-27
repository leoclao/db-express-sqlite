import { Request, Response } from 'express';
import { createUser as createUserModel, getUsers } from '../models/userModel';
import { User } from '../types';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const user: User = req.body;
  try {
    if (!user.name || !user.email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const userId = await createUserModel(user);
    res.status(201).json({ message: 'User created', userId });
  } catch (error: any) {
    if (error.message.includes('SQLITE_CONSTRAINT: UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};