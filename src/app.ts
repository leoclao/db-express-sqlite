import express, { Application } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import { initDatabase } from './config/database';
import userRoutes from './routes/v1/userRoutes';
import postRoutes from './routes/v1/postRoutes';
import categoryRoutes from './routes/v1/categoryRoutes';
import contactRoutes from './routes/v1/contactRoutes';
import { errorHandler } from './middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './swagger';

// dotenv.config();
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Thêm helmet để bảo mật
app.use(helmet());

// Cấu hình CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Cho phép frontend tại localhost:3000
  // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Các phương thức HTTP được phép
  methods: ['GET'], // Các phương thức HTTP được phép
  allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép
}));
// app.options('*', cors()); // Xử lý yêu cầu OPTIONS (preflight)
app.options('/api/v1/posts', cors({
  origin: 'http://localhost:3000',
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('/api/v1/users', cors({
  origin: 'http://localhost:3000',
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('/api/v1/categories', cors({
  origin: 'http://localhost:3000',
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('/api/v1/contact', cors({
  origin: 'http://localhost:3000',
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/contact', contactRoutes);

app.use(errorHandler);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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