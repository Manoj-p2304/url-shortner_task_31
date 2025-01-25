import { Request, Response } from 'express';
import ShortUrl from '../models/ShortUrl';
import { nanoid } from 'nanoid';


export const createShortUrl = async (req: any, res: any) => {
    const { longUrl, customAlias, topic } = req.body;
    const userId = req.user.googleId;
  
    if (!userId) {
      return res.status(400).json({ error: 'User not authenticated' });
    }
  
    try {
      const shortUrl = customAlias || nanoid(8);
  
      const newShortUrl = await ShortUrl.create({
        longUrl,
        shortUrl,
        customAlias,
        topic,
        userId,
      });
  
      return res.status(201).json({ shortUrl: newShortUrl.shortUrl, createdAt: newShortUrl.createdAt });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create short URL' });
    }
  };
  
  export const getShortUrl = async (req: any, res: any) => {
    const { alias } = req.params;
  
    try {
      const shortUrl = await ShortUrl.findOne({ shortUrl: alias });
      if (!shortUrl) {
        return res.status(404).json({ error: 'Short URL not found' });
      }
      return res.redirect(shortUrl.longUrl);
    } catch (err) {
      return res.status(500).json({ error: 'Error fetching short URL' });
    }
  };