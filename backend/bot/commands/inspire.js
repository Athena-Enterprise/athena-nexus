
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inspire')
    .setDescription('Sends an inspirational quote.'),
  async execute(interaction) {
    undefined
  },
};
