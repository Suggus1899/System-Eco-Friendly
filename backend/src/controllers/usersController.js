const { User, UserChallenge, Challenge, Badge, UserBadge } = require('../models');
const { Op } = require('sequelize');

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId, {
      attributes: ['id', 'email', 'name', 'role', 'zone', 'points', 'created_at']
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const getProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const completedChallengesCount = await UserChallenge.count({
      where: {
        user_id: userId,
        completed: true
      }
    });

    const inProgressChallenges = await Challenge.findAll({
      include: [{
        model: UserChallenge,
        where: {
          user_id: userId,
          completed: false
        },
        attributes: ['progress', 'completed']
      }],
      order: [['end_date', 'ASC']]
    });

    // Formatting the response to match previous structure
    const challenges = inProgressChallenges.map(c => {
      const json = c.toJSON();
      const uc = json.UserChallenges[0];
      return {
        ...json,
        progress: uc.progress,
        completed: uc.completed,
        UserChallenges: undefined // cleanup
      };
    });
    
    res.json({
      points: user.points,
      completed_challenges: completedChallengesCount,
      in_progress_challenges: challenges
    });
  } catch (error) {
    next(error);
  }
};

const getBadges = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const badges = await Badge.findAll({
      include: [{
        model: UserBadge,
        where: { user_id: userId },
        attributes: ['earned_at'] // Include earned_at from junction table
      }],
      order: [[UserBadge, 'earned_at', 'DESC']]
    });

    // Flatten structure if needed or keep as is. 
    // Sequelize returns: Badge { ..., UserBadges: [ { earned_at: ... } ] }
    // The raw query returned flat badges with earned_at.
    const result = badges.map(b => {
      const json = b.toJSON();
      const earnedAt = json.UserBadges[0].earned_at;
      return {
        ...json,
        earned_at: earnedAt,
        UserBadges: undefined
      };
    });
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, zone } = req.body;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await user.update({ name, zone });
    
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      zone: user.zone,
      points: user.points
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  getProgress,
  getBadges,
  updateProfile
};
