const pool = require('../config/database');

const getAllCenters = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    let query = 'SELECT * FROM centers WHERE 1=1';
    const params = [];
    
    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    } else {
      query += " AND status = 'active'";
    }
    
    query += ' ORDER BY name ASC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getCenterById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM centers WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Center not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const getNearbyCenters = async (req, res, next) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    // Simple distance calculation using Haversine formula
    const query = `
      SELECT *,
        (
          6371 * acos(
            cos(radians($1)) * cos(radians(latitude)) *
            cos(radians(longitude) - radians($2)) +
            sin(radians($1)) * sin(radians(latitude))
          )
        ) AS distance
      FROM centers
      WHERE status = 'active'
      HAVING distance < $3
      ORDER BY distance ASC
    `;
    
    const result = await pool.query(query, [latitude, longitude, radius]);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const createCenter = async (req, res, next) => {
  try {
    const { name, address, latitude, longitude, phone, email, accepted_materials, hours_operation, status } = req.body;
    
    if (!name || !address || !latitude || !longitude) {
      return res.status(400).json({ error: 'Name, address, latitude, and longitude are required' });
    }
    
    const result = await pool.query(
      `INSERT INTO centers (name, address, latitude, longitude, phone, email, accepted_materials, hours_operation, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [name, address, latitude, longitude, phone, email, accepted_materials, hours_operation, status || 'pending']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateCenter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, address, latitude, longitude, phone, email, accepted_materials, hours_operation, status } = req.body;
    
    const result = await pool.query(
      `UPDATE centers 
       SET name = COALESCE($1, name),
           address = COALESCE($2, address),
           latitude = COALESCE($3, latitude),
           longitude = COALESCE($4, longitude),
           phone = COALESCE($5, phone),
           email = COALESCE($6, email),
           accepted_materials = COALESCE($7, accepted_materials),
           hours_operation = COALESCE($8, hours_operation),
           status = COALESCE($9, status)
       WHERE id = $10
       RETURNING *`,
      [name, address, latitude, longitude, phone, email, accepted_materials, hours_operation, status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Center not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteCenter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM centers WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Center not found' });
    }
    
    res.json({ message: 'Center deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCenters,
  getCenterById,
  getNearbyCenters,
  createCenter,
  updateCenter,
  deleteCenter
};
