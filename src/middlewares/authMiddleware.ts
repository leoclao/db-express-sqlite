import { Request, Response, NextFunction } from "express";

// Ví dụ: xác thực bằng token đơn giản (Bearer token)
const AUTH_TOKEN = process.env.AUTH_TOKEN || "your-secret-token";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (token !== AUTH_TOKEN) {
    res.status(403).json({ error: "Forbidden: Invalid token" });
    return;
  }

  next();
}