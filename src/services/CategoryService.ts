import { Repository } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { CategoryEntity } from '../entities';
import { InterfaceCategory } from '../types';

export class CategoryService {
  private categoryRepository: Repository<CategoryEntity>;

  constructor() {
    this.categoryRepository = AppDataSource.getRepository(CategoryEntity);
  }

  async createCategory(categoryData: Partial<InterfaceCategory>): Promise<CategoryEntity> {
    const category = this.categoryRepository.create(categoryData);
    return await this.categoryRepository.save(category);
  }

  async getAllCategories(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({
      order: { name: 'ASC' }
    });
  }

  async getCategoryById(id: number): Promise<CategoryEntity | null> {
    return await this.categoryRepository.findOne({
      where: { id },
      relations: ['posts']
    });
  }

  async updateCategory(id: number, updateData: Partial<InterfaceCategory>): Promise<CategoryEntity | null> {
    await this.categoryRepository.update(id, updateData);
    return await this.getCategoryById(id);
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await this.categoryRepository.delete(id);
    return result.affected !== 0;
  }
}