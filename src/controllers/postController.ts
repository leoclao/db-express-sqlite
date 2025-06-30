import { Request, Response, RequestHandler } from "express";
import {
  createPost,
  getPosts,
  deletePost as deletePostModel,
  resetPosts,
  getPostsByCategoryId,
  getLatestPosts as getLatestPostsModel,
  getPostsByType as getPostsByTypeModel,
  getPostByType,
} from "../models/postModel";
import { getCategoryById } from "../models/categoryModel";
import { getUserById } from "../models/userModel";
import { getCategories } from "../models/categoryModel";
import { Post } from "../types";

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await getPosts();
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

export const createPostHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
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
    const postId = await createPost(post);
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

export const deletePost: RequestHandler = async (req: Request, res: Response): Promise<void> => {
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

export const resetAllPosts = async (req: Request, res: Response) => {
  try {
    await resetPosts();
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

export const getPostsByCategory: RequestHandler = async (req: Request, res: Response): Promise<void> => {
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
    const posts = await getPostsByCategoryId(categoryId);
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

export const getLatestPosts: RequestHandler = async (req: Request, res: Response): Promise<void> => {
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

export const getPostsByType: RequestHandler = async (req: Request, res: Response): Promise<void> => {
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

export const getHomeData: RequestHandler = async (req: Request, res: Response): Promise<void> => {
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
