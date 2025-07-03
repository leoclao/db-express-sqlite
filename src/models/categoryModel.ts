import { AppDataSource } from '../config/ormconfig';
import { CategoryEntity } from '../entities/CategoryEntity';
import { InterfaceCategory } from '../types';

export const createCategory = async (category: InterfaceCategory) => {
  const repo = AppDataSource.getRepository(CategoryEntity);
  const newCategory = repo.create(category);
  const result = await repo.save(newCategory);
  return result;
};

export const getCategories = async () => {
  const repo = AppDataSource.getRepository(CategoryEntity);
  return await repo.find();
};

export const getCategoryById = async (id: number) => {
  const repo = AppDataSource.getRepository(CategoryEntity);
  return await repo.findOneBy({ id });
};