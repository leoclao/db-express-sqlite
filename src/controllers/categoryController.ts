import { Request, Response, RequestHandler, NextFunction } from 'express';
import { createCategory as createCategoryModel, getCategories } from '../models/categoryModel';
import { InterfaceCategory } from '../types';

export const getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCategory: RequestHandler = async (req, res, next: NextFunction): Promise<void> => {
  const category: InterfaceCategory = req.body;
  try {
    if (!category.name) {
      res.status(400).json({ error: 'Category name is required' });
    }
    const categoryId = await createCategoryModel(category);
    res.status(201).json({ message: 'Category created', categoryId });
  } catch (error: any) {
    if (error.message.includes('SQLITE_CONSTRAINT: UNIQUE constraint failed')) {
      res.status(400).json({ error: 'Category name already exists' });
    }
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};