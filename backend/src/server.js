const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 3000;

// Sync Database and Start Server
const startServer = async () => {
  try {
    await sequelize.sync({ alter: false }); // Set to true if you want to update schema, but be careful in production
    console.log('✓ Database synchronized');
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 API documentation: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('Signal received: closing HTTP server');
      server.close(async () => {
        console.log('HTTP server closed');
        try {
          await sequelize.close();
          console.log('Database connection closed');
          process.exit(0);
        } catch (err) {
          console.error('Error closing database connection:', err);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }
};

startServer();
