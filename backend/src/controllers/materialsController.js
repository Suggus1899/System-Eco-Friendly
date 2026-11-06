const { Material } = require('../models');
const { Op } = require('sequelize');
const { getPaginationMetadata } = require('../utils/pagination');

const getAllMaterials = async (req, res, next) => {
  try {
    const { category, search, page: pageQuery, limit: limitQuery, sort, order } = req.query;
    
    // Pagination defaults
    const page = parseInt(pageQuery) || 1;
    const limit = parseInt(limitQuery) || 20;
    const offset = (page - 1) * limit;

    // Filters
    const where = {};
    if (category) {
      where.category = category;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Sorting
    const allowedSortFields = ['name', 'category', 'createdAt', 'updatedAt'];
    const sortField = allowedSortFields.includes(sort) ? sort : 'name';
    const sortOrder = order === 'DESC' ? 'DESC' : 'ASC';

    const { count, rows } = await Material.findAndCountAll({
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

const getMaterialById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const material = await Material.findByPk(id);

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    res.json(material);
  } catch (error) {
    next(error);
  }
};

const createMaterial = async (req, res, next) => {
  try {
    const { name, category, description, disposal_instructions, recyclable, image_url } = req.body;

    // Validation is handled by middleware, but check required fields here too if needed
    // Assuming schema validation is passed
    
    const material = await Material.create({
      name,
      category,
      description,
      disposal_instructions,
      recyclable: recyclable ?? true,
      image_url
    });

    res.status(201).json(material);
  } catch (error) {
    next(error);
  }
};

const updateMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const material = await Material.findByPk(id);

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    await material.update(updateData);

    res.json(material);
  } catch (error) {
    next(error);
  }
};

const deleteMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const material = await Material.findByPk(id);

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    await material.destroy();

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
