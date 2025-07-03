import { resetPosts } from './../config/database';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { PostService } from '../services/PostService';

class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  // GET /api/v1/posts
  getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      let result;
      if (search) {
        result = await this.postService.searchPosts(search, page, limit);
      } else {
        result = await this.postService.getAllPosts(page, limit);
      }

      res.json({
        success: true,
        data: result,
        message: 'Posts retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/v1/posts/:id
  getPostById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const post = await this.postService.getPostById(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      res.json({
        success: true,
        data: post,
        message: 'Post retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/v1/posts
  createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const post = await this.postService.createPost(req.body);

      res.status(201).json({
        success: true,
        data: post,
        message: 'Post created successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  // PUT /api/v1/posts/:id
  updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const id = parseInt(req.params.id);
      const post = await this.postService.updatePost(id, req.body);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      res.json({
        success: true,
        data: post,
        message: 'Post updated successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  // DELETE /api/v1/posts/:id
  deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.postService.deletePost(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      res.json({
        success: true,
        message: 'Post deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  // RESET /api/v1/posts/reset
  resetPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await resetPosts();
      res.json({
        success: true,
        message: 'Posts reset successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/v1/posts/category/:categoryId
  getPostsByCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.postService.getPostsByCategory(categoryId, page, limit);

      res.json({
        success: true,
        data: result,
        message: 'Posts retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}

export const postController = new PostController();
// Export methods for direct import
export const getAllPosts = postController.getAllPosts;
export const getPostById = postController.getPostById;
export const createPost = postController.createPost;
export const updatePost = postController.updatePost;
export const deletePost = postController.deletePost;
export const resetPosts = postController.resetPosts;
export const getPostsByCategory = postController.getPostsByCategory;
export const getLatestPosts = postController.getLatestPosts;
// export const getPostsByType = postController.getPostsByType;
// export const getHomePosts = postController.getHomePosts;
