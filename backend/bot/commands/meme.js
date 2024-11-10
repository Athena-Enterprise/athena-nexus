
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Sends a random meme.'),
  async execute(interaction) {
    undefined
  },
};
