// backend/controllers/authController.js

const { User } = require('../models');

exports.discordConnectCallback = (req, res) => {
  // Successful account linking, redirect to settings or desired route
  res.redirect('http://localhost:3000/settings');
};
