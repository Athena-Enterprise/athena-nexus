// backend/bot/commands/serverinfo.js

const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const { Server, ServerStats } = require(path.resolve(__dirname, '../../models')); // Corrected path

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Displays information about the server.'),
  
  async execute(interaction, sequelize) {
    try {
      const id = interaction.guild.id;
      const server = await Server.findOne({
        where: { id },
        include: [{ model: ServerStats, as: 'stats' }],
      });

      if (!server || !server.stats) {
        return interaction.reply('Server information not found.');
      }

      const info = `
        **Server Name:** ${server.name}
        **Owner ID:** ${server.ownerId}
        **Member Count:** ${server.stats.memberCount}
        **Online Members:** ${server.stats.onlineMembers}
        **Premium Status:** ${server.premium ? 'Active' : 'Inactive'}
      `;

      await interaction.reply(info);
    } catch (error) {
      console.error('Error fetching server info:', error);
      await interaction.reply({ content: 'There was an error fetching the server info.', ephemeral: true });
    }
  },
};
