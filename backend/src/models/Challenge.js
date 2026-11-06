const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Challenge = sequelize.define('Challenge', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  points_reward: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  challenge_type: {
    type: DataTypes.STRING,
    defaultValue: 'weekly'
  },
  start_date: {
    type: DataTypes.DATEONLY
  },
  end_date: {
    type: DataTypes.DATEONLY
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  },
  target_value: {
    type: DataTypes.INTEGER
  },
  icon: {
    type: DataTypes.STRING
  }
});

module.exports = Challenge;
