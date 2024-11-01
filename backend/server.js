// backend/server.js

const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const passport = require('passport');

// Import models and Sequelize
const { sequelize, Sequelize, Server, ServerStats, User, Command } = require('./models/index');

// Import routes
const serverRoutes = require('./routes/serverRoutes');
const premiumRoutes = require('./routes/premiumRoutes');
const commandRoutes = require('./routes/commandRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Load environment variables **before** using them
dotenv.config({ path: path.resolve(__dirname, './.env') });

// Determine if the environment is development or production
const isDevelopment = process.env.NODE_ENV !== 'production';

// Set up Express app **before** using it in middleware or routes
const app = express();

// Middleware
app.use(express.json());

// Configure CORS to allow credentials and handle preflight requests
app.use(
  cors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200, // For legacy browser support
  })
);
// Handle preflight requests
app.options('*', cors());

// Define custom session model to control the table name
const SessionModel = sequelize.define(
  'SessionStore',
  {
    sid: {
      type: Sequelize.STRING, // Now Sequelize is defined
      primaryKey: true,
    },
    expires: Sequelize.DATE,
    data: Sequelize.TEXT,
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
      secure: isDevelopment ? false : true, // Set to true if using HTTPS in production
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

// Use routes **after** defining `app`
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/premium', premiumRoutes);
app.use('/api/commands', commandRoutes);
app.use('/api/admins', adminRoutes); // Use adminRoutes with /api prefix

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

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to Athena Nexus Backend!');
});

// Test database connection and start the server
sequelize
  .authenticate()
  .then(() => {
    if (isDevelopment) {
      console.log('Database connected...');
    }

    // Sync the models to the database
    sequelize.sync({ alter: true }).then(() => { // Using alter: true for non-destructive sync
      if (isDevelopment) {
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