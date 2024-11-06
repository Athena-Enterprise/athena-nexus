// backend/bot/bot.js

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Correct path to .env

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const { Routes } = require('discord-api-types/v10');
const { sequelize, Server, ServerStats, Command, ServerCommand, User } = require(path.resolve(__dirname, '../models'));
const deployCommands = require('../utils/deployCommands');
const logger = require(path.resolve(__dirname, '../utils/logger')); // Ensure logger is correctly imported

const clientId = process.env.DISCORD_CLIENT_ID;
const token = process.env.BOT_TOKEN;

// Initialize Discord Client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers, // To access member data
    GatewayIntentBits.GuildPresences, // To access presence data
  ],
});

// Initialize commands collection
client.commands = new Collection();

// Load command files
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    logger.info(`Loaded command: ${command.data.name}`);
  } else {
    logger.warn(`The command at ${file} is missing a required "data" or "execute" property.`);
  }
}

// Register commands to all guilds on startup based on the database
(async () => {
  try {
    logger.info('Started refreshing application (/) commands for each guild.');

    // Fetch all servers from the database
    const servers = await Server.findAll();

    for (const server of servers) {
      const isPremium = server.premium;
      const serverTier = server.tier; // Ensure 'tier' is a field in the Server model
      await deployCommands(clientId, server.id, token, isPremium, serverTier);
      logger.info(`Successfully deployed commands for guild: ${server.name} (${server.id})`);
    }

    logger.info('Successfully reloaded application (/) commands for all guilds.');
  } catch (error) {
    logger.error(`Error deploying commands: ${error}`);
  }
})();

// Handle interaction events
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, guildId } = interaction;

  try {
    // Fetch the command from the database using the command name
    const commandRecord = await Command.findOne({ where: { name: commandName } });

    if (!commandRecord) {
      logger.warn(`Command not found in database: ${commandName}`);
      await interaction.reply({ content: 'Command not found.', ephemeral: true });
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
      await interaction.reply({ content: 'This command is disabled on this server.', ephemeral: true });
      logger.info(`Command "${commandId}" disabled on server "${serverId}". User attempted to execute it.`);
      return;
    }

    // Retrieve the corresponding command handler file
    const commandPath = path.join(__dirname, 'commands', `${commandName}.js`);
    if (!fs.existsSync(commandPath)) {
      logger.warn(`Command handler file not found: ${commandPath}`);
      await interaction.reply({ content: 'Command handler not found.', ephemeral: true });
      return;
    }

    const command = require(commandPath);

    if (typeof command.execute !== 'function') {
      logger.warn(`Command handler for ${commandName} does not have an execute function.`);
      await interaction.reply({ content: 'Command handler is invalid.', ephemeral: true });
      return;
    }

    // Execute the command
    await command.execute(interaction);
    logger.info(`Executed command "${commandName}" (ID: ${commandId}) by user "${interaction.user.id}" on server "${serverId}".`);
  } catch (error) {
    logger.error(`Error executing command "${commandName}":`, error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error executing that command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error executing that command!', ephemeral: true });
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

    // Find the user in the database by discordId
    const user = await User.findOne({ where: { discordId: discordOwnerId } });

    if (user) {
      // Create a Server entry
      const server = await Server.create({
        id: guild.id,
        name: guild.name,
        ownerId: user.id,
        premium: false, // Default value; adjust as necessary
        memberCount: guild.memberCount,
        onlineMembers: guild.members.cache.filter(member => member.presence?.status !== 'offline').size,
        iconUrl: guild.iconURL({ dynamic: true }) || null,
        tier: 'free', // Default tier; adjust as necessary
      });

      logger.info(`Server ${guild.name} (${guild.id}) added to the database.`);

      // Create corresponding ServerStats entry
      await ServerStats.create({
        ServerId: server.id,
        memberCount: server.memberCount,
        onlineMembers: server.onlineMembers,
      });
      logger.info(`ServerStats for ${guild.name} created.`);

      // Fetch all existing commands
      const allCommands = await Command.findAll();

      // Create ServerCommands entries
      const serverCommands = allCommands.map(cmd => ({
        serverId: server.id,
        commandId: cmd.id,
        enabled: true, // Default to enabled; adjust as necessary
      }));

      await ServerCommand.bulkCreate(serverCommands);
      logger.info(`ServerCommands for ${guild.name} created.`);

      // Deploy commands based on premium status and tier
      await deployCommands(clientId, guild.id, token, server.premium, server.tier);
      logger.info(`Commands deployed for guild: ${guild.name} (${guild.id})`);
    } else {
      logger.warn(`Owner with Discord ID ${discordOwnerId} not found in the database.`);
    }
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
      await Server.destroy({ where: { id: guild.id } });
      await ServerCommand.destroy({ where: { serverId: guild.id } }); // Remove associated ServerCommands
      logger.info(`Server ${guild.name} and its associated data removed from the database.`);
    }
  } catch (error) {
    logger.error(`Error removing guild from database: ${error.message}`);
  }
});

