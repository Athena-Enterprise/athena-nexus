// backend/routes/serverCommandRoutes.js

const express = require('express');
const router = express.Router();
const { ServerCommand, Command, Server, Feature } = require('../models');
const { isAuthenticated } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const { deployCommands } = require('../utils/deploy-commands'); // Adjust path if necessary

// Middleware to ensure the user owns the server
const ownsServer = async (req, res, next) => {
  const serverId = req.params.serverId;
  try {
    const server = await Server.findOne({ where: { id: serverId, ownerId: req.user.id } });
    if (!server) {
      return res.status(403).json({ error: 'Forbidden: You do not own this server.' });
    }
    req.server = server;
    next();
  } catch (error) {
    console.error('Error in ownsServer middleware:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/servers/:serverId/commands - Fetch all commands with their enabled status for the server
router.get('/:serverId/commands', isAuthenticated, ownsServer, async (req, res) => {
  const serverId = req.params.serverId;

  try {
    // Fetch all commands with their features
    const commands = await Command.findAll({
      include: [{
        model: Feature,
        as: 'feature',
        attributes: ['id', 'name', 'status', 'enabled'],
      }],
    });

    // Fetch server-specific command settings
    const serverCommands = await ServerCommand.findAll({
      where: { serverId },
      attributes: ['commandId', 'enabled'],
    });

    const serverCommandMap = new Map();
    serverCommands.forEach(sc => {
      serverCommandMap.set(sc.commandId, sc.enabled);
    });

    // Determine effective command status
    const effectiveCommands = commands.map(cmd => {
      // Check global status
      if (cmd.status !== 'active') {
        return { id: cmd.id, name: cmd.name, description: cmd.description, enabled: false, status: cmd.status };
      }

      // Check if feature is active
      if (cmd.feature.status !== 'active') {
        return { id: cmd.id, name: cmd.name, description: cmd.description, enabled: false, status: cmd.feature.status };
      }

      // Check feature's global enabled status
      if (!cmd.feature.enabled) {
        return { id: cmd.id, name: cmd.name, description: cmd.description, enabled: false, status: cmd.feature.status };
      }

      // Check server-specific enabled status
      const serverEnabled = serverCommandMap.has(cmd.id) ? serverCommandMap.get(cmd.id) : cmd.enabled;

      // Determine if the command should be enabled
      return { id: cmd.id, name: cmd.name, description: cmd.description, enabled: serverEnabled, status: cmd.status };
    });

    res.json(effectiveCommands);
  } catch (error) {
    console.error('Error fetching server-specific commands:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/servers/:serverId/commands/:commandId - Toggle a command's enabled status for the server
router.put(
    '/:serverId/commands/:commandId',
    isAuthenticated,
    ownsServer,
    [
      body('enabled').isBoolean().withMessage('Enabled must be a boolean'),
    ],
    async (req, res) => {
      const { serverId, commandId } = req.params;
      const { enabled } = req.body;
  
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        // Ensure the command exists
        const command = await Command.findByPk(commandId, {
          include: [{
            model: Feature,
            as: 'feature',
            attributes: ['id', 'name', 'status', 'enabled'],
          }],
        });
        if (!command) {
          return res.status(404).json({ error: 'Command not found.' });
        }
  
        // Check if feature is active and enabled globally
        const feature = command.feature;
        if (!feature || feature.status !== 'active' || !feature.enabled) {
          return res.status(400).json({ error: 'Cannot enable/disable commands for inactive or disabled features.' });
        }
  
        // Find or create the ServerCommand entry
        let serverCommand = await ServerCommand.findOne({ where: { serverId, commandId } });
        if (!serverCommand) {
          serverCommand = await ServerCommand.create({ serverId, commandId, enabled });
        } else {
          serverCommand.enabled = enabled;
          await serverCommand.save();
        }
  
        // After saving, trigger command updates on Discord for this guild
        const server = await Server.findByPk(serverId);
        const { DISCORD_CLIENT_ID, BOT_TOKEN } = process.env;
  
        if (!DISCORD_CLIENT_ID || !BOT_TOKEN) {
          console.error('Discord Client ID or Bot Token not set in environment variables.');
          return res.status(500).json({ error: 'Discord configuration missing.' });
        }
  
        await deployCommands(DISCORD_CLIENT_ID, serverId, BOT_TOKEN, server.premium);
  
        res.json({ message: 'Command status updated successfully and Discord commands deployed.', serverCommand });
      } catch (error) {
        console.error('Error updating server-specific command:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  );

module.exports = router;
