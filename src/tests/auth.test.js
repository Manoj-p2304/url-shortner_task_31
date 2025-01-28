import request from 'supertest';
import app from '../app.js';
import { jest } from '@jest/globals';
import redisClient from '../utils/redisClient';

jest.mock('passport', () => ({
  authenticate: jest.fn((strategy, options) => (req, res, next) => {
    if (strategy === 'google') {
      if (req.query.error) {
        res.redirect('/auth/google'); // Simulate failure
      } else {
        req.user = { id: 'mock-user-id', email: 'test@example.com' }; // Simulate success
        next();
      }
    }
  }),
}));

    afterAll(async () => {
        await redisClient.quit(); // Ensure Redis connection is closed
      });


describe('Authentication API', () => {
  it('should redirect to Google OAuth login page', async () => {
    const res = await request(app).get('/auth/google').expect(302);
    expect(res.headers.location).toContain('https://accounts.google.com');
  });

  it('should redirect back to login on failure', async () => {
    const res = await request(app)
      .get('/auth/google/callback?error=true') 
      .expect(500);
      expect(res.body.error).toBe('Internal Server Error');
  });

  it('should log out successfully', async () => {
    const res = await request(app).get('/auth/logout').expect(200);
    expect(res.body.message).toBe('Successfully logged out!');
  });

});
