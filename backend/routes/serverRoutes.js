// backend/routes/serverRoutes.js

const express = require('express');
const router = express.Router();
const { Server, ServerStats, User } = require('../models'); // Correctly import models
const { isAuthenticated } = require('../middleware/auth'); // Correctly import middleware

// Get all servers for the authenticated user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    console.log('Authenticated user ID:', req.user.id); // Log user ID

    const servers = await Server.findAll({ where: { ownerId: req.user.id } });
    console.log('Fetched servers:', servers); // Log fetched servers

    res.json(servers);
  } catch (error) {
    console.error('Error fetching servers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get stats for a specific server
router.get('/:id/stats', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const server = await Server.findOne({
      where: { id },
      include: [{ model: ServerStats, as: 'stats' }],
    });

    if (!server) {
      return res.status(404).json({ message: 'Server not found.' });
    }

    res.json(server.stats);
  } catch (error) {
    console.error('Error fetching server stats:', error);
    res.status(500).json({ message: 'Failed to fetch server stats.', error: error.message });
  }
});

// Update server stats (can be called by the bot)
router.put('/:id/stats', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { memberCount, onlineMembers } = req.body;

  try {
    const server = await Server.findOne({ where: { id } });
    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    let stats = await ServerStats.findOne({ where: { ServerId: server.id } });
    if (!stats) {
      stats = await ServerStats.create({ ServerId: server.id });
    }

    if (memberCount !== undefined) stats.memberCount = memberCount;
    if (onlineMembers !== undefined) stats.onlineMembers = onlineMembers;
    await stats.save();

    res.json({ message: 'Server stats updated successfully.', stats });
  } catch (error) {
    console.error('Error updating server stats:', error);
    res.status(500).json({ message: 'Failed to update server stats.', error: error.message });
  }
});

// GET /api/servers/me/users - Fetch users on the authenticated user's server
router.get('/me/users', isAuthenticated, async (req, res) => {
  try {
    const serverId = req.user.serverId; // Ensure you have serverId in user context
    if (!serverId) {
      return res.status(400).json({ error: 'Server ID not associated with the user.' });
    }

    // Fetch server-specific command settings if needed
    // ...

    // Fetch server-specific feature settings if needed
    // ...

    // Fetch server users
    const users = await User.findAll({
      where: { serverId: serverId },
      attributes: ['id', 'username', 'discriminator'],
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching server users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
