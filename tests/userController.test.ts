import request from 'supertest';
import express from 'express';
import * as userModel from '../src/models/userModel';
import { getAllUsers, createUser } from '../src/controllers/userController';

const app = express();
app.use(express.json());
app.get('/users', getAllUsers);
app.post('/users', createUser);

jest.mock('../src/models/userModel');

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users', () => {
    it('should return a list of users', async () => {
      const mockUsers = [{ id: 1, name: 'Alice', email: 'alice@example.com' }];
      (userModel.getUsers as jest.Mock).mockResolvedValue(mockUsers);

      const res = await request(app).get('/users');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUsers);
    });

    it('should handle errors and return 500', async () => {
      (userModel.getUsers as jest.Mock).mockRejectedValue(new Error('DB error'));

      const res = await request(app).get('/users');
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Internal server error');
      expect(res.body.details).toBe('DB error');
    });
  });

  describe('POST /users', () => {
    it('should create a user and return 201', async () => {
      (userModel.createUser as jest.Mock).mockResolvedValue(2);
      const user = { name: 'Bob', email: 'bob@example.com' };

      const res = await request(app).post('/users').send(user);
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'User created', userId: 2 });
    });

    it('should return 400 if name or email is missing', async () => {
      const res = await request(app).post('/users').send({ name: 'NoEmail' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Name and email are required');
    });

    it('should return 400 if email already exists', async () => {
      (userModel.createUser as jest.Mock).mockRejectedValue(
        new Error('SQLITE_CONSTRAINT: UNIQUE constraint failed: users.email')
      );
      const user = { name: 'Alice', email: 'alice@example.com' };

      const res = await request(app).post('/users').send(user);
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email already exists');
    });

    it('should handle other errors and return 500', async () => {
      (userModel.createUser as jest.Mock).mockRejectedValue(new Error('Some DB error'));
      const user = { name: 'Eve', email: 'eve@example.com' };

      const res = await request(app).post('/users').send(user);
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Internal server error');
      expect(res.body.details).toBe('Some DB error');
    });
  });
});

// We recommend installing an extension to run jest tests.