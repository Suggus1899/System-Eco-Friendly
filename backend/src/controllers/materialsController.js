const pool = require('../config/database');

const getAllMaterials = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    
    let query = 'SELECT * FROM materials WHERE 1=1';
    const params = [];
    
    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }
    
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }
    
    query += ' ORDER BY name ASC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getMaterialById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM materials WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const createMaterial = async (req, res, next) => {
  try {
    const { name, category, description, disposal_instructions, recyclable, image_url } = req.body;
    
    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }
    
    const result = await pool.query(
      `INSERT INTO materials (name, category, description, disposal_instructions, recyclable, image_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, category, description, disposal_instructions, recyclable ?? true, image_url]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, description, disposal_instructions, recyclable, image_url } = req.body;
    
    const result = await pool.query(
      `UPDATE materials 
       SET name = COALESCE($1, name),
           category = COALESCE($2, category),
           description = COALESCE($3, description),
           disposal_instructions = COALESCE($4, disposal_instructions),
           recyclable = COALESCE($5, recyclable),
           image_url = COALESCE($6, image_url)
       WHERE id = $7
       RETURNING *`,
      [name, category, description, disposal_instructions, recyclable, image_url, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM materials WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial
};
