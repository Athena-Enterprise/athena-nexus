// backend/bot/commands/serverstats.js

const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverstats')
    .setDescription('Displays statistics about the server.'),
  
  async execute(interaction) {
    try {
      const { guild } = interaction;
      if (!guild) {
        return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
      }

      // Fetch necessary data
      const memberCount = guild.memberCount;
      const onlineMembers = guild.members.cache.filter(member => member.presence?.status !== 'offline').size;
      const channels = guild.channels.cache.size;
      const roles = guild.roles.cache.size;

      // Create an embed using EmbedBuilder
      const embed = new EmbedBuilder()
        .setTitle(`${guild.name} Server Statistics`)
        .setColor(0x00AE86)
        .addFields(
          { name: 'Total Members', value: `${memberCount}`, inline: true },
          { name: 'Online Members', value: `${onlineMembers}`, inline: true },
          { name: 'Total Channels', value: `${channels}`, inline: true },
          { name: 'Total Roles', value: `${roles}`, inline: true },
        )
        .setTimestamp()
        .setFooter({ text: `Server ID: ${guild.id}` });

      await interaction.reply({ embeds: [embed] });
      logger.info(`Sent server stats for guild "${guild.id}" to user "${interaction.user.id}".`);
    } catch (error) {
      logger.error(`Error fetching server stats: ${error.message}`);
      await interaction.reply({ content: 'There was an error fetching the server stats.', ephemeral: true });
    }
  },
};
