// backend/scripts/registerCommands.js

const path = require('path');
const fs = require('fs');
const { sequelize, Command, Feature } = require('../models');

const registerCommands = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    const commandsPath = path.join(__dirname, '../bot/commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const commandModule = require(path.join(commandsPath, file));
      const { name, description, premiumOnly } = commandModule.data.toJSON();

      // Check if a feature is associated with the command
      let feature = await Feature.findOne({ where: { name: commandModule.featureName } });
      if (!feature && commandModule.featureName) {
        // Create the feature if it doesn't exist
        feature = await Feature.create({ name: commandModule.featureName });
      }

      // Upsert command into the database
      await Command.upsert({
        name,
        description,
        premiumOnly: premiumOnly || false,
        enabled: true,
        status: 'active', // Default status
        featureId: feature ? feature.id : null,
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
