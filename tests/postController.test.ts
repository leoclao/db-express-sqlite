import request from "supertest";
import express, { Express } from "express";
import bodyParser from "body-parser";
import * as postModel from "../src/models/postModel";
import * as categoryModel from "../src/models/categoryModel";
import * as userModel from "../src/models/userModel";
import * as postController from "../src/controllers/postController";

jest.mock("../src/models/postModel");
jest.mock("../src/models/categoryModel");
jest.mock("../src/models/userModel");

const app: Express = express();
app.use(bodyParser.json());
app.get("/posts", postController.getAllPostsController);
app.get("/posts/:id", postController.getPostsByIdController);
app.post("/posts", postController.createPostController);
app.put("/posts/:id", postController.updatePostController);
app.delete("/posts/:id", postController.deletePostController);
app.get("/posts/category/:categoryId", postController.getPostsByCategoryController);
app.get("/posts/latest", postController.getLatestPostsController);
app.get("/posts/type/:type", postController.getPostsByTypeController);
app.get("/home", postController.getHomeDataController);

describe("postController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllPostsController", () => {
    it("should return posts", async () => {
      (postModel.getPostsModel as jest.Mock).mockResolvedValue([{ id: 1, title: "Test" }]);
      const res = await request(app).get("/posts");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 1, title: "Test" }]);
    });

    it("should handle errors", async () => {
      (postModel.getPostsModel as jest.Mock).mockRejectedValue(new Error("fail"));
      const res = await request(app).get("/posts");
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Internal server error");
    });
  });

  describe("getPostsByIdController", () => {
    it("should return post by id", async () => {
      (postModel.getPostsByIdModel as jest.Mock).mockResolvedValue({ id: 1, title: "Test" });
      const res = await request(app).get("/posts/1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: 1, title: "Test" });
    });

    it("should return 400 for invalid id", async () => {
      const res = await request(app).get("/posts/abc");
      expect(res.status).toBe(400);
    });

    it("should handle errors", async () => {
      (postModel.getPostsByIdModel as jest.Mock).mockRejectedValue(new Error("fail"));
      const res = await request(app).get("/posts/1");
      expect(res.status).toBe(500);
    });
  });

  describe("createPostController", () => {
    const validPost = {
      slug: "slug",
      title: "title",
      categoryId: 1,
      excerpt: "excerpt",
      content: "content",
      createdAt: "2024-01-01",
      userId: 2,
      type: "blog"
    };

    it("should create post", async () => {
      (categoryModel.getCategoryById as jest.Mock).mockResolvedValue({ id: 1 });
      (userModel.getUserById as jest.Mock).mockResolvedValue({ id: 2 });
      (postModel.createPostModel as jest.Mock).mockResolvedValue(123);
      const res = await request(app).post("/posts").send(validPost);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("postId");
    });

    it("should return 400 if required fields missing", async () => {
      const res = await request(app).post("/posts").send({});
      expect(res.status).toBe(400);
    });

    it("should return 400 for invalid type", async () => {
      const post = { ...validPost, type: "invalid" };
      const res = await request(app).post("/posts").send(post);
      expect(res.status).toBe(400);
    });

    it("should return 400 if category not found", async () => {
      (categoryModel.getCategoryById as jest.Mock).mockResolvedValue(null);
      const res = await request(app).post("/posts").send(validPost);
      expect(res.status).toBe(400);
    });

    it("should return 400 if user not found", async () => {
      (categoryModel.getCategoryById as jest.Mock).mockResolvedValue({ id: 1 });
      (userModel.getUserById as jest.Mock).mockResolvedValue(null);
      const res = await request(app).post("/posts").send(validPost);
      expect(res.status).toBe(400);
    });

    it("should return 400 if slug exists", async () => {
      (categoryModel.getCategoryById as jest.Mock).mockResolvedValue({ id: 1 });
      (userModel.getUserById as jest.Mock).mockResolvedValue({ id: 2 });
      (postModel.createPostModel as jest.Mock).mockRejectedValue(new Error("SQLITE_CONSTRAINT: UNIQUE constraint failed"));
      const res = await request(app).post("/posts").send(validPost);
      expect(res.status).toBe(400);
    });

    it("should handle errors", async () => {
      (categoryModel.getCategoryById as jest.Mock).mockResolvedValue({ id: 1 });
      (userModel.getUserById as jest.Mock).mockResolvedValue({ id: 2 });
      (postModel.createPostModel as jest.Mock).mockRejectedValue(new Error("fail"));
      const res = await request(app).post("/posts").send(validPost);
      expect(res.status).toBe(500);
    });
  });

  describe("updatePostController", () => {
    it("should update post", async () => {
      (postModel.getPostsByIdModel as jest.Mock).mockResolvedValue({ id: 1 });
      (postModel.updatePostModel as jest.Mock).mockResolvedValue({ changed: 1 });
      const res = await request(app).put("/posts/1").send({ title: "new" });
      expect(res.status).toBe(200);
    });

    it("should return 400 for invalid id", async () => {
      const res = await request(app).put("/posts/abc").send({ title: "new" });
      expect(res.status).toBe(400);
    });

    it("should return 404 if post not found", async () => {
      (postModel.getPostsByIdModel as jest.Mock).mockResolvedValue(null);
      const res = await request(app).put("/posts/1").send({ title: "new" });
      expect(res.status).toBe(404);
    });

    it("should return 400 if category not found", async () => {
      (postModel.getPostsByIdModel as jest.Mock).mockResolvedValue({ id: 1 });
      (categoryModel.getCategoryById as jest.Mock).mockResolvedValue(null);
      const res = await request(app).put("/posts/1").send({ categoryId: 99 });
      expect(res.status).toBe(400);
    });

    it("should return 400 if user not found", async () => {
      (postModel.getPostsByIdModel as jest.Mock).mockResolvedValue({ id: 1 });
      (categoryModel.getCategoryById as jest.Mock).mockResolvedValue({ id: 1 });
      (userModel.getUserById as jest.Mock).mockResolvedValue(null);
      const res = await request(app).put("/posts/1").send({ userId: 99 });
      expect(res.status).toBe(400);
    });

    it("should return 400 for invalid type", async () => {
      (postModel.getPostsByIdModel as jest.Mock).mockResolvedValue({ id: 1 });
      const res = await request(app).put("/posts/1").send({ type: "invalid" });
      expect(res.status).toBe(400);
    });

    it("should return 400 if no changes made", async () => {
      (postModel.getPostsByIdModel as jest.Mock).mockResolvedValue({ id: 1 });
      (postModel.updatePostModel as jest.Mock).mockResolvedValue({});
      const res = await request(app).put("/posts/1").send({ title: "same" });
      expect(res.status).toBe(400);
    });

    it("should return 400 if slug exists", async () => {
      (postModel.getPostsByIdModel as jest.Mock).mockResolvedValue({ id: 1 });
      (postModel.updatePostModel as jest.Mock).mockRejectedValue(new Error("SQLITE_CONSTRAINT: UNIQUE constraint failed"));
      const res = await request(app).put("/posts/1").send({ slug: "slug" });
      expect(res.status).toBe(400);
    });

    it("should handle errors", async () => {
      (postModel.getPostsByIdModel as jest.Mock).mockResolvedValue({ id: 1 });
      (postModel.updatePostModel as jest.Mock).mockRejectedValue(new Error("fail"));
      const res = await request(app).put("/posts/1").send({ title: "err" });
      expect(res.status).toBe(500);
    });
  });

  describe("deletePostController", () => {
    it("should delete post", async () => {
      (postModel.deletePostModel as jest.Mock).mockResolvedValue({});
      const res = await request(app).delete("/posts/1");
      expect(res.status).toBe(200);
    });

    it("should return 400 for invalid id", async () => {
      const res = await request(app).delete("/posts/abc");
      expect(res.status).toBe(400);
    });

    it("should return 404 if post not found", async () => {
      (postModel.deletePostModel as jest.Mock).mockResolvedValue({ affected: 0 });
      const res = await request(app).delete("/posts/1");
      expect(res.status).toBe(404);
    });

    it("should handle errors", async () => {
      (postModel.deletePostModel as jest.Mock).mockRejectedValue(new Error("fail"));
      const res = await request(app).delete("/posts/1");
      expect(res.status).toBe(500);
    });
  });

  describe("getPostsByCategoryController", () => {
    it("should return posts by category", async () => {
      (categoryModel.getCategoryById as jest.Mock).mockResolvedValue({ id: 1 });
      (postModel.getPostsByCategoryIdModel as jest.Mock).mockResolvedValue([{ id: 1 }]);
      const res = await request(app).get("/posts/category/1");
      expect(res.status).toBe(200);
    });

    it("should return 400 for invalid category id", async () => {
      const res = await request(app).get("/posts/category/abc");
      expect(res.status).toBe(400);
    });

    it("should return 404 if category not found", async () => {
      (categoryModel.getCategoryById as jest.Mock).mockResolvedValue(null);
      const res = await request(app).get("/posts/category/1");
      expect(res.status).toBe(404);
    });

    it("should handle errors", async () => {
      (categoryModel.getCategoryById as jest.Mock).mockResolvedValue({ id: 1 });
      (postModel.getPostsByCategoryIdModel as jest.Mock).mockRejectedValue(new Error("fail"));
      const res = await request(app).get("/posts/category/1");
      expect(res.status).toBe(500);
    });
  });

  describe("getLatestPostsController", () => {
    it("should return latest posts", async () => {
      (postModel.getLatestPostsModel as jest.Mock).mockResolvedValue([{ id: 1 }]);
      const res = await request(app).get("/posts/latest?limit=2");
      expect(res.status).toBe(200);
    });

    it("should return 400 for invalid limit", async () => {
      const res = await request(app).get("/posts/latest?limit=abc");
      expect(res.status).toBe(400);
    });

    it("should handle errors", async () => {
      (postModel.getLatestPostsModel as jest.Mock).mockRejectedValue(new Error("fail"));
      const res = await request(app).get("/posts/latest?limit=2");
      expect(res.status).toBe(500);
    });
  });

  describe("getPostsByTypeController", () => {
    it("should return posts by type", async () => {
      (postModel.getPostsByTypeModel as jest.Mock).mockResolvedValue([{ id: 1 }]);
      const res = await request(app).get("/posts/type/blog");
      expect(res.status).toBe(200);
    });

    it("should return 400 for invalid type", async () => {
      const res = await request(app).get("/posts/type/invalid");
      expect(res.status).toBe(400);
    });

    it("should handle errors", async () => {
      (postModel.getPostsByTypeModel as jest.Mock).mockRejectedValue(new Error("fail"));
      const res = await request(app).get("/posts/type/blog");
      expect(res.status).toBe(500);
    });
  });

  describe("getHomeDataController", () => {
    it("should return home data", async () => {
      (postModel.getPostsByTypeModel as jest.Mock).mockResolvedValue([{ id: 1 }, { id: 2 }]);
      (categoryModel.getCategories as jest.Mock).mockResolvedValue([{ id: 1 }]);
      const res = await request(app).get("/home?limit=1");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("latestBlogs");
      expect(res.body).toHaveProperty("latestEvents");
      expect(res.body).toHaveProperty("categories");
    });

    it("should return 400 for invalid limit", async () => {
      const res = await request(app).get("/home?limit=abc");
      expect(res.status).toBe(400);
    });

    it("should handle errors", async () => {
      (postModel.getPostsByTypeModel as jest.Mock).mockRejectedValue(new Error("fail"));
      const res = await request(app).get("/home?limit=1");
      expect(res.status).toBe(500);
    });
  });
});