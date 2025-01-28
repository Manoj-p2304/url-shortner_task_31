import redisClient from "../utils/redisClient.js";

export const clearCache = async (req, res) => {
  try {
    await redisClient.flushDb(); // Clears all data from the current Redis database
    res.json({ message: 'Redis cache cleared successfully!' });
  } catch (err) {
    console.error('Error flushing Redis:', err);
    res.status(500).json({ error: 'Failed to clear Redis cache' });
  }
};
