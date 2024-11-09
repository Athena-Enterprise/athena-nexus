// backend/config/passport.js

const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const { User } = require('../models');
const crypto = require('crypto');

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log('Deserializing user with id:', id);
  try {
    const user = await User.findByPk(id);
    console.log('Found user:', user);
    return done(null, user);
  } catch (err) {
    console.error('Error in deserializeUser:', err);
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
      callbackURL: 'http://localhost:5000/api/auth/discord/callback',
      scope: ['identify', 'email', 'guilds'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user in the database
        let user = await User.findOne({ where: { discordId: profile.id } });

        if (user) {
          // Update user data
          await user.update({
            username: profile.username,
            discriminator: profile.discriminator, // Ensure discriminator is updated
            avatar: profile.avatar,
            email: profile.email || user.email,
          });
        } else {
          // Create a new user
          user = await User.create({
            discordId: profile.id,
            username: profile.username,
            discriminator: profile.discriminator, // Ensure discriminator is set
            avatar: profile.avatar,
            email: profile.email,
          });
        }

        return done(null, user);
      } catch (err) {
        console.error('Error in DiscordStrategy:', err);
        return done(err, null);
      }
    }
  )
);
