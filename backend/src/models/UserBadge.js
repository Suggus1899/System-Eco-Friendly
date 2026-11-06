const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Badge = require('./Badge');

const UserBadge = sequelize.define('UserBadge', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  badge_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Badge,
      key: 'id'
    }
  },
  earned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = UserBadge;
