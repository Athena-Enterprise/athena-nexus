// backend/config/passport.js

const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const { User } = require('../models');
require('dotenv').config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id, {
      include: ['serverMemberships'],
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_CALLBACK_URL || 'http://localhost:5000/api/auth/discord/callback',
      scope: ['identify', 'email', 'guilds'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user
        let user = await User.findOne({ where: { discordId: profile.id } });
        if (!user) {
          user = await User.create({
            discordId: profile.id,
            username: profile.username,
            discriminator: profile.discriminator,
            email: profile.email,
            avatar: profile.avatar,
            isAdmin: false,
            isPremium: false,
          });
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = passport;
