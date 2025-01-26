import express from 'express';
import { createShortUrl, getShortUrl } from '../controllers/shortUrlController.js';
import isAuthenticated from '../middleware/auth.js';
import { getSpecificUrlAnalytics , getOverallAnalytics } from '../controllers/analyticsController.js';


const router = express.Router();

router.post('/create',isAuthenticated,createShortUrl);
router.get('/shorten/:alias', isAuthenticated,getShortUrl);
router.get('/analytics/overall', isAuthenticated, getOverallAnalytics); // Specific route first
router.get('/analytics/:alias', isAuthenticated, getSpecificUrlAnalytics); // General route last



export default router;
