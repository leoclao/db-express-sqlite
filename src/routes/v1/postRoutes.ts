/**
 * Express router for handling post-related API endpoints.
 *
 * ## Routes
 * - `GET /` - Retrieve all posts.
 * - `GET /:id` - Retrieve a post by its ID.
 * - `POST /` - Create a new post.
 * - `PUT /:id` - Update an existing post by its ID.
 * - `DELETE /:id` - Delete a post by its ID.
 * - `POST /reset` - Reset all posts.
 * - `GET /category/:categoryId` - Retrieve posts by category ID.
 * - `GET /latest` - Retrieve the latest posts.
 * - `GET /type/:type` - Retrieve posts by type.
 * - `GET /home` - Retrieve home page data.
 *
 * @module routes/v1/postRoutes
 */
import express, { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import {
  getAllPostsController,
  getPostsByIdController,
  createPostController,
  updatePostController,
  deletePostController,
  resetAllPostsController,
  getPostsByCategoryController,
  getLatestPostsController,
  getPostsByTypeController,
  getHomeDataController,
} from "../../controllers/postController";

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API for posts management
 */

/**
 * @swagger
 * /api/v1/posts:
 *   get:
 *     summary: Retrieve all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: A list of posts
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Post created
 *
 * /api/v1/posts/{id}:
 *   get:
 *     summary: Retrieve a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single post
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Post updated
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post deleted
 *
 * /api/v1/posts/reset:
 *   post:
 *     summary: Reset all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: All posts reset
 *
 * /api/v1/posts/category/{categoryId}:
 *   get:
 *     summary: Retrieve posts by category ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Posts by category
 *
 * /api/v1/posts/latest:
 *   get:
 *     summary: Retrieve the latest posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Latest posts
 *
 * /api/v1/posts/type/{type}:
 *   get:
 *     summary: Retrieve posts by type
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Posts by type
 *
 * /api/v1/posts/home:
 *   get:
 *     summary: Retrieve home page data
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Home page data
 */

router.get("/", getAllPostsController);
router.get("/:id", getPostsByIdController);
router.post("/", authMiddleware, createPostController);
router.put('/:id', authMiddleware, updatePostController);
router.delete("/:id", authMiddleware, deletePostController);
router.post("/reset", authMiddleware, resetAllPostsController);
router.get("/category/:categoryId", getPostsByCategoryController);
router.get("/latest", getLatestPostsController);
router.get("/type/:type", getPostsByTypeController);
router.get("/home", getHomeDataController);

export default router;
