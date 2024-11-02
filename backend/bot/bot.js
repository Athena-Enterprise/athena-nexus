// backend/bot/bot.js

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Correct path to .env

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { sequelize, Server, ServerStats, Command } = require(path.resolve(__dirname, '../models'));
const { deployCommands } = require(path.resolve(__dirname, '../utils/deploy-commands')); // Updated path
const { updateAllGuildCommands } = require(path.resolve(__dirname, '../utils/updateAllGuildCommands')); // Updated path


const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID; // Ensure this is set in your .env
const token = process.env.BOT_TOKEN;

// Initialize Discord Client with updated intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers, // To access member data
    GatewayIntentBits.GuildPresences, // To access presence data
  ]
});

// Initialize commands collection
client.commands = new Collection();

// Load command files
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commands = [];
for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
  // Note: Initial registration is handled via database
}

// Register commands to a guild on startup based on the database
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    // Fetch the guild's premium status
    const server = await Server.findOne({ where: { id: guildId } });
    const isPremium = server ? server.premium : false;

    await deployCommands(clientId, guildId, token, isPremium);

    console.log('Successfully reloaded application (/) commands for the guild.');
  } catch (error) {
    console.error(error);
  }
})();

// Handle interaction events

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    // Fetch the server's command status
    const serverId = interaction.guildId;
    const serverCommand = await ServerCommand.findOne({
      where: { serverId, commandId: command.id },
    });

    // If the command is disabled for this server, inform the user
    if (serverCommand && !serverCommand.enabled) {
      await interaction.reply({ content: 'This command is disabled on this server.', ephemeral: true });
      return;
    }

    // Execute the command
    await command.execute(interaction, sequelize); // Pass sequelize if needed
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error executing that command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error executing that command!', ephemeral: true });
    }
  }
});

// Handle when the bot joins a new server
client.on('guildCreate', async (guild) => {
  console.log(`Joined new guild: ${guild.name} (ID: ${guild.id})`);

  try {
    // Fetch all members to ensure accurate member counts
    await guild.members.fetch();

    // Check if the server already exists in the database
    let server = await Server.findOne({
      where: { id: guild.id },
      include: [{ model: ServerStats, as: 'stats' }]
    });
    if (!server) {
      // Create a new server entry
      server = await Server.create({
        id: guild.id,
        name: guild.name,
        ownerId: guild.ownerId,
        premium: false, // Set default or based on your criteria
        memberCount: guild.memberCount, // Initialize memberCount
        onlineMembers: guild.members.cache.filter(member => member.presence?.status !== 'offline').size, // Initialize onlineMembers
        iconUrl: guild.iconURL({ dynamic: true }) || null, // Store icon URL
      });
      console.log(`Server ${guild.name} added to the database.`);

      // Create corresponding ServerStats entry
      await ServerStats.create({
        ServerId: server.id,
        memberCount: guild.memberCount,
        onlineMembers: guild.members.cache.filter(member => member.presence?.status !== 'offline').size,
      });
      console.log(`ServerStats for ${guild.name} created.`);
    } else {
      // Update existing server entry if needed
      server.iconUrl = guild.iconURL({ dynamic: true }) || server.iconUrl;
      await server.save();
      console.log(`Server ${guild.name} updated in the database.`);
    }

    // Deploy commands based on premium status
    await deployCommands(clientId, guild.id, token, server.premium);
  } catch (error) {
    console.error('Error adding/updating guild in database:', error);
  }
});

// Handle when the bot is removed from a server
client.on('guildDelete', async (guild) => {
  console.log(`Removed from guild: ${guild.name} (ID: ${guild.id})`);

  try {
    // Remove the server and its stats from the database
    const server = await Server.findOne({ where: { id: guild.id } });
    if (server) {
      await ServerStats.destroy({ where: { ServerId: server.id } });
      await Server.destroy({ where: { id: guild.id } });
      console.log(`Server ${guild.name} and its stats removed from the database.`);
    }
  } catch (error) {
    console.error('Error removing guild from database:', error);
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
        console.log(`Updated memberCount and onlineMembers for guild: ${server.name}`);
      }
    }
  } catch (error) {
    console.error('Error updating member count on member join:', error);
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
        console.log(`Updated memberCount for guild: ${server.name}`);
      }
    }
  } catch (error) {
    console.error('Error updating member count on member leave:', error);
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
        console.log(`Updated onlineMembers for guild: ${server.name}`);
      }
    }
  } catch (error) {
    console.error('Error updating online members on presence update:', error);
  }
});

// Handle messages (for non-slash commands)
client.on('messageCreate', message => {
  if (message.author.bot) return;

  if (message.content === '!ping') {
    message.channel.send('Pong Chong!');
  }
});

// Login to Discord
client.login(token);

// Synchronize the database
sequelize.sync({ alter: true }) // Ensure fields are updated
  .then(() => {
    console.log('Bot database synchronized.');
  })
  .catch(err => {
    console.error('Error synchronizing bot database:', err);
  });
