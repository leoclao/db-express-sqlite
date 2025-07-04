import { PostService } from '../../src/services/PostService';
import { AppDataSource } from '../../src/config/ormconfig';
import { PostEntity } from '../../src/entities/PostEntity';
import { CategoryEntity } from '../../src/entities/CategoryEntity';

describe('PostService', () => {
  let postService: PostService;
  let testCategory: CategoryEntity;

  beforeAll(async () => {
    postService = new PostService();
    
    // Create test category
    const categoryRepo = AppDataSource.getRepository(CategoryEntity);
    testCategory = await categoryRepo.save({
      name: 'Test Category',
      description: 'Test category for posts'
    });
  });

  afterAll(async () => {
    // Clean up test data
    const postRepo = AppDataSource.getRepository(PostEntity);
    const categoryRepo = AppDataSource.getRepository(CategoryEntity);
    
    await postRepo.delete({});
    await categoryRepo.delete(testCategory.id);
  });

  describe('createPost', () => {
    it('should create a post successfully', async () => {
      const postData = {
        title: 'Test Post',
        content: 'This is a test post content',
        categoryId: testCategory.id,
        type: 'article'
      };

      const result = await postService.createPost(postData);

      expect(result).toBeDefined();
      expect(result.title).toBe(postData.title);
      expect(result.content).toBe(postData.content);
      expect(result.categoryId).toBe(postData.categoryId);
    });

    it('should throw error when creating post with invalid data', async () => {
      const invalidPostData = {
        title: '', // Empty title
        content: 'Test content',
        categoryId: 999 // Non-existent category
      };

      await expect(postService.createPost(invalidPostData)).rejects.toThrow();
    });
  });

  describe('getAllPosts', () => {
    beforeEach(async () => {
      // Create test posts
      await postService.createPost({
        title: 'Post 1',
        content: 'Content 1',
        categoryId: testCategory.id,
        type: 'article'
      });

      await postService.createPost({
        title: 'Post 2',
        content: 'Content 2',
        categoryId: testCategory.id,
        type: 'news'
      });
    });

    it('should return paginated posts', async () => {
      const result = await postService.getAllPosts(1, 10);

      expect(result).toBeDefined();
      expect(result.posts).toBeInstanceOf(Array);
      expect(result.posts.length).toBeGreaterThan(0);
      expect(result.total).toBeGreaterThan(0);
      expect(result.page).toBe(1);
      expect(result.pages).toBeGreaterThan(0);
    });

    it('should handle pagination correctly', async () => {
      const result = await postService.getAllPosts(1, 1);

      expect(result.posts.length).toBe(1);
      expect(result.pages).toBeGreaterThan(1);
    });
  });

  describe('getPostById', () => {
    it('should return post when found', async () => {
      const createdPost = await postService.createPost({
        title: 'Test Post for ID',
        content: 'Test content',
        categoryId: testCategory.id,
        type: 'article'
      });

      const result = await postService.getPostById(createdPost.id);

      expect(result).toBeDefined();
      expect(result!.id).toBe(createdPost.id);
      expect(result!.title).toBe(createdPost.title);
    });

    it('should return null when post not found', async () => {
      const result = await postService.getPostById(99999);

      expect(result).toBeNull();
    });
  });

  describe('searchPosts', () => {
    beforeEach(async () => {
      await postService.createPost({
        title: 'JavaScript Tutorial',
        content: 'Learn JavaScript basics',
        categoryId: testCategory.id,
        type: 'tutorial'
      });

      await postService.createPost({
        title: 'Python Guide',
        content: 'Python programming guide',
        categoryId: testCategory.id,
        type: 'guide'
      });
    });

    it('should search posts by title', async () => {
      const result = await postService.searchPosts('JavaScript');

      expect(result.posts.length).toBeGreaterThan(0);
      expect(result.posts[0].title).toContain('JavaScript');
    });

    it('should search posts by content', async () => {
      const result = await postService.searchPosts('programming');

      expect(result.posts.length).toBeGreaterThan(0);
      expect(result.posts[0].content).toContain('programming');
    });

    it('should return empty results for non-existent search', async () => {
      const result = await postService.searchPosts('nonexistent');

      expect(result.posts.length).toBe(0);
      expect(result.total).toBe(0);
    });
  });
});