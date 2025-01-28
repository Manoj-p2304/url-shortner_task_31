import express from 'express';
import { createShortUrl, getShortUrl } from '../controllers/shortUrlController.js';
import isAuthenticated from '../middleware/auth.js';
import { getSpecificUrlAnalytics , getOverallAnalytics , getTopicAnalytics  } from '../controllers/analyticsController.js';
import { rateLimiterMiddleware } from '../middleware/rateLimiter.js';
import { cacheMiddleware } from '../middleware/redisCache.js';
import { dashboard } from '../controllers/dashboard.js';
import { clearCache } from '../controllers/redisdbController.js';


const router = express.Router();

router.post('/shorten',isAuthenticated,createShortUrl);
router.get('/shorten/:alias', isAuthenticated,cacheMiddleware,rateLimiterMiddleware,getShortUrl);
router.get('/analytics/overall', isAuthenticated,rateLimiterMiddleware, getOverallAnalytics);
router.get('/analytics/:alias', isAuthenticated,rateLimiterMiddleware, getSpecificUrlAnalytics); 
router.get('/analytics/topic/:topic', isAuthenticated,rateLimiterMiddleware, getTopicAnalytics);
router.get('/dashboard',isAuthenticated, dashboard);
router.get('/clear-cache',isAuthenticated, clearCache);


export default router;
