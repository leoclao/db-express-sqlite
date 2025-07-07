import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/responseFormatter';

const createRateLimiter = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message: { success: false, error: message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      sendError(res, message, 429);
    }
  });
};

export const generalRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per window
  'Too many requests from this IP, please try again later.'
);

export const authRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts per window
  'Too many authentication attempts, please try again later.'
);

export const apiRateLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  20, // 20 requests per minute
  'API rate limit exceeded, please slow down.'
);