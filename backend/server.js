// backend/server.js

const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const passport = require('passport');
const { Sequelize, DataTypes } = require('sequelize'); // Import DataTypes

// Load environment variables **before** using them
dotenv.config({ path: path.resolve(__dirname, './.env') });

// Import Sequelize instance
const sequelize = require('./config/database');

// Import routes
const serverRoutes = require('./routes/serverRoutes');
const premiumRoutes = require('./routes/premiumRoutes');
const commandRoutes = require('./routes/commandRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const documentationRoutes = require('./routes/documentationRoutes');
const serverCommandRoutes = require('./routes/serverCommandRoutes');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions));

// Body Parser
app.use(express.json());

// Define custom session model to control the table name
const SessionModel = sequelize.define(
  'SessionStore',
  {
    sid: {
      type: DataTypes.STRING, // Corrected
      primaryKey: true,
    },
    expires: DataTypes.DATE, // Corrected
    data: DataTypes.TEXT, // Corrected
  },
  {
    tableName: 'SessionStore',
  }
);

// Initialize session store with custom model
const sessionStore = new SequelizeStore({
  db: sequelize,
  model: SessionModel,
});

// Sync session store
sessionStore.sync();

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS in production
      httpOnly: true,
      sameSite: 'lax', // Adjust sameSite attribute as needed
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
require('./config/passport');

// Use routes **after** initializing Passport
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/servers', serverCommandRoutes); // Ensure correct placement
app.use('/api/premium', premiumRoutes);
app.use('/api/commands', commandRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/docs', documentationRoutes);

// Logout route (if not handled in authRoutes)
app.get('/api/auth/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    req.session.destroy(err => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({ error: 'Failed to destroy session' });
      }
      res.clearCookie('connect.sid'); // Replace 'connect.sid' if your session cookie name is different
      res.status(200).json({ message: 'Logout successful' });
    });
  });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/build')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  // If the request starts with /api, return 404
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// Test database connection and start the server
sequelize
  .authenticate()
  .then(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Database connected...');
    }

    // Sync the models to the database
    sequelize.sync({ alter: true }).then(() => { // Using alter: true for non-destructive sync
      if (process.env.NODE_ENV !== 'production') {
        console.log('Database synced');
      }

      // Start the Express server
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    });
  })
  .catch(err => {
    console.error('Error:', err);
  });
