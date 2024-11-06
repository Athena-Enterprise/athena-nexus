// backend/utils/deployCommands.js

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const path = require('path');
const { Command, ServerCommand } = require('../models'); // Include ServerCommand
const logger = require('./logger');
const fs = require('fs');

/**
 * Deploys commands to a specific guild based on server status and tier.
 * @param {string} clientId - Discord application client ID.
 * @param {string} guildId - Discord guild ID.
 * @param {string} token - Discord bot token.
 * @param {boolean} isPremium - Whether the guild is premium.
 * @param {string} serverTier - The tier of the server (free, community, enterprise).
 */
const deployCommands = async (clientId, guildId, token, isPremium, serverTier) => {
  try {
    // Define tier-based command inclusion
    const tierCommandFilters = {
      free: { premiumOnly: false },
      community: { premiumOnly: false }, // Adjust based on your requirements
      enterprise: { premiumOnly: true }, // Enterprise can access all commands
    };

    // Base filter for commands
    const baseFilter = {
      status: 'active',
    };

    // Fetch all ServerCommands for this server where enabled is true
    const enabledServerCommands = await ServerCommand.findAll({
      where: { serverId: guildId, enabled: true },
      include: [{
        model: Command,
        as: 'command',
        where: {
          ...baseFilter,
          ...tierCommandFilters[serverTier],
        },
        required: true,
      }],
    });

    // Additionally, if the server is premium, include premiumOnly commands
    let commands = enabledServerCommands.map(sc => sc.command);

    if (isPremium) {
      const premiumServerCommands = await ServerCommand.findAll({
        where: { serverId: guildId, enabled: true },
        include: [{
          model: Command,
          as: 'command',
          where: {
            ...baseFilter,
            premiumOnly: true,
          },
          required: true,
        }],
      });
      // Merge premium commands, avoiding duplicates
      premiumServerCommands.forEach(sc => {
        if (!commands.some(cmd => cmd.name === sc.command.name)) {
          commands.push(sc.command);
        }
      });
    }

    // Remove duplicate commands by name
    const uniqueCommandsMap = new Map();
    commands.forEach(cmd => {
      if (!uniqueCommandsMap.has(cmd.name)) {
        uniqueCommandsMap.set(cmd.name, cmd);
      }
    });
    const uniqueCommands = Array.from(uniqueCommandsMap.values());

    // Convert command data to JSON
    const commandData = uniqueCommands.map(cmd => {
      const commandPath = path.join(__dirname, '../bot/commands', `${cmd.name}.js`);
      if (fs.existsSync(commandPath)) {
        const command = require(commandPath);
        return command.data.toJSON();
      } else {
        logger.warn(`Command file not found: ${commandPath}`);
        return null;
      }
    }).filter(cmd => cmd !== null); // Remove null entries

    logger.info(`Commands to deploy to guild ${guildId}: ${JSON.stringify(commandData)}`);

    const rest = new REST({ version: '10' }).setToken(token);

    logger.info(`Started refreshing application (/) commands for guild ${guildId}.`);

    const discordResponse = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commandData },
    );

    logger.info(`Successfully reloaded application (/) commands for guild ${guildId}. Discord response:`, discordResponse);
  } catch (error) {
    if (error.response) {
      // Discord API responded with an error
      logger.error(`Discord API error during deployCommands for guild ${guildId}:`, error.response.data);
    } else {
      // Other errors (network issues, etc.)
      logger.error(`Error deploying commands for guild ${guildId}:`, error.message);
    }
  }
};

module.exports = deployCommands;
