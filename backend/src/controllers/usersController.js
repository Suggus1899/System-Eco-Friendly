const pool = require('../config/database');

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      'SELECT id, email, name, role, zone, points, created_at FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const getProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get user points
    const userResult = await pool.query(
      'SELECT points FROM users WHERE id = $1',
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get completed challenges count
    const challengesResult = await pool.query(
      'SELECT COUNT(*) as completed_challenges FROM user_challenges WHERE user_id = $1 AND completed = true',
      [userId]
    );
    
    // Get in-progress challenges
    const inProgressResult = await pool.query(
      `SELECT c.*, uc.progress, uc.completed 
       FROM challenges c
       JOIN user_challenges uc ON c.id = uc.challenge_id
       WHERE uc.user_id = $1 AND uc.completed = false
       ORDER BY c.end_date ASC`,
      [userId]
    );
    
    res.json({
      points: userResult.rows[0].points,
      completed_challenges: parseInt(challengesResult.rows[0].completed_challenges),
      in_progress_challenges: inProgressResult.rows
    });
  } catch (error) {
    next(error);
  }
};

const getBadges = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      `SELECT b.*, ub.earned_at 
       FROM badges b
       JOIN user_badges ub ON b.id = ub.badge_id
       WHERE ub.user_id = $1
       ORDER BY ub.earned_at DESC`,
      [userId]
    );
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, zone } = req.body;
    
    const result = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           zone = COALESCE($2, zone)
       WHERE id = $3
       RETURNING id, email, name, role, zone, points`,
      [name, zone, userId]
    );
    
    res.json(result.rows[0]);
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
