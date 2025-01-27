import redisClient from "../utils/redisClient.js";

export const cacheMiddleware = async (req, res, next) => {
  const key = req.originalUrl; // Use the request URL as the cache key
  const cachedData = await redisClient.get(key);

  if (cachedData) {
    console.log('Loaded from redis cache:', key); 
    return res.json(JSON.parse(cachedData));
  }

  console.log('fetch from database:', key);
  res.sendResponse = res.json; 
  res.json = (body) => {
    redisClient.set(key, JSON.stringify(body), 'EX', 3600); // Cache for 1 hour
    res.sendResponse(body);
  };

  next();
};

