// server.ts - Entry point riêng biệt
import { startServer } from './app';

// Start server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});