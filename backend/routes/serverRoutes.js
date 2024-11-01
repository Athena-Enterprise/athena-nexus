// backend/routes/serverRoutes.js

const express = require('express');
const router = express.Router();
const { Server } = require('../models'); // Correctly import Server from models
const { ensureAuthenticated } = require('../middleware/auth'); // Import from middleware/auth

// Get all servers for the authenticated user
router.get('/', ensureAuthenticated, async (req, res) => {
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
router.get('/:id/stats', ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const server = await Server.findOne({
      where: { id },
      include: [{ model: require('../models').ServerStats, as: 'stats' }],
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
router.put('/:id/stats', ensureAuthenticated, async (req, res) => { // Added ensureAuthenticated
  const { id } = req.params;
  const { memberCount, onlineMembers } = req.body;

  try {
    const server = await Server.findOne({ where: { id } });
    if (!server) {
      return res.status(404).json({ message: 'Server not found.' });
    }

    let stats = await require('../models').ServerStats.findOne({ where: { ServerId: server.id } });
    if (!stats) {
      stats = await require('../models').ServerStats.create({ ServerId: server.id });
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

module.exports = router;
