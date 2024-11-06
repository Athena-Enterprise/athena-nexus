// backend/middleware/auth.js

const { Server } = require('../models');
const logger = require('../utils/logger');

/**
 * Middleware to check if the user is authenticated.
 */
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  logger.warn('Unauthorized access attempt.');
  return res.status(401).json({ error: 'Unauthorized' });
};

/**
 * Middleware to check if the authenticated user owns the server.
 */
const ownsServer = async (req, res, next) => {
  const { serverId } = req.params;
  try {
    const server = await Server.findByPk(serverId);
    if (!server) {
      logger.warn(`Server not found: ${serverId}`);
      return res.status(404).json({ error: 'Server not found.' });
    }

    if (server.ownerId !== req.user.id) {
      logger.warn(`User ${req.user.id} does not own server ${serverId}`);
      return res.status(403).json({ error: 'Forbidden: You do not own this server.' });
    }

    // Attach server to req for later use
    req.server = server;
    next();
  } catch (error) {
    logger.error(`Error in ownsServer middleware: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { isAuthenticated, ownsServer };
