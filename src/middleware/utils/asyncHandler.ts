import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Alternative with better typing
export const asyncWrapper = <T extends Request = Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: T, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
