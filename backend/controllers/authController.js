// backend/controllers/authController.js

const { User } = require('../models');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.emailLogin = async (req, res, next) => {
  // Passport LocalStrategy handles authentication
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (!user) {
      return res.status(400).json({ message: info.message || 'Login failed' });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Login failed' });
      }
      // Send user data as response
      return res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin } });
    });
  })(req, res, next);
};

exports.emailSignup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    user = await User.create({
      username,
      email,
      passwordHash: hashedPassword,
      isAdmin: false, // Default to non-admin
      isPremium: false,
    });

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required.' });
    }

    const user = await User.findOne({ where: { emailVerificationToken: token } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token.' });
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    await user.save();

    res.json({ message: 'Email verified successfully.' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.discordCallback = (req, res) => {
  // Successful authentication, redirect to dashboard or desired route
  res.redirect('/dashboard');
};

exports.discordConnectCallback = (req, res) => {
  // Successful account linking, redirect to settings or desired route
  res.redirect('/settings');
};
