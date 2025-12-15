const pool = require('../config/database');

const getAllSchedules = async (req, res, next) => {
  try {
    const { zone } = req.query;
    
    let query = 'SELECT * FROM schedules WHERE active = true';
    const params = [];
    
    if (zone) {
      params.push(zone);
      query += ` AND zone = $${params.length}`;
    }
    
    query += ' ORDER BY zone, day_of_week, time';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getSchedulesByZone = async (req, res, next) => {
  try {
    const { zone } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM schedules WHERE zone = $1 AND active = true ORDER BY day_of_week, time',
      [zone]
    );
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const createSchedule = async (req, res, next) => {
  try {
    const { zone, material_category, day_of_week, time, description, active } = req.body;
    
    if (!zone || !material_category || day_of_week === undefined) {
      return res.status(400).json({ error: 'Zone, material_category, and day_of_week are required' });
    }
    
    const result = await pool.query(
      `INSERT INTO schedules (zone, material_category, day_of_week, time, description, active)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [zone, material_category, day_of_week, time, description, active ?? true]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { zone, material_category, day_of_week, time, description, active } = req.body;
    
    const result = await pool.query(
      `UPDATE schedules 
       SET zone = COALESCE($1, zone),
           material_category = COALESCE($2, material_category),
           day_of_week = COALESCE($3, day_of_week),
           time = COALESCE($4, time),
           description = COALESCE($5, description),
           active = COALESCE($6, active)
       WHERE id = $7
       RETURNING *`,
      [zone, material_category, day_of_week, time, description, active, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM schedules WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSchedules,
  getSchedulesByZone,
  createSchedule,
  updateSchedule,
  deleteSchedule
};
