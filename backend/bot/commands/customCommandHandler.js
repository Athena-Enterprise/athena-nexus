// backend/bot/commands/customCommandHandler.js

const { CustomCommand } = require('../../models');

module.exports = async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  try {
    const customCommand = await CustomCommand.findOne({
      where: { name: commandName, enabled: true },
      include: ['feature', 'server'],
    });

    if (!customCommand) return;

    const { action, selector } = customCommand;

    // Handle different actions
    switch (action) {
      case 'Assign Role':
        if (selector === 'Select User') {
          const targetUser = interaction.options.getUser('user');
          const role = interaction.guild.roles.cache.find((r) => r.name === 'RoleName');
          if (role) {
            const member = await interaction.guild.members.fetch(targetUser.id);
            await member.roles.add(role);
            await interaction.reply({ content: `Assigned ${role.name} to ${targetUser.username}.`, ephemeral: true });
          } else {
            await interaction.reply({ content: 'Role not found.', ephemeral: true });
          }
        }
        break;
      case 'Remove Role':
        // Implement role removal logic
        break;
      case 'Send Embed':
        // Implement embed sending logic
        break;
      // Add more actions as needed
      default:
        await interaction.reply({ content: 'Unknown action.', ephemeral: true });
    }
  } catch (error) {
    console.error('Error executing custom command:', error);
    await interaction.reply({ content: 'There was an error executing that command.', ephemeral: true });
  }
};
