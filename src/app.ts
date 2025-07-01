import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { initDatabase } from './config/database';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import categoryRoutes from './routes/categoryRoutes';
import contactRoutes from './routes/contactRoutes';
import { errorHandler } from './middlewares/errorHandler';

// dotenv.config();
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Cấu hình CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Cho phép frontend tại localhost:3000
  // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Các phương thức HTTP được phép
  methods: ['GET'], // Các phương thức HTTP được phép
  allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép
}));
// app.options('*', cors()); // Xử lý yêu cầu OPTIONS (preflight)
app.options('/api/posts', cors({
  origin: 'http://localhost:3000',
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('/api/users', cors({
  origin: 'http://localhost:3000',
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('/api/categories', cors({
  origin: 'http://localhost:3000',
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('/api/contact', cors({
  origin: 'http://localhost:3000',
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contact', contactRoutes);

app.use(errorHandler);

const startServer = async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();