import { createShortUrl, getShortUrl } from '../controllers/shortUrlController';
import ShortUrl from '../models/ShortUrl';
import redisClient from '../utils/redisClient';
import { updateAnalytics } from '../controllers/analyticsController';
import { jest } from '@jest/globals';

jest.mock('../models/ShortUrl');
jest.mock('../utils/redisClient');
jest.mock('../controllers/analyticsController');
jest.mock('nanoid', () => ({
  nanoid: () => 'mockedNanoId'
}));

describe('URL Shortener Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {},
      user: {
        googleId: 'testUserId'
      },
      headers: {},
      params: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      redirect: jest.fn()
    };
  });

  describe('createShortUrl', () => {
    it('should create a short URL successfully', async () => {
      const mockShortUrl = {
        shortUrl: 'abc123',
        createdAt: new Date(),
        longUrl: 'https://example.com'
      };

      req.body = {
        longUrl: 'https://example.com',
        topic: 'test'
      };

      ShortUrl.create.mockResolvedValue(mockShortUrl);

      await createShortUrl(req, res);

      expect(ShortUrl.create).toHaveBeenCalledWith({
        longUrl: 'https://example.com',
        shortUrl: 'mockedNanoId',
        customAlias: undefined,
        topic: 'test',
        userId: 'testUserId'
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        shortUrl: mockShortUrl.shortUrl,
        createdAt: mockShortUrl.createdAt
      });
    });

    it('should create a short URL with custom alias', async () => {
      const mockShortUrl = {
        shortUrl: 'custom',
        createdAt: new Date(),
        longUrl: 'https://example.com'
      };

      req.body = {
        longUrl: 'https://example.com',
        customAlias: 'custom',
        topic: 'test'
      };

      ShortUrl.create.mockResolvedValue(mockShortUrl);

      await createShortUrl(req, res);

      expect(ShortUrl.create).toHaveBeenCalledWith({
        longUrl: 'https://example.com',
        shortUrl: 'custom',
        customAlias: 'custom',
        topic: 'test',
        userId: 'testUserId'
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      req.user = null;

      await createShortUrl(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
    });

    it('should handle database errors', async () => {
      req.body = {
        longUrl: 'https://example.com'
      };

      ShortUrl.create.mockRejectedValue(new Error('Database error'));

      await createShortUrl(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create short URL' });
    });
  });

  describe('getShortUrl', () => {
    it('should redirect to cached URL if exists in Redis', async () => {
      req.params.alias = 'abc123';
      req.headers['user-agent'] = 'test-agent';

      redisClient.get.mockResolvedValue('https://cached-example.com');

      await getShortUrl(req, res);

      expect(redisClient.get).toHaveBeenCalledWith('shortUrl:abc123');
      expect(updateAnalytics).toHaveBeenCalledWith('abc123', 'test-agent');
      expect(res.redirect).toHaveBeenCalledWith('https://cached-example.com');
    });

    it('should fetch from database and cache if not in Redis', async () => {
      req.params.alias = 'abc123';
      req.headers['user-agent'] = 'test-agent';

      redisClient.get.mockResolvedValue(null);
      ShortUrl.findOne.mockResolvedValue({
        shortUrl: 'abc123',
        longUrl: 'https://example.com'
      });

      await getShortUrl(req, res);

      expect(ShortUrl.findOne).toHaveBeenCalledWith({ shortUrl: 'abc123' });
      expect(redisClient.set).toHaveBeenCalledWith(
        'shortUrl:abc123',
        'https://example.com',
        'EX',
        3600
      );
      expect(updateAnalytics).toHaveBeenCalledWith('abc123', 'test-agent');
      expect(res.redirect).toHaveBeenCalledWith('https://example.com');
    });

    it('should return 404 if URL not found', async () => {
      req.params.alias = 'nonexistent';

      redisClient.get.mockResolvedValue(null);
      ShortUrl.findOne.mockResolvedValue(null);

      await getShortUrl(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Short URL not found' });
    });

    it('should handle database errors', async () => {
      req.params.alias = 'abc123';

      redisClient.get.mockRejectedValue(new Error('Redis error'));

      await getShortUrl(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching short URL' });
    });
  });
});