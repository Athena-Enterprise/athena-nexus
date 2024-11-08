// backend/controllers/commandController.js

const { Command, ServerCommand, Feature, Server } = require('../models');
const fs = require('fs');
const path = require('path');

exports.getEnabledCommandsForServer = async (serverId) => {
  try {
    // Fetch all commands with their features
    const commands = await Command.findAll({
      include: [{
        model: Feature,
        as: 'feature',
        attributes: ['id', 'name', 'status', 'enabled'],
      }],
    });

    // Fetch server-specific command settings
    const serverCommands = await ServerCommand.findAll({
      where: { serverId },
      attributes: ['commandId', 'enabled'],
    });

    const serverCommandMap = new Map();
    serverCommands.forEach(sc => {
      serverCommandMap.set(sc.commandId, sc.enabled);
    });

    // Determine effective command status
    const effectiveCommands = commands.map(cmd => {
      // Check global status
      if (cmd.status !== 'active') {
        return { id: cmd.id, name: cmd.name, description: cmd.description, enabled: false, status: cmd.status };
      }

      // Check if feature is active
      if (cmd.feature.status !== 'active') {
        return { id: cmd.id, name: cmd.name, description: cmd.description, enabled: false, status: cmd.feature.status };
      }

      // Check feature's global enabled status
      if (!cmd.feature.enabled) {
        return { id: cmd.id, name: cmd.name, description: cmd.description, enabled: false, status: cmd.feature.status };
      }

      // Check server-specific enabled status
      const serverEnabled = serverCommandMap.has(cmd.id) ? serverCommandMap.get(cmd.id) : cmd.enabled;

      // Determine if the command should be enabled
      return { id: cmd.id, name: cmd.name, description: cmd.description, enabled: serverEnabled, status: cmd.status };
    });

    return effectiveCommands;
  } catch (error) {
    console.error('Error in getEnabledCommandsForServer:', error);
    throw error;
  }
};

exports.createCommand = async (req, res) => {
  const { name, description, code, featureId } = req.body;

  if (!name || !description || !code || !featureId) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Check if command already exists
    const existingCommand = await Command.findOne({ where: { name } });
    if (existingCommand) {
      return res.status(400).json({ error: 'Command with this name already exists.' });
    }

    // Create the command in the database
    const newCommand = await Command.create({
      name,
      description,
      featureId,
      status: 'development', // Default status
      enabled: true, // Default enabled
    });

    // Generate the command file
    const commandsDir = path.join(__dirname, '../bot/commands');
    const commandFilePath = path.join(commandsDir, `${name}.js`);

    const commandFileContent = `
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('${name}')
    .setDescription('${description}'),
  async execute(interaction) {
    ${code}
  },
};
`;

    fs.writeFileSync(commandFilePath, commandFileContent);

    return res.status(201).json({ message: 'Command created successfully.', command: newCommand });
  } catch (error) {
    console.error('Error creating command:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};