const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

// Initialize Passport
require('../config/passport');

// Discord OAuth Route
router.get('/discord', passport.authenticate('discord'));

// Discord OAuth Callback Route
router.get(
  '/discord/callback',
  passport.authenticate('discord', { failureRedirect: 'http://localhost:3000/login' }),
  (req, res) => {
    // Successful authentication, redirect to frontend dashboard
    res.redirect('http://localhost:3000/dashboard');
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({ error: 'Failed to destroy session' });
      }
      res.clearCookie('connect.sid'); // Adjust if your session cookie name is different
      res.status(200).json({ message: 'Logout successful' });
    });
  });
});

module.exports = router;
