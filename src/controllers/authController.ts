import { Request, Response } from 'express';

export const googleAuth = (req: Request, res: Response) => {
  res.send('Google Authentication');
};

export const googleCallback = (req: Request, res: Response) => {
  res.send('Google Callback');
};
