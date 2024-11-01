// backend/bot/commands/serverstats.js

const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const { Server, ServerStats } = require(path.resolve(__dirname, '../../models')); // Corrected path

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverstats')
    .setDescription('Displays statistics about the server.'),
  
  async execute(interaction, sequelize) {
    try {
      const id = interaction.guild.id;
      const server = await Server.findOne({
        where: { id },
        include: [{ model: ServerStats, as: 'stats' }],
      });

      if (!server || !server.stats) {
        return interaction.reply('Server statistics not found.');
      }

      const info = `
        **Server Name:** ${server.name}
        **Member Count:** ${server.stats.memberCount}
        **Online Members:** ${server.stats.onlineMembers}
        **Premium Status:** ${server.premium ? 'Active' : 'Inactive'}
      `;

      await interaction.reply(info);
    } catch (error) {
      console.error('Error fetching server stats:', error);
      await interaction.reply({ content: 'There was an error fetching the server stats.', ephemeral: true });
    }
  },
};
