const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const materialsRoutes = require('./routes/materials');
const centersRoutes = require('./routes/centers');
const schedulesRoutes = require('./routes/schedules');
const challengesRoutes = require('./routes/challenges');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/centers', centersRoutes);
app.use('/api/schedules', schedulesRoutes);
app.use('/api/challenges', challengesRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
