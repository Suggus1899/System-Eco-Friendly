const db = require('../config/database');

const getSchedulesByZone = async (req, res) => {
  try {
    const { zone } = req.params;
    const result = await db.query(
      'SELECT * FROM collection_schedules WHERE zone = $1 ORDER BY day_of_week, time',
      [zone]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAllSchedules = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM collection_schedules ORDER BY zone, day_of_week, time');
    res.json(result.rows);
  } catch (error) {
    console.error('Get all schedules error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createSchedule = async (req, res) => {
  try {
    const { zone, material_type, day_of_week, time, description } = req.body;

    const result = await db.query(
      'INSERT INTO collection_schedules (zone, material_type, day_of_week, time, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [zone, material_type, day_of_week, time, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { zone, material_type, day_of_week, time, description } = req.body;

    const result = await db.query(
      'UPDATE collection_schedules SET zone = COALESCE($1, zone), material_type = COALESCE($2, material_type), day_of_week = COALESCE($3, day_of_week), time = COALESCE($4, time), description = COALESCE($5, description), updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [zone, material_type, day_of_week, time, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM collection_schedules WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getSchedulesByZone,
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
