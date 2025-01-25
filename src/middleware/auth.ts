// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  next();
};
