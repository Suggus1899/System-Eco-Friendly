const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Center = sequelize.define('Center', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  // Store accepted_materials array as JSON string in SQLite
  // Sequelize handles JSON parsing automatically for dialects that support it,
  // but for SQLite it might need manual handling or DataTypes.JSON if supported by library version
  // We'll use JSON type, Sequelize shims it for SQLite usually.
  accepted_materials: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  hours_operation: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending' // active, inactive, pending
  }
});

module.exports = Center;
