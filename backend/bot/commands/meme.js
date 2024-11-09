// backend/bot/commands/meme.js

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Sends a random meme.'),
  premiumOnly: false,
  status: 'active',
  tier: 'free',
  async execute(interaction) {
    try {
      await interaction.deferReply();
      const response = await axios.get('https://meme-api.com/gimme');
      const meme = response.data;
      const embed = new EmbedBuilder()
        .setTitle(meme.title)
        .setURL(meme.postLink)
        .setImage(meme.url)
        .setFooter({ text: `From r/${meme.subreddit}` });
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching meme:', error);
      await interaction.editReply('Sorry, I couldn\'t fetch a meme right now.');
    }
  },
};
