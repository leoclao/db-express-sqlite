import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { sendError } from '../utils/responseFormatter';

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required', 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(res, 'Insufficient permissions', 403);
      return;
    }

    next();
  };
};

export const requirePermission = (permissions: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required', 401);
      return;
    }

    const hasPermission = permissions.some(permission => 
      req.user!.permissions.includes(permission)
    );

    if (!hasPermission) {
      sendError(res, 'Insufficient permissions', 403);
      return;
    }

    next();
  };
};