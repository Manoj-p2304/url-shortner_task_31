// src/utils/redisClient.js
import { createClient } from 'redis';

// Initialize Redis client
const redisClient = createClient({
  socket: {
    host: '127.0.0.1', // Replace with your Redis server host
    port: 6379,        // Default Redis port
  },
});

// Handle errors
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
})();

export default redisClient;
