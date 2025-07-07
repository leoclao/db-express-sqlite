import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string | object;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
    version?: string;
  };
}

export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode = 200,
  pagination?: ApiResponse['pagination']
) => {
  const response: ApiResponse<T> = {
    success: true,
    ...(data !== undefined && { data }),
    ...(message && { message }),
    ...(pagination && { pagination }),
    meta: {
      timestamp: new Date().toISOString(),
      version: process.env.API_VERSION || '1.0.0'
    }
  };
  
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  error: string | object,
  statusCode = 400,
  details?: any
) => {
  const response: ApiResponse = {
    success: false,
    error,
    ...(details && process.env.NODE_ENV === 'development' && { details }),
    meta: {
      timestamp: new Date().toISOString(),
      version: process.env.API_VERSION || '1.0.0'
    }
  };
  
  res.status(statusCode).json(response);
};

// Utility for paginated responses
export const sendPaginatedResponse = <T>(
  res: Response,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
  },
  message?: string
) => {
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  
  sendSuccess(res, data, message, 200, {
    ...pagination,
    totalPages
  });
};
