const db = require('../config/database');

const getAllChallenges = async (req, res) => {
  try {
    const { active } = req.query;
    let query = 'SELECT * FROM challenges WHERE 1=1';
    const params = [];

    if (active !== undefined) {
      params.push(active === 'true');
      query += ` AND is_active = $${params.length}`;
    }

    query += ' ORDER BY start_date DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getChallengeById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM challenges WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserChallenges = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.*, uc.completed, uc.completed_at 
       FROM challenges c 
       LEFT JOIN user_challenges uc ON c.id = uc.challenge_id AND uc.user_id = $1 
       WHERE c.is_active = true 
       ORDER BY c.start_date DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get user challenges error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const completeChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user.id;

    const challengeResult = await db.query('SELECT * FROM challenges WHERE id = $1 AND is_active = true', [challengeId]);
    if (challengeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found or inactive' });
    }

    const challenge = challengeResult.rows[0];

    const existingResult = await db.query(
      'SELECT * FROM user_challenges WHERE user_id = $1 AND challenge_id = $2',
      [userId, challengeId]
    );

    if (existingResult.rows.length > 0 && existingResult.rows[0].completed) {
      return res.status(400).json({ error: 'Challenge already completed' });
    }

    await db.query(
      'INSERT INTO user_challenges (user_id, challenge_id, completed, completed_at) VALUES ($1, $2, true, CURRENT_TIMESTAMP) ON CONFLICT (user_id, challenge_id) DO UPDATE SET completed = true, completed_at = CURRENT_TIMESTAMP',
      [userId, challengeId]
    );

    await db.query(
      'UPDATE users SET points = points + $1 WHERE id = $2',
      [challenge.points, userId]
    );

    res.json({ message: 'Challenge completed', points_earned: challenge.points });
  } catch (error) {
    console.error('Complete challenge error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createChallenge = async (req, res) => {
  try {
    const { title, description, points, start_date, end_date, difficulty } = req.body;

    const result = await db.query(
      'INSERT INTO challenges (title, description, points, start_date, end_date, difficulty) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, points, start_date, end_date, difficulty]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create challenge error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, points, start_date, end_date, difficulty, is_active } = req.body;

    const result = await db.query(
      'UPDATE challenges SET title = COALESCE($1, title), description = COALESCE($2, description), points = COALESCE($3, points), start_date = COALESCE($4, start_date), end_date = COALESCE($5, end_date), difficulty = COALESCE($6, difficulty), is_active = COALESCE($7, is_active), updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *',
      [title, description, points, start_date, end_date, difficulty, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update challenge error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM challenges WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    res.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    console.error('Delete challenge error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllChallenges,
  getChallengeById,
  getUserChallenges,
  completeChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge,
};
