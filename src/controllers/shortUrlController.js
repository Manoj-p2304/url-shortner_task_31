import ShortUrl from '../models/ShortUrl.js';
import { nanoid } from 'nanoid';
import isAuthenticated from '../middleware/auth.js';
import { updateAnalytics } from './analyticsController.js';

export const createShortUrl = async (req, res) => {
    console.log("started")
    const { longUrl, customAlias, topic } = req.body;
    
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const userId = req.user.googleId;
    console.log("userId", userId)

    try {
        const shortUrl = nanoid(8);
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
            const shortUrl = await ShortUrl.findOne({ shortUrl: alias });
            
            if (!shortUrl) {
                return res.status(404).json({ error: 'Short URL not found' });
            }
            
            // Track analytics for this short URL
            const userAgent = req.headers['user-agent']; // Get user-agent for tracking
            await updateAnalytics(shortUrl.alias, userAgent);
            
            return res.redirect(shortUrl.longUrl);
        } catch (err) {
            console.error('URL fetch error:', err);
            return res.status(500).json({ error: 'Error fetching short URL' });
        }
    };
    
