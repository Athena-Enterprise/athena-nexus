// backend/bot/bot.js

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const {
  sequelize,
  Server,
  ServerStats,
  Command,
  ServerCommand,
  User,
  ServerMember,
} = require('../models');
const { Op } = require('sequelize');

const deployCommands = require('../utils/deployCommands');
const logger = require('../utils/logger');

const clientId = process.env.DISCORD_CLIENT_ID;
const token = process.env.BOT_TOKEN;

// Initialize Discord Client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
  ],
});

// Initialize commands collection
client.commands = new Collection();

// Function to synchronize commands in the commands folder with the database
async function synchronizeCommandsWithDatabase() {
  try {
    // Load command files
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.js'));

    // Keep track of command names in the folder
    const commandNamesInFolder = [];

    // For each command file
    for (const file of commandFiles) {
      const commandModule = require(path.join(commandsPath, file));
      if ('data' in commandModule && 'execute' in commandModule) {
        const commandData = commandModule.data;

        // Extract command information
        const name = commandData.name;
        const description = commandData.description;
        const premiumOnly = commandModule.premiumOnly || false;
        const status = commandModule.status || 'active';
        const tier = commandModule.tier || 'free';
        const featureId = commandModule.featureId || null; // Adjust as necessary

        commandNamesInFolder.push(name);

        // Check if command exists in the database
        let command = await Command.findOne({ where: { name } });

        if (command) {
          // Command exists, update it if necessary
          command.description = description;
          command.premiumOnly = premiumOnly;
          command.status = status;
          command.tier = tier;
          command.featureId = featureId;
          await command.save();
          logger.info(`Updated command in database: ${name}`);
        } else {
          // Command does not exist, create it
          command = await Command.create({
            name,
            description,
            premiumOnly,
            status,
            tier,
            featureId,
            enabled: true, // Default to enabled
          });
          logger.info(`Created command in database: ${name}`);
        }
      } else {
        logger.warn(
          `The command at ${file} is missing a required "data" or "execute" property.`
        );
      }
    }

    // Remove commands from the database that are no longer in the commands folder
    await Command.destroy({
      where: {
        name: {
          [Op.notIn]: commandNamesInFolder,
        },
      },
    });
    logger.info(
      'Removed commands from database that are no longer in the commands folder.'
    );

    logger.info('Command synchronization with database completed.');
  } catch (error) {
    logger.error(`Error synchronizing commands with database: ${error.message}`);
  }
}

// Load command files and populate client.commands collection
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    logger.info(`Loaded command: ${command.data.name}`);
  } else {
    logger.warn(
      `The command at ${file} is missing a required "data" or "execute" property.`
    );
  }
}

// Synchronize commands with database and deploy them
(async () => {
  try {
    await synchronizeCommandsWithDatabase();

    logger.info(
      'Started refreshing application (/) commands for each guild.'
    );

    // Fetch all servers from the database
    const servers = await Server.findAll();

    for (const server of servers) {
      const isPremium = server.premium;
      const serverTier = server.tier; // Ensure 'tier' is a field in the Server model
      await deployCommands(clientId, server.id, token, isPremium, serverTier);
      logger.info(
        `Successfully deployed commands for guild: ${server.name} (${server.id})`
      );
    }

    logger.info('Successfully reloaded application (/) commands for all guilds.');
  } catch (error) {
    logger.error(`Error deploying commands: ${error}`);
  }
})();

// Handle interaction events
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, guildId } = interaction;

  try {
    // Fetch the command from the database using the command name
    const commandRecord = await Command.findOne({ where: { name: commandName } });

    if (!commandRecord) {
      logger.warn(`Command not found in database: ${commandName}`);
      await interaction.reply({
        content: 'Command not found.',
        ephemeral: true,
      });
      return;
    }

    const commandId = commandRecord.id;

    // Fetch the server's command status
    const serverId = guildId;
    const serverCommand = await ServerCommand.findOne({
      where: { serverId, commandId },
    });

    // If the command is disabled for this server, inform the user
    if (serverCommand && !serverCommand.enabled) {
      await interaction.reply({
        content: 'This command is disabled on this server.',
        ephemeral: true,
      });
      logger.info(
        `Command "${commandName}" disabled on server "${serverId}". User attempted to execute it.`
      );
      return;
    }

    // Retrieve the corresponding command handler file
    const command = client.commands.get(commandName);

    if (!command) {
      logger.warn(`Command handler for ${commandName} not found.`);
      await interaction.reply({
        content: 'Command handler not found.',
        ephemeral: true,
      });
      return;
    }

    // Execute the command
    await command.execute(interaction);
    logger.info(
      `Executed command "${commandName}" (ID: ${commandId}) by user "${interaction.user.id}" on server "${serverId}".`
    );
  } catch (error) {
    logger.error(`Error executing command "${commandName}":`, error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error executing that command!',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'There was an error executing that command!',
        ephemeral: true,
      });
    }
  }
});

