const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Challenge = require('./Challenge');

const UserChallenge = sequelize.define('UserChallenge', {
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
  challenge_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Challenge,
      key: 'id'
    }
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  completed_at: {
    type: DataTypes.DATE
  }
});

module.exports = UserChallenge;
