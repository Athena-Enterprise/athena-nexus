// backend/bot/commands/updateallcommands.js

const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const { updateAllGuildCommands } = require('../utils/updateAllGuildCommands');
const { Server } = require('../../models/index');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('updateallcommands')
    .setDescription('Updates commands for all guilds based on their premium status.'),
  
  async execute(interaction, sequelize) {
    try {
      // Fetch all servers
      const servers = await Server.findAll();

      // Create a map of guildId to premium status
      const isPremiumMap = new Map();
      servers.forEach(server => {
        isPremiumMap.set(server.id, server.premium);
      });

      // Deploy commands to all guilds
      await updateAllGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.BOT_TOKEN,
        isPremiumMap
      );

      await interaction.reply('All guild commands have been updated successfully.');
    } catch (error) {
      console.error('Error updating all guild commands:', error);
      await interaction.reply({ content: 'There was an error updating all guild commands.', ephemeral: true });
    }
  },
};
