// backend/utils/updateAllGuildCommands.js

const { deployCommands } = require('./deploy-commands');
const { Server } = require('../models');

/**
 * Updates commands for all guilds based on their premium status.
 * @param {string} clientId - Discord application client ID.
 * @param {string} token - Discord bot token.
 */
const updateAllGuildCommands = async (clientId, token) => {
  try {
    // Fetch all servers from the database
    const servers = await Server.findAll();

    for (const server of servers) {
      const guildId = server.id;
      const isPremium = server.premium;

      await deployCommands(clientId, guildId, token, isPremium);
    }

    console.log('All guild commands have been updated successfully.');
  } catch (error) {
    console.error('Error updating all guild commands:', error);
  }
};

module.exports = { updateAllGuildCommands };
