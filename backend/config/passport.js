// backend/config/passport.js

const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const { User } = require('../models');
const crypto = require('crypto');

passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize by User's primary key
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
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
            avatar: profile.avatar,
            discriminator: profile.discriminator,
            email: profile.email || user.email, // Update email if available
          });
        } else {
          // Create a new user
          user = await User.create({
            id: crypto.randomUUID(),
            discordId: profile.id,
            username: profile.username,
            avatar: profile.avatar,
            discriminator: profile.discriminator,
            email: profile.email, // Set email if available
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
