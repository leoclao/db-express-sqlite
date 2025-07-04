import { PostService } from './PostService';
import { cache } from '../utils/cache';
import { PostEntity } from '../entities/PostEntity';

export class CachedPostService extends PostService {
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getAllPosts(page: number = 1, limit: number = 10): Promise<{
    posts: PostEntity[];
    total: number;
    page: number;
    pages: number;
  }> {
    const cacheKey = `posts:all:${page}:${limit}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const result = await super.getAllPosts(page, limit);
    cache.set(cacheKey, result, this.CACHE_TTL);

    return result;
  }

  async getPostById(id: number): Promise<PostEntity | null> {
    const cacheKey = `post:${id}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const result = await super.getPostById(id);
    if (result) {
      cache.set(cacheKey, result, this.CACHE_TTL);
    }

    return result;
  }

  async createPost(postData: any): Promise<PostEntity> {
    const result = await super.createPost(postData);
    
    // Invalidate related caches
    this.invalidatePostCaches();
    
    return result;
  }

  async updatePost(id: number, updateData: any): Promise<PostEntity | null> {
    const result = await super.updatePost(id, updateData);
    
    // Invalidate specific post cache and list caches
    cache.delete(`post:${id}`);
    this.invalidatePostCaches();
    
    return result;
  }

  async deletePost(id: number): Promise<boolean> {
    const result = await super.deletePost(id);
    
    if (result) {
      cache.delete(`post:${id}`);
      this.invalidatePostCaches();
    }
    
    return result;
  }

  private invalidatePostCaches(): void {
    const stats = cache.getStats();
    const keysToDelete = stats.keys.filter(key => 
      key.startsWith('posts:all:') || 
      key.startsWith('posts:category:') ||
      key.startsWith('posts:search:')
    );

    keysToDelete.forEach(key => cache.delete(key));
  }
}