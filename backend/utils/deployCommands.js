// backend/utils/deployCommands.js

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const path = require('path');
const { Command } = require('../models'); // Adjust path if necessary
const logger = require('./logger'); // Ensure correct path
const fs = require('fs'); // **Added**

/**
 * Deploys commands to a guild based on premium status.
 * @param {string} clientId - Discord application client ID.
 * @param {string} guildId - Discord guild ID.
 * @param {string} token - Discord bot token.
 * @param {boolean} isPremium - Whether the guild is premium.
 */
const deployCommands = async (clientId, guildId, token, isPremium) => {
  try {
    // Fetch enabled commands from the database based on premium status
    let commands;
    if (isPremium) {
      // For premium guilds, fetch all enabled commands (both free and premium)
      commands = await Command.findAll({
        where: {
          enabled: true,
          status: 'active',
        },
      });
    } else {
      // For non-premium guilds, fetch enabled commands that are not premium-only
      commands = await Command.findAll({
        where: {
          enabled: true,
          premiumOnly: false,
          status: 'active',
        },
      });
    }

    // Convert command data to JSON
    const commandData = commands.map(cmd => {
      const commandPath = path.join(__dirname, '../bot/commands', `${cmd.name}.js`);
      if (fs.existsSync(commandPath)) {
        const command = require(commandPath);
        return command.data.toJSON();
      } else {
        logger.warn(`Command file not found: ${commandPath}`);
        return null;
      }
    }).filter(cmd => cmd !== null); // Remove null entries

    const rest = new REST({ version: '10' }).setToken(token);

    logger.info(`Started refreshing application (/) commands for guild ${guildId}.`);

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commandData },
    );

    logger.info(`Successfully reloaded application (/) commands for guild ${guildId}.`);
  } catch (error) {
    logger.error(`Error deploying commands for guild ${guildId}:`, error);
  }
};

module.exports = { deployCommands };