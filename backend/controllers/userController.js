// backend/controllers/userController.js

const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const { User, Server } = require('../models');
const logger = require('../utils/logger'); // Import the logger

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{
        model: Server,
        as: 'ownedServers',
        attributes: ['id', 'name'],
      }],
    });

    if (!user) {
      logger.warn(`User not found with ID: ${req.user.id}`);
      return res.status(404).json({ error: 'User not found.' });
    }

    const servers = user.ownedServers || [];
    logger.info(`User ${user.id} owns servers: ${JSON.stringify(servers)}`); // Debug log

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isPremium: user.isPremium, // Include isPremium
      avatar: user.avatar, // Include avatar
      discriminator: user.discriminator, // Include discriminator
      servers: servers.map(server => ({ id: server.id, name: server.name })),
    });
    logger.info(`User data sent for user ID: ${user.id}`);
  } catch (error) {
    logger.error(`Error fetching user (ID: ${req.user.id}): ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, username, newsletterSubscribed } = req.body;

    const user = await User.findByPk(userId);
    let emailChanged = false;

    if (email && email !== user.email) {
      // Check if email is already in use
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        logger.warn(`Email update failed: Email already in use (${email})`);
        return res.status(400).json({ message: 'Email already in use.' });
      }
      user.email = email;
      user.emailVerified = false;

      // Generate a verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      user.emailVerificationToken = verificationToken;

      // Send verification email
      const transporter = nodemailer.createTransport({
        host: 'send.one.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}`;

      await transporter.sendMail({
        from: 'no-reply@athenanexus.com',
        to: user.email,
        subject: 'Verify your new email address',
        html: `<p>Please verify your new email by clicking <a href="${verificationUrl}">here</a>.</p>`,
      });

      emailChanged = true;
      logger.info(`Email updated for user ID: ${user.id}. Verification email sent.`);
    }

    if (username) {
      user.username = username;
      logger.info(`Username updated for user ID: ${user.id} to ${username}`);
    }

    if (newsletterSubscribed !== undefined) {
      user.newsletterSubscribed = newsletterSubscribed;
      logger.info(`Newsletter subscription updated for user ID: ${user.id} to ${newsletterSubscribed}`);
    }

    await user.save();

    res.json({
      user,
      message: emailChanged
        ? 'Settings updated. A verification email has been sent to your new email address.'
        : 'Settings updated successfully.',
    });
  } catch (error) {
    logger.error(`Error updating user (ID: ${req.user.id}): ${error.message}`);
    res.status(500).json({ message: 'Failed to update user.' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      logger.warn(`Password change failed: User not found (ID: ${userId})`);
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      logger.warn(`Password change failed: Incorrect current password for user ID: ${userId}`);
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    // Update password
    user.passwordHash = newPassword; // Will be hashed by the beforeUpdate hook
    await user.save();

    logger.info(`Password changed successfully for user ID: ${user.id}`);
    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    logger.error(`Error changing password for user ID: ${req.user.id}: ${error.message}`);
    res.status(500).json({ message: 'Failed to change password.' });
  }
};

exports.unlinkDiscord = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      logger.warn(`Unlink Discord failed: User not found (ID: ${userId})`);
      return res.status(404).json({ error: 'User not found.' });
    }

    // Unlink Discord account by setting discordId to null
    user.discordId = null;
    user.username = null; // Optional: Clear Discord-specific fields
    user.avatar = null;
    user.discriminator = null;

    await user.save();

    logger.info(`Discord account unlinked successfully for user ID: ${user.id}`);
    res.json({ message: 'Discord account unlinked successfully.' });
  } catch (error) {
    logger.error(`Error unlinking Discord account for user ID: ${req.user.id}: ${error.message}`);
    res.status(500).json({ message: 'Failed to unlink Discord account.' });
  }
};
