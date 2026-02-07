const db = require('../config/database');

const getAllMaterials = async (req, res) => {
  try {
    const { category, approved } = req.query;
    let query = 'SELECT * FROM materials WHERE 1=1';
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (approved !== undefined) {
      params.push(approved === 'true');
      query += ` AND is_approved = $${params.length}`;
    }

    query += ' ORDER BY name ASC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const searchMaterials = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const result = await db.query(
      'SELECT * FROM materials WHERE is_approved = true AND (name ILIKE $1 OR description ILIKE $1) ORDER BY name ASC',
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Search materials error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM materials WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get material error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createMaterial = async (req, res) => {
  try {
    const { name, category, description, disposal_instructions, image_url } = req.body;
    const is_approved = req.user.role === 'admin';

    const result = await db.query(
      'INSERT INTO materials (name, category, description, disposal_instructions, image_url, is_approved) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, category, description, disposal_instructions, image_url, is_approved]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create material error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, disposal_instructions, image_url, is_approved } = req.body;

    const result = await db.query(
      'UPDATE materials SET name = COALESCE($1, name), category = COALESCE($2, category), description = COALESCE($3, description), disposal_instructions = COALESCE($4, disposal_instructions), image_url = COALESCE($5, image_url), is_approved = COALESCE($6, is_approved), updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [name, category, description, disposal_instructions, image_url, is_approved, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update material error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM materials WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }

    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllMaterials,
  searchMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
};
