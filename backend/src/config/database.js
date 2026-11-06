const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'), // Store DB in backend root
  logging: false, // Set to console.log to see SQL queries
  define: {
    timestamps: true, // Add createdAt and updatedAt to all models
    underscored: true // Use snake_case for fields (created_at)
  }
});

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ SQLite database connected successfully');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

testConnection();

module.exports = sequelize;
