import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'db-express-sqlite API',
      version: '1.0.0',
      description: 'API for managing users, posts, categories, and contacts',
    },
    servers: [
      { url: 'http://localhost:3001/api/v1' },
    ],
  },
  apis: ['./src/routes/v1/*.ts'], // Đường dẫn đến các file route
};

export const swaggerDocs = swaggerJsdoc(options);