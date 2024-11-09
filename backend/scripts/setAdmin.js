// backend/scripts/setAdmin.js

const path = require('path');
const { sequelize, User } = require('../models'); // Ensure correct path

const setAdmin = async (id) => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    const user = await User.findOne({ where: { id: id } });
    if (!user) {
      console.log(`User with ID ${id} not found.`);
      return;
    }

    user.isAdmin = true;
    await user.save();

    console.log(`User ${user.username} is now an admin.`);
    process.exit(0);
  } catch (error) {
    console.error('Error setting admin:', error);
    process.exit(1);
  }
};

// Replace with your Discord ID
const YOUR_DISCORD_ID = '228658618684276736';
setAdmin(YOUR_DISCORD_ID);
