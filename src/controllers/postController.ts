import { Request, Response, RequestHandler } from "express";
import {
  createPostModel,
  updatePostModel,
  getPostsModel,
  getPostsByIdModel,
  deletePostModel,
  resetPostsModel,
  getPostsByCategoryIdModel,
  getLatestPostsModel,
  getPostsByTypeModel
} from "../models/postModel";
import { getCategoryById } from "../models/categoryModel";
import { getUserById } from "../models/userModel";
import { getCategories } from "../models/categoryModel";
import { Post } from "../types";

export const getAllPostsController = async (req: Request, res: Response) => {
  const { limit = 10, offset = 0, sort = 'createdAt', order = 'DESC' } = req.query;
  const parsedLimit = Number(limit) || 10;
  const parsedOffset = Number(offset) || 0;
  const parsedSort = typeof sort === 'string' ? sort : 'createdAt';
  const parsedOrder = (typeof order === 'string' && ['ASC', 'DESC'].includes(order.toUpperCase()))
    ? order.toUpperCase()
    : 'DESC';
  
  try {
    const posts = await getPostsModel(parsedLimit, parsedOffset, parsedSort, parsedOrder);
    res.json(posts);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Internal server error",
        details: (error as Error).message,
      });
  }
};

export const getPostsByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid post ID" });
      return;
    }
    const postsId = await getPostsByIdModel(id);
    res.json(postsId);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Internal server error",
        details: (error as Error).message,
      });
  }
};

export const createPostController: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const post: Post = req.body;
  try {
    if (
      !post.slug ||
      !post.title ||
      !post.categoryId ||
      !post.excerpt ||
      !post.content ||
      !post.createdAt ||
      !post.userId ||
      !post.type
    ) {
      res
        .status(400)
        .json({
          error:
            "slug, title, categoryId, excerpt, content, createdAt, userId, and type are required",
        });
      return;
    }
    if (!["about", "blog", "event", "service"].includes(post.type)) {
      res
        .status(400)
        .json({
          error: "Invalid type, must be about, blog, event, or service",
        });
      return;
    }
    const category = await getCategoryById(post.categoryId);
    if (!category) {
      res.status(400).json({ error: "Category not found" });
      return;
    }
    const user = await getUserById(post.userId);
    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }
    const postId = await createPostModel(post);
    res.status(201).json({ message: "Post created", postId });
  } catch (error: any) {
    if (error.message.includes("SQLITE_CONSTRAINT: UNIQUE constraint failed")) {
      res.status(400).json({ error: "Slug already exists" });
      return;
    }
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export const updatePostController: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const post: Partial<Post> = req.body;

  try {
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid post ID" });
      return;
    }

    const existingPost = await getPostsByIdModel(id);
    if (!existingPost) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    // Optional: validate fields if needed
    if (post.categoryId) {
      const category = await getCategoryById(post.categoryId);
      if (!category) {
        res.status(400).json({ error: "Category not found" });
        return;
      }
    }
    if (post.userId) {
      const user = await getUserById(post.userId);
      if (!user) {
        res.status(400).json({ error: "User not found" });
        return;
      }
    }
    if (post.type && !["about", "blog", "event", "service"].includes(post.type)) {
      res.status(400).json({ error: "Invalid type, must be about, blog, event, or service" });
      return;
    }

    const changes = await updatePostModel(id, post);
    if (changes === 0) {
      res.status(400).json({ error: "No changes made" });
      return;
    }

    res.json({ message: "Post updated" });
  } catch (error: any) {
    if (error.message?.includes("SQLITE_CONSTRAINT: UNIQUE constraint failed")) {
      res.status(400).json({ error: "Slug already exists" });
      return;
    }
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

export const deletePostController: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  try {
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid post ID" });
      return;
    }
    const changes = await deletePostModel(id);
    if (changes === 0) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json({ message: "Post deleted" });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Internal server error",
        details: (error as Error).message,
      });
  }
};

export const resetAllPostsController = async (req: Request, res: Response) => {
  try {
    await resetPostsModel();
    res.json({ message: "All posts reset successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Internal server error",
        details: (error as Error).message,
      });
  }
};

export const getPostsByCategoryController: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const categoryId = parseInt(req.params.categoryId, 10);
  try {
    if (isNaN(categoryId)) {
      res.status(400).json({ error: "Invalid category ID" });
      return;
    }
    const category = await getCategoryById(categoryId);
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    const posts = await getPostsByCategoryIdModel(categoryId);
    res.json(posts);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Internal server error",
        details: (error as Error).message,
      });
  }
};

export const getLatestPostsController: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 5;
    if (isNaN(limit) || limit < 1) {
      res.status(400).json({ error: "Invalid limit parameter" });
      return;
    }
    const posts = await getLatestPostsModel(limit);
    res.json(posts);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Internal server error",
        details: (error as Error).message,
      });
  }
};

export const getPostsByTypeController: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { type } = req.params;
  try {
    if (!["about", "blog", "event", "service"].includes(type)) {
      res
        .status(400)
        .json({
          error: "Invalid type, must be about, blog, event, or service",
        });
      return;
    }
    const posts = await getPostsByTypeModel(type);
    res.json(posts);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Internal server error",
        details: (error as Error).message,
      });
  }
};

export const getHomeDataController: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 5;
    if (isNaN(limit) || limit < 1) {
      res.status(400).json({ error: "Invalid limit parameter" });
      return;
    }
    const latestBlogs = await getPostsByTypeModel("blog");
    const latestEvents = await getPostsByTypeModel("event");
    const categories = await getCategories();
    res.json({
      latestBlogs: latestBlogs.slice(0, limit),
      latestEvents: latestEvents.slice(0, limit),
      categories,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Internal server error",
        details: (error as Error).message,
      });
  }
};
