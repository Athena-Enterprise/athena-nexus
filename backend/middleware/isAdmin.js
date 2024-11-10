// backend/middleware/isAdmin.js

const logger = require('../utils/logger'); // Ensure logger is imported

const isAdmin = (req, res, next) => {
  if (
    req.isAuthenticated &&
    req.isAuthenticated() &&
    req.user &&
    req.user.isAdmin
  ) {
    return next();
  }
  logger.warn(`Forbidden access attempt by user ID: ${req.user ? req.user.id : 'Unknown'}`);
  res.status(403).json({ error: 'Forbidden: Admins only' });
};

module.exports = isAdmin;
