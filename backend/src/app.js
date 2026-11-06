const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const materialsRoutes = require('./routes/materials');
const centersRoutes = require('./routes/centers');
const schedulesRoutes = require('./routes/schedules');
const challengesRoutes = require('./routes/challenges');
const usersRoutes = require('./routes/users');
const remindersRoutes = require('./routes/reminders');
const exportRoutes = require('./routes/export');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/centers', centersRoutes);
app.use('/api/schedules', schedulesRoutes);
app.use('/api/challenges', challengesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reminders', remindersRoutes);
app.use('/api/export', exportRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'EcoGestión Local API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      materials: '/api/materials',
      centers: '/api/centers',
      schedules: '/api/schedules',
      challenges: '/api/challenges',
      users: '/api/users'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
