const db = require('../config/database');

const getAllCenters = async (req, res) => {
  try {
    const { approved } = req.query;
    let query = 'SELECT * FROM recycling_centers WHERE 1=1';
    const params = [];

    if (approved !== undefined) {
      params.push(approved === 'true');
      query += ` AND is_approved = $${params.length}`;
    }

    query += ' ORDER BY name ASC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get centers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getCenterById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM recycling_centers WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Center not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get center error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createCenter = async (req, res) => {
  try {
    const { name, address, latitude, longitude, phone, email, accepted_materials, schedule } = req.body;
    const is_approved = req.user.role === 'admin';

    const result = await db.query(
      'INSERT INTO recycling_centers (name, address, latitude, longitude, phone, email, accepted_materials, schedule, is_approved) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [name, address, latitude, longitude, phone, email, accepted_materials, schedule, is_approved]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create center error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, latitude, longitude, phone, email, accepted_materials, schedule, is_approved } = req.body;

    const result = await db.query(
      'UPDATE recycling_centers SET name = COALESCE($1, name), address = COALESCE($2, address), latitude = COALESCE($3, latitude), longitude = COALESCE($4, longitude), phone = COALESCE($5, phone), email = COALESCE($6, email), accepted_materials = COALESCE($7, accepted_materials), schedule = COALESCE($8, schedule), is_approved = COALESCE($9, is_approved), updated_at = CURRENT_TIMESTAMP WHERE id = $10 RETURNING *',
      [name, address, latitude, longitude, phone, email, accepted_materials, schedule, is_approved, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Center not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update center error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM recycling_centers WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Center not found' });
    }

    res.json({ message: 'Center deleted successfully' });
  } catch (error) {
    console.error('Delete center error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllCenters,
  getCenterById,
  createCenter,
  updateCenter,
  deleteCenter,
};
