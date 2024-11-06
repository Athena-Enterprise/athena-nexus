// backend/controllers/serverCommandController.js

const { Server, ServerCommand, Command, Feature } = require('../models');
const logger = require('../utils/logger');
const deployCommands = require('../utils/deployCommands'); // Correct import

/**
 * Handler to get all commands for a specific server.
 */
exports.getServerCommands = async (req, res) => {
  const { serverId } = req.params;

  try {
    const server = await Server.findByPk(serverId, {
      include: [{
        model: ServerCommand,
        as: 'serverCommands', // Correct alias
        include: [{
          model: Command,
          as: 'command',
          attributes: ['id', 'name', 'description', 'status', 'premiumOnly'],
        }],
      }],
    });

    if (!server) {
      logger.warn(`Server not found: ${serverId}`);
      return res.status(404).json({ error: 'Server not found.' });
    }

    logger.info(`Server found: ${server.name} (ID: ${server.id})`);
    logger.info(`Number of ServerCommands: ${server.serverCommands.length}`);

    const commands = server.serverCommands.map(sc => ({
      id: sc.command.id,
      name: sc.command.name,
      description: sc.command.description,
      status: sc.command.status,
      premiumOnly: sc.command.premiumOnly,
      enabled: sc.enabled,
    }));

    logger.info(`Commands fetched for server ID: ${serverId}: ${JSON.stringify(commands)}`);
    res.json(commands);
  } catch (error) {
    logger.error(`Error fetching commands for server ID: ${serverId}: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Handler to update the enabled status of a specific command for a server.
 */
exports.updateServerCommand = async (req, res) => {
  const { serverId, commandId } = req.params;
  const { enabled } = req.body;

  // Validate 'enabled' is a boolean
  if (typeof enabled !== 'boolean') {
    logger.warn(`Invalid 'enabled' value: ${enabled} for command ID: ${commandId} on server ID: ${serverId}`);
    return res.status(400).json({ error: "'enabled' must be a boolean." });
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
      logger.warn(`Command not found: ${commandId}`);
      return res.status(404).json({ error: 'Command not found.' });
    }

    // Check if feature is active and enabled globally
    const feature = command.feature;
    if (!feature || feature.status !== 'active' || !feature.enabled) {
      logger.warn(`Attempt to toggle command ID: ${commandId} for inactive or disabled feature.`);
      return res.status(400).json({ error: 'Cannot enable/disable commands for inactive or disabled features.' });
    }

    // Find or create the ServerCommand entry
    let serverCommand = await ServerCommand.findOne({ where: { serverId, commandId } });
    if (!serverCommand) {
      serverCommand = await ServerCommand.create({ serverId, commandId, enabled });
      logger.info(`ServerCommand created: Server ID: ${serverId}, Command ID: ${commandId}, Enabled: ${enabled}`);
    } else {
      serverCommand.enabled = enabled;
      await serverCommand.save();
      logger.info(`ServerCommand updated: Server ID: ${serverId}, Command ID: ${commandId}, Enabled: ${enabled}`);
    }

    // After saving, trigger command updates on Discord for this guild
    const { DISCORD_CLIENT_ID, BOT_TOKEN } = process.env;

    if (!DISCORD_CLIENT_ID || !BOT_TOKEN) {
      logger.error('Discord Client ID or Bot Token not set in environment variables.');
      return res.status(500).json({ error: 'Discord configuration missing.' });
    }

    // Ensure req.server is set by ownsServer middleware
    if (!req.server) {
      logger.error(`req.server is undefined for server ID: ${serverId}`);
      return res.status(500).json({ error: 'Internal server error: Server data missing.' });
    }

    const isPremium = req.server.premium;
    const serverTier = req.server.tier; // Ensure 'tier' is a field in the Server model

    await deployCommands(DISCORD_CLIENT_ID, serverId, BOT_TOKEN, isPremium, serverTier);

    res.json({ message: 'Command status updated successfully and Discord commands deployed.', serverCommand });
  } catch (error) {
    logger.error(`Error updating server-specific command: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};
