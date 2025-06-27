import express, { Application } from 'express';
import dotenv from 'dotenv';
import { initDatabase } from './config/database';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import categoryRoutes from './routes/categoryRoutes';
import contactRoutes from './routes/contactRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

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