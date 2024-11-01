// backend/bot/utils/updateAllGuildCommands.js

const { deployCommands } = require('./deploy-commands'); // Correct path and filename

const updateAllGuildCommands = async (clientId, token, isPremiumMap) => {
  try {
    const guildIds = Array.from(isPremiumMap.keys());

    for (const guildId of guildIds) {
      const isPremium = isPremiumMap.get(guildId);
      await deployCommands(clientId, guildId, token, isPremium);
    }

    console.log('All guild commands have been updated successfully.');
  } catch (error) {
    console.error('Error updating all guild commands:', error);
  }
};

module.exports = { updateAllGuildCommands };
