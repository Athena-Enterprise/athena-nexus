// backend/bot/commands/joke.js

const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Tells you a random joke.'),
  premiumOnly: false,
  status: 'active',
  tier: 'free',
  async execute(interaction) {
    try {
      await interaction.deferReply();
      const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
      const joke = response.data;
      await interaction.editReply(`${joke.setup}\n\n${joke.punchline}`);
    } catch (error) {
      console.error('Error fetching joke:', error);
      await interaction.editReply('Sorry, I couldn\'t fetch a joke right now.');
    }
  },
};
