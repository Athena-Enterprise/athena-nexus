// backend/routes/serverRoutes.js

const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const serverController = require('../controllers/serverController');

// Get all servers for the authenticated user
router.get('/', isAuthenticated, serverController.getAllServers);

// Get stats for a specific server
router.get(
  '/:serverId/stats',
  isAuthenticated,
  hasRole(['owner', 'admin', 'moderator', 'member']),
  serverController.getServerStats
);

// Update server stats (can be called by users with 'owner' or 'admin' roles)
router.put(
  '/:serverId/stats',
  isAuthenticated,
  hasRole(['owner', 'admin']),
  serverController.updateServerStats
);

// Fetch users on the specified server
router.get(
  '/:serverId/users',
  isAuthenticated,
  hasRole(['owner', 'admin', 'moderator']),
  serverController.getServerUsers
);

// Update a member's role
router.put(
  '/:serverId/members/:userId',
  isAuthenticated,
  hasRole(['owner']),
  serverController.updateMemberRole
);

module.exports = router;
