// backend/routes/premiumRoutes.js

const express = require('express');
const router = express.Router();
const { Server } = require('../models/index');
const { deployCommands } = require('../utils/deployCommands');
require('dotenv').config();

/**
 * Route to update a guild's premium status.
 * Expected JSON body: { "id": "guild_id", "premium": true/false }
 */
router.put('/update', async (req, res) => {
  const { id, premium } = req.body;

  if (!id || typeof premium !== 'boolean') {
    return res.status(400).json({ message: 'Invalid request parameters.' });
  }

  try {
    const server = await Server.findOne({ where: { id } });
    if (!server) {
      return res.status(404).json({ message: 'Guild not found.' });
    }

    server.premium = premium;
    await server.save();

    // Deploy commands based on the new premium status
    await deployCommands(process.env.DISCORD_CLIENT_ID, id, process.env.BOT_TOKEN, premium);

    res.status(200).json({ message: 'Premium status updated and commands deployed successfully.' });
  } catch (error) {
    console.error('Error updating premium status:', error);
    res.status(500).json({ message: 'Failed to update premium status.' });
  }
});

module.exports = router;
