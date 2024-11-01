// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const passport = require('passport'); // Ensure passport is configured
const authController = require('../controllers/authController');

// Email/password authentication routes
router.post('/login', authController.emailLogin);
router.post('/signup', authController.emailSignup);
router.get('/verify-email', authController.verifyEmail);

// Discord OAuth Route
router.get('/discord', passport.authenticate('discord'));

// Discord OAuth Callback Route
router.get('/discord/callback',
  passport.authenticate('discord', { failureRedirect: 'http://localhost:3000/login' }),
  (req, res) => {
    // Successful authentication, redirect to frontend dashboard
    res.redirect('http://localhost:3000/dashboard');
  }
);

// Route for connecting Discord account
router.get(
  '/discord/connect',
  passport.authorize('discord', { scope: ['identify', 'guilds'] })
);
router.get(
  '/discord/connect/callback',
  passport.authorize('discord', { failureRedirect: '/settings' }),
  authController.discordConnectCallback
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    req.session.destroy(err => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({ error: 'Failed to destroy session' });
      }
      res.clearCookie('connect.sid'); // Replace 'connect.sid' if your session cookie name is different
      res.status(200).json({ message: 'Logout successful' });
    });
  });
});

module.exports = router;
