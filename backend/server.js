// backend/server.js

const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const passport = require('passport');
const { Sequelize, DataTypes } = require('sequelize');

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
const serverCommandRoutes = require('./routes/serverCommandRoutes');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Body Parser
app.use(express.json());

// Define custom session model to control the table name
const SessionModel = sequelize.define(
  'SessionStore',
  {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    expires: DataTypes.DATE,
    data: DataTypes.TEXT,
  },
  {
    tableName: 'SessionStore',
  }
);

// Initialize session store with custom model
const sessionStore = new SequelizeStore({
  db: sequelize,
  table: 'SessionStore',
  modelKey: 'SessionStore',
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
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/servers', serverCommandRoutes);
app.use('/api/premium', premiumRoutes);
app.use('/api/commands', commandRoutes);
app.use('/api/admins', adminRoutes);

// Serve static files from the React app (if needed)
// app.use(express.static(path.join(__dirname, 'frontend/build')));

// The "catchall" handler: for any request that doesn't match one above
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
    sequelize.sync({ alter: true }).then(() => {
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
