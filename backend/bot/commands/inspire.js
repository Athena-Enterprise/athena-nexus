// backend/bot/commands/inspire.js

const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inspire')
    .setDescription('Sends an inspirational quote.'),
  premiumOnly: false,
  status: 'active',
  tier: 'free',
  async execute(interaction) {
    try {
      await interaction.deferReply();
      const response = await axios.get('https://api.quotable.io/random');
      const quote = response.data;
      await interaction.editReply(`"${quote.content}" — *${quote.author}*`);
    } catch (error) {
      console.error('Error fetching quote:', error);
      await interaction.editReply('Sorry, I couldn\'t fetch a quote right now.');
    }
  },
};
