// backend/config/passport.js

const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const { User } = require('../models'); // Correctly import User from models/index.js

passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize by User's primary key
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id); // Correctly using findByPk
    return done(null, user); // The entire user object is available in req.user
  } catch (err) {
    return done(err, null);
  }
});

// Main Discord strategy for authentication
passport.use(
  'discord',
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/api/auth/discord/callback', // Adjust as needed
      scope: ['identify', 'guilds'],
      passReqToCallback: true, // Needed to access req in callback
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Check if this is an account linking request
        if (req.user) {
          // User is logged in, link Discord account
          const user = await User.findByPk(req.user.id); // Correctly using findByPk
          if (!user) {
            return done(null, false, { message: 'User not found.' });
          }
          user.username = profile.username;
          user.avatar = profile.avatar;
          user.discriminator = profile.discriminator;
          user.discordId = profile.id; // Link Discord ID
          await user.save();
          return done(null, user);
        } else {
          // User is not logged in, authenticate via Discord
          // Find or create user in the database
          let user = await User.findOne({ where: { discordId: profile.id } }); // Use discordId

          if (user) {
            // Update user data
            await user.update({
              username: profile.username,
              avatar: profile.avatar,
              discriminator: profile.discriminator,
            });
          } else {
            // Create a new user
            user = await User.create({
              id: crypto.randomUUID(), // Generate a unique ID if not using Discord ID as primary key
              discordId: profile.id, // Set discordId
              username: profile.username,
              avatar: profile.avatar,
              discriminator: profile.discriminator,
              // Initialize other fields as necessary
            });
          }

          return done(null, user);
        }
      } catch (err) {
        console.error('Error in DiscordStrategy:', err); // Log the error
        return done(err, null);
      }
    }
  )
);
