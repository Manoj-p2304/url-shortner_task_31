import ShortUrl from '../models/ShortUrl.js';
import { nanoid } from 'nanoid';
import { updateAnalytics } from './analyticsController.js';
import redisClient from '../utils/redisClient.js';

export const createShortUrl = async (req, res) => {
    const { longUrl, customAlias, topic } = req.body;
    
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const userId = req.user.googleId;

    try {
        const shortUrl = customAlias ||nanoid(8);
        const newShortUrl = await ShortUrl.create({
            longUrl,
            shortUrl,
            customAlias,
            topic,
            userId,
        });

        return res.status(201).json({
            shortUrl: newShortUrl.shortUrl,
            createdAt: newShortUrl.createdAt
        });
    } catch (err) {
        console.error('URL creation error:', err);
        return res.status(500).json({ error: 'Failed to create short URL' });
    }
}


export const getShortUrl = async (req, res) => {
    const { alias } = req.params;
  
    try {
      const cacheKey = `shortUrl:${alias}`;
  
      // Check Redis for cached long URL
      const cachedLongUrl = await redisClient.get(cacheKey);
  
      if (cachedLongUrl) {
        // Track analytics even if it's cached
        const userAgent = req.headers['user-agent'];
        await updateAnalytics(alias, userAgent);
        return res.redirect(cachedLongUrl);
      }
      
      const shortUrl = await ShortUrl.findOne({ shortUrl: alias });
  
      if (!shortUrl) {
        return res.status(404).json({ error: 'Short URL not found' });
      }
  
      await redisClient.set(cacheKey, shortUrl.longUrl, 'EX', 3600); // TTL of 3600 seconds
  
      const userAgent = req.headers['user-agent'];
      await updateAnalytics(shortUrl.shortUrl, userAgent);
  
      return res.redirect(shortUrl.longUrl);
    } catch (err) {
      console.error('URL fetch error:', err);
      return res.status(500).json({ error: 'Error fetching short URL' });
    }
  }
