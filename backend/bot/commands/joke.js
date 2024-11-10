
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Tells you a random joke.'),
  async execute(interaction) {
    undefined
  },
};
