// backend/controllers/commandController.js

const { Command, ServerCommand, Feature, Server } = require('../models');

exports.getEnabledCommandsForServer = async (serverId) => {
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

    return effectiveCommands;
  } catch (error) {
    console.error('Error in getEnabledCommandsForServer:', error);
    throw error;
  }
};
