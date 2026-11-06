const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Badge = sequelize.define('Badge', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING
  },
  requirement_type: {
    type: DataTypes.STRING // points, challenges_completed, days_active
  },
  requirement_value: {
    type: DataTypes.INTEGER
  }
});

module.exports = Badge;
