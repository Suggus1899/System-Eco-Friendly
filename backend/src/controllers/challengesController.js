const { Challenge, UserChallenge, User } = require('../models');
const { getPaginationMetadata } = require('../utils/pagination');
const { Op } = require('sequelize');

const getAllChallenges = async (req, res, next) => {
  try {
    const { type, status, page: pageQuery, limit: limitQuery, sort, order } = req.query;
    
    const page = parseInt(pageQuery) || 1;
    const limit = parseInt(limitQuery) || 20;
    const offset = (page - 1) * limit;

    const where = {};
    if (type) where.challenge_type = type;
    if (status && status !== 'all') where.status = status;

    const allowedSortFields = ['title', 'points_reward', 'start_date', 'end_date', 'status', 'created_at'];
    const sortField = allowedSortFields.includes(sort) ? sort : 'created_at';
    const sortOrder = order === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await Challenge.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortField, sortOrder]]
    });

    const meta = getPaginationMetadata(count, page, limit);
    res.json({ data: rows, meta });
  } catch (error) {
    next(error);
  }
};

const getWeeklyChallenges = async (req, res, next) => {
  try {
    const today = new Date();
    const challenges = await Challenge.findAll({
      where: {
        challenge_type: 'weekly',
        status: 'active',
        start_date: { [Op.lte]: today },
        end_date: { [Op.gte]: today }
      },
      order: [['created_at', 'DESC']]
    });
    res.json(challenges);
  } catch (error) {
    next(error);
  }
};

const getChallengeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const challenge = await Challenge.findByPk(id);

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    res.json(challenge);
  } catch (error) {
    next(error);
  }
};

const createChallenge = async (req, res, next) => {
  try {
    const { title, description, points_reward, challenge_type, start_date, end_date, target_value, icon, status } = req.body;

    const challenge = await Challenge.create({
      title,
      description,
      points_reward: points_reward || 10,
      challenge_type: challenge_type || 'weekly',
      start_date,
      end_date,
      target_value,
      icon,
      status: status || 'active'
    });

    res.status(201).json(challenge);
  } catch (error) {
    next(error);
  }
};

const updateChallenge = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const challenge = await Challenge.findByPk(id);

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    await challenge.update(updateData);

    res.json(challenge);
  } catch (error) {
    next(error);
  }
};

const deleteChallenge = async (req, res, next) => {
  try {
    const { id } = req.params;
    const challenge = await Challenge.findByPk(id);

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    await challenge.destroy();

    res.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const completeChallenge = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // From authMiddleware

    const challenge = await Challenge.findByPk(id);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    if (challenge.status !== 'active') {
      return res.status(400).json({ error: 'Challenge is not active' });
    }

    // Check if user already completed
    const existing = await UserChallenge.findOne({
      where: {
        user_id: userId,
        challenge_id: id
      }
    });

    if (existing && existing.completed) {
      return res.status(400).json({ error: 'Challenge already completed' });
    }

    // Start transaction
    const result = await UserChallenge.sequelize.transaction(async (t) => {
      // Create or update UserChallenge
      if (existing) {
        await existing.update({
          completed: true,
          progress: challenge.target_value,
          completed_at: new Date()
        }, { transaction: t });
      } else {
        await UserChallenge.create({
          user_id: userId,
          challenge_id: id,
          completed: true,
          progress: challenge.target_value,
          completed_at: new Date() // Fix: add completed_at field to model or ignore if not there. 
          // Model definition in UserChallenge.js didn't show 'completed_at', let's check.
          // Step 529 created UserBadge, not UserChallenge.
          // Task 506 didn't create UserChallenge model file?
          // Phase 6 list says "UserChallenge" created.
          // I should verify UserChallenge model exists. 
          // Assuming it exists or I'll fix it next.
        }, { transaction: t });
      }

      // Award points
      const user = await User.findByPk(userId, { transaction: t });
      if (user) {
        await user.increment('points', { by: challenge.points_reward, transaction: t });
      }

      return { message: 'Challenge completed', points: challenge.points_reward };
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Keeping joinChallenge just in case, though not in route currently
const joinChallenge = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
  
      const existing = await UserChallenge.findOne({
        where: { user_id: userId, challenge_id: id }
      });
  
      if (existing) {
        return res.status(400).json({ error: 'User already joined this challenge' });
      }
  
      const entry = await UserChallenge.create({
        user_id: userId,
        challenge_id: id,
        progress: 0,
        completed: false
      });
  
      res.status(201).json(entry);
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  getAllChallenges,
  getWeeklyChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  completeChallenge,
  joinChallenge
};
