import request from 'supertest';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import * as categoryModel from '../src/models/categoryModel';
import { getAllCategories, createCategory } from '../src/controllers/categoryController';

jest.mock('../src/models/categoryModel');

const app: Express = express();
app.use(bodyParser.json());
app.get('/categories', getAllCategories);
app.post('/categories', createCategory);

describe('Category Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /categories', () => {
    it('should return all categories', async () => {
      const mockCategories = [{ id: 1, name: 'Books' }, { id: 2, name: 'Movies' }];
      (categoryModel.getCategories as jest.Mock).mockResolvedValue(mockCategories);

      const res = await request(app).get('/categories');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockCategories);
      expect(categoryModel.getCategories).toHaveBeenCalled();
    });

    it('should handle errors and return 500', async () => {
      (categoryModel.getCategories as jest.Mock).mockRejectedValue(new Error('DB error'));

      const res = await request(app).get('/categories');
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Internal server error');
      expect(res.body.details).toBe('DB error');
    });
  });

  describe('POST /categories', () => {
    it('should create a new category', async () => {
      (categoryModel.createCategory as jest.Mock).mockResolvedValue(3);

      const res = await request(app)
        .post('/categories')
        .send({ name: 'Music' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'Category created', categoryId: 3 });
      expect(categoryModel.createCategory).toHaveBeenCalledWith({ name: 'Music' });
    });

    it('should return 400 if name is missing', async () => {
      const res = await request(app)
        .post('/categories')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Category name is required');
      expect(categoryModel.createCategory).not.toHaveBeenCalled();
    });

    it('should return 400 if category name already exists', async () => {
      (categoryModel.createCategory as jest.Mock).mockRejectedValue(
        new Error('SQLITE_CONSTRAINT: UNIQUE constraint failed: categories.name')
      );

      const res = await request(app)
        .post('/categories')
        .send({ name: 'Books' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Category name already exists');
    });

    it('should handle other errors and return 500', async () => {
      (categoryModel.createCategory as jest.Mock).mockRejectedValue(
        new Error('Some other DB error')
      );

      const res = await request(app)
        .post('/categories')
        .send({ name: 'Games' });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Internal server error');
      expect(res.body.details).toBe('Some other DB error');
    });
  });
});