import express from 'express';
import passport from 'passport';

const router = express.Router();

// Redirect to Google Sign-In
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], accessType: 'offline' }));

// Route to handle callback
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/',
  }), (req, res) => {
   // console.log(res)
    // Once authenticated
    // console, redirect to the dashboard (or any page)
    res.redirect('/dashboard');
  });

  
  

// Logout
router.get('/logout', passport.authenticate('google', {
    failureRedirect: '/',
  }), (req, res) => {
    // Once authenticated, redirect to the dashboard (or any page)
    res.redirect('/');
  });


export default router;
