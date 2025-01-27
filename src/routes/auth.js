import express from 'express';
import passport from 'passport';

const router = express.Router();

//#1
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], accessType: 'offline' }));

//#2
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/auth/google',
  }), (req, res) => {
    res.redirect('/api/dashboard');
  });



//#3
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error logging out' });
    }
   // res.redirect('/login');
    return res.status(200).json({
        message: 'Successfully logged out!',
      });
  });
});


export default router;
