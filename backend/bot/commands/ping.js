// backend/bot/commands/ping.js

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong! and some fun stats.'),
  
  async execute(interaction) {
    try {
      const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
      const latency = sent.createdTimestamp - interaction.createdTimestamp;
      const apiLatency = interaction.client.ws.ping;

      // Create an embed with latency information
      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('🏓 Pong! 🏓')
        .setDescription('Here are your ping stats:')
        .addFields(
          { name: 'Latency', value: `${latency}ms`, inline: true },
          { name: 'API Latency', value: `${apiLatency}ms`, inline: true },
        )
        .setTimestamp()
        .setFooter({ text: 'Ping Pong!', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

      await interaction.editReply({ content: null, embeds: [embed] });

      // Optional: Add a random funny message
      const funnyMessages = [
        'Are you feeling lucky, punk?',
        'Ping! Did you hear that?',
        'Pong! I like your style.',
        'Pong! 🏓 Ready for a game?',
        'Ping pong! Let\'s go!',
      ];

      const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

      await interaction.followUp({ content: randomMessage, ephemeral: true });
    } catch (error) {
      console.error(`Error executing 'ping' command:`, error);
      await interaction.reply({ content: 'There was an error executing that command.', ephemeral: true });
    }
  },
};
