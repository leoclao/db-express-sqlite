import request from 'supertest';
import express from 'express';
import { PostController } from '../../src/controllers';
import { PostService } from '../../src/services/PostService';

// Mock the PostService
jest.mock('../../src/services/PostService');

describe('PostController', () => {
  let app: express.Application;
  let postController: PostController;
  let mockPostService: jest.Mocked<PostService>;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    postController = new PostController();
    mockPostService = new PostService() as jest.Mocked<PostService>;
    
    // Setup routes
    app.get('/posts', postController.getAllPosts);
    app.get('/posts/:id', postController.getPostById);
    app.post('/posts', postController.createPost);
    app.put('/posts/:id', postController.updatePost);
    app.delete('/posts/:id', postController.deletePost);
  });

  describe('GET /posts', () => {
    it('should return all posts', async () => {
      const mockPosts = {
        posts: [
          { id: 1, title: 'Test Post', content: 'Test content' }
        ],
        total: 1,
        page: 1,
        pages: 1
      };

      mockPostService.getAllPosts.mockResolvedValue(mockPosts);

      const response = await request(app)
        .get('/posts')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockPosts);
    });

    it('should handle search parameter', async () => {
      const mockSearchResults = {
        posts: [
          { id: 1, title: 'JavaScript Tutorial', content: 'Learn JS' }
        ],
        total: 1,
        page: 1,
        pages: 1
      };

      mockPostService.searchPosts.mockResolvedValue(mockSearchResults);

      const response = await request(app)
        .get('/posts?search=JavaScript')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockPostService.searchPosts).toHaveBeenCalledWith('JavaScript', 1, 10);
    });
  });

  describe('GET /posts/:id', () => {
    it('should return post when found', async () => {
      const mockPost = {
        id: 1,
        title: 'Test Post',
        content: 'Test content'
      };

      mockPostService.getPostById.mockResolvedValue(mockPost as any);

      const response = await request(app)
        .get('/posts/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockPost);
    });

    it('should return 404 when post not found', async () => {
      mockPostService.getPostById.mockResolvedValue(null);

      const response = await request(app)
        .get('/posts/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Post not found');
    });
  });

  describe('POST /posts', () => {
    it('should create post successfully', async () => {
      const newPost = {
        title: 'New Post',
        content: 'New content',
        categoryId: 1
      };

      const createdPost = {
        id: 1,
        ...newPost,
        createdAt: new Date()
      };

      mockPostService.createPost.mockResolvedValue(createdPost as any);

      const response = await request(app)
        .post('/posts')
        .send(newPost)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(newPost.title);
    });
  });
});