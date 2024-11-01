// backend/controllers/userController.js

const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const { User } = require('../models');

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id); // Ensure User is correctly imported
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
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
    }

    if (username) {
      user.username = username;
    }

    if (newsletterSubscribed !== undefined) {
      user.newsletterSubscribed = newsletterSubscribed;
    }

    await user.save();

    res.json({
      user,
      message: emailChanged
        ? 'Settings updated. A verification email has been sent to your new email address.'
        : 'Settings updated successfully.',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user.' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    // Update password
    user.passwordHash = newPassword; // Will be hashed by the beforeUpdate hook
    await user.save();

    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Failed to change password.' });
  }
};

exports.unlinkDiscord = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Unlink Discord account by setting discordId to null
    user.discordId = null;
    user.username = null; // Optional: Clear Discord-specific fields
    user.avatar = null;
    user.discriminator = null;

    await user.save();

    res.json({ message: 'Discord account unlinked successfully.' });
  } catch (error) {
    console.error('Error unlinking Discord account:', error);
    res.status(500).json({ message: 'Failed to unlink Discord account.' });
  }
};