// Handle member join
client.on('guildMemberAdd', async (member) => {
  try {
    const server = await Server.findOne({ where: { id: member.guild.id } });
    if (server) {
      server.memberCount += 1;
      if (member.presence?.status !== 'offline') {
        server.onlineMembers += 1;
      }
      await server.save();

      const stats = await ServerStats.findOne({ where: { ServerId: server.id } });
      if (stats) {
        stats.memberCount = server.memberCount;
        stats.onlineMembers = server.onlineMembers;
        await stats.save();
        logger.info(`Updated memberCount and onlineMembers for guild: ${server.name}`);
      }
    }
  } catch (error) {
    logger.error(`Error updating member count on member join: ${error.message}`);
  }
});

// Handle member leave
client.on('guildMemberRemove', async (member) => {
  try {
    const server = await Server.findOne({ where: { id: member.guild.id } });
    if (server) {
      server.memberCount = Math.max(server.memberCount - 1, 0);
      // If the member was online before leaving, decrement onlineMembers
      if (member.presence?.status !== 'offline') {
        server.onlineMembers = Math.max(server.onlineMembers - 1, 0);
      }
      await server.save();

      const stats = await ServerStats.findOne({ where: { ServerId: server.id } });
      if (stats) {
        stats.memberCount = server.memberCount;
        stats.onlineMembers = server.onlineMembers;
        await stats.save();
        logger.info(`Updated memberCount for guild: ${server.name}`);
      }
    }
  } catch (error) {
    logger.error(`Error updating member count on member leave: ${error.message}`);
  }
});

// Handle presence updates
client.on('presenceUpdate', async (oldPresence, newPresence) => {
  if (!newPresence.guild) return;

  try {
    const server = await Server.findOne({ where: { id: newPresence.guild.id } });
    if (server) {
      const oldStatus = oldPresence?.status || 'offline';
      const newStatus = newPresence.status;

      const wasOnline = oldStatus !== 'offline';
      const isOnline = newStatus !== 'offline';

      if (!wasOnline && isOnline) {
        server.onlineMembers += 1;
      } else if (wasOnline && !isOnline) {
        server.onlineMembers = Math.max(server.onlineMembers - 1, 0);
      }

      await server.save();

      const stats = await ServerStats.findOne({ where: { ServerId: server.id } });
      if (stats) {
        stats.onlineMembers = server.onlineMembers;
        await stats.save();
        logger.info(`Updated onlineMembers for guild: ${server.name}`);
      }
    }
  } catch (error) {
    logger.error(`Error updating online members on presence update: ${error.message}`);
  }
});

// Handle messages (for non-slash commands)
client.on('messageCreate', message => {
  if (message.author.bot) return;

  if (message.content === '!ping') {
    message.channel.send('Pong Chong!');
    logger.info(`Responded to !ping command from user ${message.author.id} in guild ${message.guild.id}`);
  }
});

// Login to Discord
client.login(token)
  .then(() => {
    logger.info('Bot logged in successfully.');
  })
  .catch(err => {
    logger.error(`Bot login failed: ${err}`);
  });

// Synchronize the database
sequelize.sync({ alter: true }) // Ensure fields are updated
  .then(() => {
    logger.info('Bot database synchronized.');
  })
  .catch(err => {
    logger.error(`Error synchronizing bot database: ${err}`);
  });
