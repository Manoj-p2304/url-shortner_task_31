import express from 'express';
import { createShortUrl, getShortUrl } from '../controllers/shortUrlController.js';
import isAuthenticated from '../middleware/auth.js';
import { getSpecificUrlAnalytics , getOverallAnalytics , getTopicAnalytics  } from '../controllers/analyticsController.js';
import { rateLimiterMiddleware } from '../middleware/rateLimiter.js';
import { cacheMiddleware } from '../middleware/redisCache.js';
import { dashboard } from '../controllers/dashboard.js';


const router = express.Router();

router.post('/shorten',isAuthenticated,createShortUrl);
router.get('/shorten/:alias', isAuthenticated,cacheMiddleware,getShortUrl);
router.get('/analytics/overall', isAuthenticated,cacheMiddleware,rateLimiterMiddleware, getOverallAnalytics); // Specific route first
router.get('/analytics/:alias', isAuthenticated,cacheMiddleware, getSpecificUrlAnalytics); // General route last
router.get('/analytics/topic/:topic', isAuthenticated,cacheMiddleware, getTopicAnalytics);
router.get('/dashboard',isAuthenticated, dashboard);


export default router;
