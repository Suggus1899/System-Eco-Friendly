const pool = require('../config/database');

const getAllChallenges = async (req, res, next) => {
  try {
    const { status = 'active' } = req.query;
    
    const result = await pool.query(
      'SELECT * FROM challenges WHERE status = $1 ORDER BY created_at DESC',
      [status]
    );
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getWeeklyChallenges = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM challenges 
       WHERE status = 'active' 
       AND challenge_type = 'weekly'
       AND start_date <= CURRENT_DATE 
       AND end_date >= CURRENT_DATE
       ORDER BY created_at DESC`
    );
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getChallengeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM challenges WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const createChallenge = async (req, res, next) => {
  try {
    const { title, description, points_reward, challenge_type, start_date, end_date, status, target_value, icon } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    
    const result = await pool.query(
      `INSERT INTO challenges (title, description, points_reward, challenge_type, start_date, end_date, status, target_value, icon)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [title, description, points_reward || 10, challenge_type || 'weekly', start_date, end_date, status || 'active', target_value, icon]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateChallenge = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, points_reward, challenge_type, start_date, end_date, status, target_value, icon } = req.body;
    
    const result = await pool.query(
      `UPDATE challenges 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           points_reward = COALESCE($3, points_reward),
           challenge_type = COALESCE($4, challenge_type),
           start_date = COALESCE($5, start_date),
           end_date = COALESCE($6, end_date),
           status = COALESCE($7, status),
           target_value = COALESCE($8, target_value),
           icon = COALESCE($9, icon)
       WHERE id = $10
       RETURNING *`,
      [title, description, points_reward, challenge_type, start_date, end_date, status, target_value, icon, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteChallenge = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM challenges WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    res.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const completeChallenge = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if challenge exists and is active
    const challengeResult = await pool.query(
      'SELECT * FROM challenges WHERE id = $1 AND status = $2',
      [id, 'active']
    );
    
    if (challengeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found or not active' });
    }
    
    const challenge = challengeResult.rows[0];
    
    // Check if user has already completed this challenge
    const progressResult = await pool.query(
      'SELECT * FROM user_challenges WHERE user_id = $1 AND challenge_id = $2',
      [userId, id]
    );
    
    if (progressResult.rows.length > 0 && progressResult.rows[0].completed) {
      return res.status(400).json({ error: 'Challenge already completed' });
    }
    
    // Mark challenge as completed and award points
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Update or insert user challenge progress
      if (progressResult.rows.length > 0) {
        await client.query(
          `UPDATE user_challenges 
           SET progress = $1, completed = true, completed_at = CURRENT_TIMESTAMP
           WHERE user_id = $2 AND challenge_id = $3`,
          [challenge.target_value || 1, userId, id]
        );
      } else {
        await client.query(
          `INSERT INTO user_challenges (user_id, challenge_id, progress, completed, completed_at)
           VALUES ($1, $2, $3, true, CURRENT_TIMESTAMP)`,
          [userId, id, challenge.target_value || 1]
        );
      }
      
      // Award points to user
      await client.query(
        'UPDATE users SET points = points + $1 WHERE id = $2',
        [challenge.points_reward, userId]
      );
      
      await client.query('COMMIT');
      
      res.json({ 
        message: 'Challenge completed successfully',
        points_earned: challenge.points_reward
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
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
  completeChallenge
};
