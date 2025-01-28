import redisClient from "../utils/redisClient.js";

// Cache Middleware with proper error handling and TTL
export const cacheMiddleware = async (req, res, next) => {
  const key = req.originalUrl;

  try {
    // Check if the data is already cached in Redis
    const cachedData = await redisClient.get(key);

    if (cachedData) {
      console.log(`Cache hit: ${key}`);
      return res.json(JSON.parse(cachedData)); // Serve from cache if data is available
    }

    console.log(`Cache miss: ${key}`);

    // Intercept the res.json function to store the response in Redis before sending
    res.sendResponse = res.json;
    res.json = async (body) => {
        console.log('Response body to cache:', body);
      try {
        // Cache the data with TTL of 100 seconds (1 hour)
        await redisClient.set(key, JSON.stringify(body), 'EX', 1000); // Cache for 100 seconds
        console.log(`Cached new data for: ${key}`);
        res.sendResponse(body);
      } catch (err) {
        console.error(`Error caching data for ${key}:`, err);
      }
    };

    next(); // Continue processing the request and calling the next middleware/controller
  } catch (err) {
    console.error('Redis cache error:', err);
    return res.status(500).json({ error: 'Error fetching data from cache' });
  }
};
