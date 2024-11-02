// backend/bot/commands/setpremium.js

const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const { Server } = require(path.resolve(__dirname, '../../models')); // Corrected path
const { deployCommands } = require('../../utils/deploy-commands'); // Corrected path and naming

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setpremium')
    .setDescription('Set the server as premium.')
    .addBooleanOption(option => 
      option.setName('premium')
        .setDescription('Set to true to make premium, false to remove premium')
        .setRequired(true)),
  
  async execute(interaction, sequelize) {
    try {
      const premium = interaction.options.getBoolean('premium');
      const id = interaction.guild.id;

      const server = await Server.findOne({ where: { id } });
      if (!server) {
        return interaction.reply('Server not found.');
      }

      server.premium = premium;
      await server.save();

      // Deploy commands based on new premium status
      await deployCommands(
        process.env.DISCORD_CLIENT_ID,
        id,
        process.env.BOT_TOKEN,
        premium
      );

      return interaction.reply(`Premium status has been ${premium ? 'enabled' : 'disabled'} for this server.`);
    } catch (error) {
      console.error('Error setting premium status:', error);
      await interaction.reply({ content: 'There was an error setting the premium status.', ephemeral: true });
    }
  },
};
