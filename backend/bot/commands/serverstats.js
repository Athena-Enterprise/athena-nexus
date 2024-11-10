
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverstats')
    .setDescription('Displays statistics about the server.'),
  async execute(interaction) {
    undefined
  },
};
