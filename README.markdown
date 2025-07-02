# db-express-sqlite

A RESTful API built with Express.js, SQLite, and TypeScript for managing users, posts, categories, and contacts.

## Table of Contents
- [Description](#description)
- [Technologies](#technologies)
- [Requirements](#requirements)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)

## Description
This project is a backend API for managing users, posts, categories, and contact messages. It uses SQLite as the database and TypeScript for type safety.

## Technologies
- Express.js
- SQLite
- TypeScript
- Node.js
- Helmet (for security)
- CORS

## Requirements
- Node.js (v16 or higher)
- npm (v8 or higher)

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd db-express-sqlite
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your configuration (e.g., `PORT`, `ALLOWED_ORIGINS`).

## Running the Project
- Development mode (with hot-reload):
  ```bash
  npm run dev
  ```
- Production mode:
  ```bash
  npm start
  ```

## API Endpoints
| Method | Endpoint                     | Description                              |
|--------|------------------------------|------------------------------------------|
| GET    | `/api/users`                | Get all users                           |
| GET    | `/api/posts`                | Get all posts                           |
| POST   | `/api/posts`                | Create a new post                       |
| DELETE | `/api/posts/:id`            | Delete a post by ID                     |
| DELETE | `/api/posts`                | Reset all posts                         |
| GET    | `/api/posts/category/:categoryId` | Get posts by category ID           |
| GET    | `/api/posts/latest`         | Get latest posts                        |
| GET    | `/api/posts/type/:type`     | Get posts by type                       |
| GET    | `/api/posts/home`           | Get data for home page                  |
| GET    | `/api/categories`           | Get all categories                      |
| POST   | `/api/categories`           | Create a new category                   |
| POST   | `/api/contacts`             | Create a new contact message            |

## Environment Variables
| Variable         | Description                              | Example                     |
|------------------|------------------------------------------|-----------------------------|
| PORT            | Port for the server                     | 3000                        |
| DATABASE_PATH   | Path to SQLite database file            | ./database.sqlite           |
| ALLOWED_ORIGINS | Allowed origins for CORS                | http://localhost:3000       |