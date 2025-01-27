import { RateLimiterRedis } from 'rate-limiter-flexible';
import redisClient from '../utils/redisClient.js';


const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware', // Prefix for Redis keys
  points: 50,              // 50 requests
  duration: 3600,            // Per 1 hour
});

export const rateLimiterMiddleware = async (req, res, next) => {
  try {
    const key = req.ip;
   // console.log('Key:', key);
    await rateLimiter.consume(key); 
    next(); 
  } catch (err) {
    if (err instanceof Error) {
      console.error('Rate limiter error:', err);
    }
    res.status(429).json({
      message: 'Too many requests. Please try again later.',
    });
  }
};
