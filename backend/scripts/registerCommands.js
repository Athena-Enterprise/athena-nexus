// backend/scripts/registerCommands.js

const path = require('path');
const fs = require('fs');
const { sequelize, Command } = require('../models/index');

const registerCommands = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    const commandsPath = path.join(__dirname, '../bot/commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(path.join(commandsPath, file));
      const { name, description, premiumOnly } = command.data.toJSON();

      // Upsert command into the database
      await Command.upsert({
        name,
        description,
        premiumOnly: premiumOnly || false,
        enabled: true,
        status: 'development', // Default status
      });

      console.log(`Registered command: ${name}`);
    }

    console.log('All commands have been registered.');
    process.exit(0);
  } catch (error) {
    console.error('Error registering commands:', error);
    process.exit(1);
  }
};

registerCommands();
