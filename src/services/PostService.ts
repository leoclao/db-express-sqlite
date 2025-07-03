import { Repository } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { PostEntity } from '../entities/PostEntity';
import { InterfacePost } from '../types';

export class PostService {
  private postRepository: Repository<PostEntity>;

  constructor() {
    this.postRepository = AppDataSource.getRepository(PostEntity);
  }

  async createPost(postData: Partial<InterfacePost>): Promise<PostEntity> {
    const post = this.postRepository.create(postData);
    return await this.postRepository.save(post);
  }

  async getAllPosts(page: number = 1, limit: number = 10): Promise<{
    posts: PostEntity[];
    total: number;
    page: number;
    pages: number;
  }> {
    const [posts, total] = await this.postRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['category'],
      order: { createdAt: 'DESC' }
    });

    return {
      posts,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  }

  async getPostById(id: number): Promise<PostEntity | null> {
    return await this.postRepository.findOne({
      where: { id },
      relations: ['category']
    });
  }

  async updatePost(id: number, updateData: Partial<InterfacePost>): Promise<PostEntity | null> {
    await this.postRepository.update(id, updateData);
    return await this.getPostById(id);
  }

  async deletePost(id: number): Promise<boolean> {
    const result = await this.postRepository.delete(id);
    return result.affected !== 0;
  }

  async getPostsByCategory(categoryId: number, page: number = 1, limit: number = 10) {
    const [posts, total] = await this.postRepository.findAndCount({
      where: { categoryId },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['category'],
      order: { createdAt: 'DESC' }
    });

    return {
      posts,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  }

  async searchPosts(query: string, page: number = 1, limit: number = 10) {
    const [posts, total] = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .where('post.title LIKE :query OR post.content LIKE :query', {
        query: `%${query}%`
      })
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('post.createdAt', 'DESC')
      .getManyAndCount();

    return {
      posts,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  }
}
