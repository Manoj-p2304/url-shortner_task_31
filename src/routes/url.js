import express from 'express';
import { createShortUrl, getShortUrl } from '../controllers/shortUrlController.js';


const router = express.Router();

router.post('/shorten', createShortUrl);  // Post request to create short URL
router.get('/:alias', getShortUrl);       // Get request to resolve short URL


export default router;
