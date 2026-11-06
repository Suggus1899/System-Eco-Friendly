const sequelize = require('../config/database');
const User = require('./User');
const Material = require('./Material');
const Center = require('./Center');
const Schedule = require('./Schedule');
const Challenge = require('./Challenge');
const UserChallenge = require('./UserChallenge');
const Reminder = require('./Reminder');
const Badge = require('./Badge');
const UserBadge = require('./UserBadge');

// Relationships

// User has many Reminders
User.hasMany(Reminder, { foreignKey: 'user_id' });
Reminder.belongsTo(User, { foreignKey: 'user_id' });

// User BelongsToMany Challenges (through UserChallenge)
User.belongsToMany(Challenge, { through: UserChallenge, foreignKey: 'user_id' });
Challenge.belongsToMany(User, { through: UserChallenge, foreignKey: 'challenge_id' });

// User BelongsToMany Badges (through UserBadge)
User.belongsToMany(Badge, { through: UserBadge, foreignKey: 'user_id' });
Badge.belongsToMany(User, { through: UserBadge, foreignKey: 'badge_id' });

module.exports = {
  sequelize,
  User,
  Material,
  Center,
  Schedule,
  Challenge,
  UserChallenge,
  Reminder,
  Badge,
  UserBadge
};
