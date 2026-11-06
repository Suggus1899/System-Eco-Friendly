const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Reminder = sequelize.define('Reminder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT
  },
  zone: {
    type: DataTypes.STRING
  },
  material_category: {
    type: DataTypes.STRING
  },
  reminder_date: {
    type: DataTypes.DATEONLY
  },
  reminder_time: {
    type: DataTypes.TIME
  },
  frequency: {
    type: DataTypes.STRING,
    defaultValue: 'once' // once, weekly, monthly
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Reminder;
