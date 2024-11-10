
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong! and some fun stats.'),
  async execute(interaction) {
    undefined
  },
};
