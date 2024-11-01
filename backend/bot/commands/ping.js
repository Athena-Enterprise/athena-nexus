// bot/commands/ping.js

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong Chong!'),
  
  async execute(interaction, sequelize) {
    await interaction.reply('Pong!');
  },
};
