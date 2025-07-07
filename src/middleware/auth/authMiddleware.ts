import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/responseFormatter';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    sendError(res, 'Access token required', 401);
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT_SECRET is not defined');
    sendError(res, 'Server configuration error', 500);
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as any;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      sendError(res, 'Token expired', 401);
    } else if (error instanceof jwt.JsonWebTokenError) {
      sendError(res, 'Invalid token', 401);
    } else {
      sendError(res, 'Authentication failed', 401);
    }
  }
};