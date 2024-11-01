// bot/delete-global-commands.js

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10'); // Use v10
require('dotenv').config();

const clientId = process.env.DISCORD_CLIENT_ID;
const token = process.env.BOT_TOKEN;

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started deleting global application (/) commands.');

    // Fetch all global commands
    const commands = await rest.get(
      Routes.applicationCommands(clientId),
    );

    // Delete each command
    for (const command of commands) {
      await rest.delete(
        Routes.applicationCommand(clientId, command.id),
      );
      console.log(`Deleted command ${command.name}`);
    }

    console.log('Successfully deleted all global application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