// Handle when the bot joins a new server
client.on('guildCreate', async (guild) => {
  logger.info(`Joined new guild: ${guild.name} (ID: ${guild.id})`);

  try {
    // Fetch the owner of the guild
    const owner = await guild.fetchOwner();
    const discordOwnerId = owner.id;

    // Find or create the user in the database by discordId
    let user = await User.findOne({ where: { discordId: discordOwnerId } });

    if (!user) {
      // Create a new user if not found
      user = await User.create({
        discordId: discordOwnerId,
        username: owner.user.username,
        avatar: owner.user.avatar,
        email: null, // Discord doesn't provide email in this context
      });
    }

    // Create a Server entry
    const server = await Server.create({
      id: guild.id,
      name: guild.name,
      premium: false, // Default value; adjust as necessary
      tier: 'free', // Default tier; adjust as necessary
      iconUrl: guild.iconURL({ dynamic: true }) || null,
    });

    logger.info(`Server ${guild.name} (${guild.id}) added to the database.`);

    // Create a ServerMember entry for the owner with role 'owner'
    await ServerMember.create({
      serverId: server.id,
      userId: user.id,
      role: 'owner',
    });

    logger.info(
      `ServerMember entry created for owner: ${user.username} (${user.id}) on server: ${server.name} (${server.id}).`
    );

    // Create corresponding ServerStats entry
    await ServerStats.create({
      ServerId: server.id,
      memberCount: guild.memberCount,
      onlineMembers: guild.members.cache.filter(
        (member) => member.presence?.status !== 'offline'
      ).size,
    });

    logger.info(`ServerStats for ${guild.name} created.`);

    // Fetch all existing commands
    const allCommands = await Command.findAll();

    // Create ServerCommands entries
    const serverCommands = allCommands.map((cmd) => ({
      serverId: server.id,
      commandId: cmd.id,
      enabled: true, // Default to enabled; adjust as necessary
    }));

    await ServerCommand.bulkCreate(serverCommands);
    logger.info(`ServerCommands for ${guild.name} created.`);

    // Deploy commands based on premium status and tier
    await deployCommands(clientId, guild.id, token, server.premium, server.tier);
    logger.info(`Commands deployed for guild: ${guild.name} (${guild.id})`);
  } catch (error) {
    logger.error(`Error handling guildCreate for ${guild.name}: ${error.message}`);
  }
});

// Handle when the bot is removed from a server
client.on('guildDelete', async (guild) => {
  logger.info(`Removed from guild: ${guild.name} (ID: ${guild.id})`);

  try {
    // Remove the server and its stats from the database
    const server = await Server.findOne({ where: { id: guild.id } });
    if (server) {
      await ServerStats.destroy({ where: { ServerId: server.id } });
      await ServerCommand.destroy({ where: { serverId: guild.id } });
      await ServerMember.destroy({ where: { serverId: guild.id } });
      await Server.destroy({ where: { id: guild.id } });
      logger.info(
        `Server ${guild.name} and its associated data removed from the database.`
      );
    }
  } catch (error) {
    logger.error(`Error removing guild from database: ${error.message}`);
  }
});

// Handle member join
client.on('guildMemberAdd', async (member) => {
  try {
    const serverStats = await ServerStats.findOne({
      where: { ServerId: member.guild.id },
    });
    if (serverStats) {
      serverStats.memberCount += 1;
      if (member.presence?.status !== 'offline') {
        serverStats.onlineMembers += 1;
      }
      await serverStats.save();
      logger.info(`Updated memberCount and onlineMembers for guild: ${member.guild.name}`);
    }
  } catch (error) {
    logger.error(`Error updating member count on member join: ${error.message}`);
  }
});

// Handle member leave
client.on('guildMemberRemove', async (member) => {
  try {
    const serverStats = await ServerStats.findOne({
      where: { ServerId: member.guild.id },
    });
    if (serverStats) {
      serverStats.memberCount = Math.max(serverStats.memberCount - 1, 0);
      if (member.presence?.status !== 'offline') {
        serverStats.onlineMembers = Math.max(serverStats.onlineMembers - 1, 0);
      }
      await serverStats.save();
      logger.info(`Updated memberCount for guild: ${member.guild.name}`);
    }
  } catch (error) {
    logger.error(`Error updating member count on member leave: ${error.message}`);
  }
});

// Handle presence updates
client.on('presenceUpdate', async (oldPresence, newPresence) => {
  if (!newPresence.guild) return;

  try {
    const serverStats = await ServerStats.findOne({
      where: { ServerId: newPresence.guild.id },
    });
    if (!serverStats) return;

    const oldStatus = oldPresence?.status || 'offline';
    const newStatus = newPresence.status;

    if (oldStatus === 'offline' && newStatus !== 'offline') {
      serverStats.onlineMembers += 1;
    } else if (oldStatus !== 'offline' && newStatus === 'offline') {
      serverStats.onlineMembers = Math.max(serverStats.onlineMembers - 1, 0);
    }

    await serverStats.save();
    logger.info(`Updated onlineMembers for guild: ${newPresence.guild.name}`);
  } catch (error) {
    logger.error(`Error updating online members on presence update: ${error.message}`);
  }
});

// Handle messages (for non-slash commands)
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content === '!ping') {
    message.channel.send('Pong!');
    logger.info(
      `Responded to !ping command from user ${message.author.id} in guild ${message.guild.id}`
    );
  }

  // Track message count
  try {
    const serverStats = await ServerStats.findOne({
      where: { ServerId: message.guild.id },
    });
    if (serverStats) {
      serverStats.messageCount = (serverStats.messageCount || 0) + 1;
      await serverStats.save();
    }
  } catch (error) {
    logger.error(`Error updating message count: ${error.message}`);
  }
});

// Login to Discord
client
  .login(token)
  .then(() => {
    logger.info('Bot logged in successfully.');
  })
  .catch((err) => {
    logger.error(`Bot login failed: ${err}`);
  });

// Synchronize the database
sequelize
  .sync({ alter: false }) // Use { force: false } to avoid dropping tables
  .then(() => {
    logger.info('Bot database synchronized.');
  })
  .catch((err) => {
    logger.error(`Error synchronizing bot database: ${err}`);
  });
