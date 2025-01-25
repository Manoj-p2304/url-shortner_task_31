// src/types/express.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      User?: {
        id: string;
        name?: string;
      };
    }
  }
}
