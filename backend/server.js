// backend/server.js

const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const passport = require('passport');
const http = require('http'); // Import HTTP module
const { Server } = require('socket.io'); // Import Socket.IO server
const { fetchAdminStats } = require('./services/statsService.js'); // Corrected path
const logger = require('./utils/logger');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, './.env') });

// Import Sequelize instance and models
const { sequelize, Sequelize, User } = require('./models'); // Import from models/index.js

// Import routes
const serverRoutes = require('./routes/serverRoutes');
const premiumRoutes = require('./routes/premiumRoutes');
const commandRoutes = require('./routes/commandRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const serverCommandRoutes = require('./routes/serverCommandRoutes');
const featureRoutes = require('./routes/featureRoutes');

const app = express();

// Create HTTP server
const httpServer = http.createServer(app);

// Initialize Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000', // Adjust based on your frontend's URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

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
      type: Sequelize.STRING,
      primaryKey: true,
    },
    expires: Sequelize.DATE,
    data: Sequelize.TEXT,
  },
  {
    tableName: 'sessionstore',
  }
);

// Initialize session store with custom model
const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: 'sessionstore',
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
    proxy: true, // Add this if you're behind a proxy (e.g., Nginx)
    cookie: {
      secure: false, // Set to true if using HTTPS
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
app.use('/api/features', featureRoutes);

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

// Socket.IO Connection Handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Assign user to 'admins' room if authenticated and admin
  // This requires authentication integration with Socket.IO
  // For simplicity, we'll assume all connected users are admins
  socket.join('admins');
  console.log(`Socket ${socket.id} joined 'admins' room`);

  // Optionally, handle specific events here

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Export io for use in controllers
app.set('io', io);

// Function to fetch and emit admin stats periodically
const fetchAndEmitAdminStats = async () => {
  try {
    const stats = await fetchAdminStats();
    io.to('admins').emit('adminStatsUpdate', stats);
    logger.info('Admin statistics emitted to admins room.');
  } catch (error) {
    logger.error(`Error in periodic admin stats fetch: ${error.stack || error.message}`);
  }
};

// Fetch and emit admin stats every 60 seconds
setInterval(fetchAndEmitAdminStats, 60 * 1000);

// Optionally, fetch and emit immediately on server start
fetchAndEmitAdminStats();

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
      httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    });
  })
  .catch((err) => {
    console.error('Error:', err);
  });
