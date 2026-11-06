const { Center } = require('../models');
const { Op } = require('sequelize');
const { getPaginationMetadata } = require('../utils/pagination');

const getAllCenters = async (req, res, next) => {
  try {
    const { status, material, page: pageQuery, limit: limitQuery, sort, order } = req.query;

    const page = parseInt(pageQuery) || 1;
    const limit = parseInt(limitQuery) || 20;
    const offset = (page - 1) * limit;

    const where = {};
    
    if (status) {
      where.status = status;
    }

    // Filter by accepted materials (JSON array)
    if (material) {
      where.accepted_materials = {
        [Op.like]: `%${material}%`
      };
    }

    const allowedSortFields = ['name', 'status', 'createdAt', 'updatedAt'];
    const sortField = allowedSortFields.includes(sort) ? sort : 'name';
    const sortOrder = order === 'DESC' ? 'DESC' : 'ASC';

    const { count, rows } = await Center.findAndCountAll({
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

const getCenterById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const center = await Center.findByPk(id);

    if (!center) {
      return res.status(404).json({ error: 'Center not found' });
    }

    res.json(center);
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

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const rad = parseFloat(radius);

    // Fetch all active centers
    const centers = await Center.findAll({
      where: { status: 'active' }
    });

    // Calculate distance in JS (SQLite doesn't support trig functions by default)
    const deg2rad = (deg) => deg * (Math.PI / 180);
    
    const nearby = centers.map(center => {
      const c = center.toJSON();
      const R = 6371; // Radius of the earth in km
      const dLat = deg2rad(c.latitude - lat);
      const dLon = deg2rad(c.longitude - lon);
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat)) * Math.cos(deg2rad(c.latitude)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
      const c_dist = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      const d = R * c_dist; // Distance in km
      
      return { ...c, distance: d };
    })
    .filter(c => c.distance <= rad)
    .sort((a, b) => a.distance - b.distance);

    res.json(nearby);
  } catch (error) {
    next(error);
  }
};

const createCenter = async (req, res, next) => {
  try {
    const { name, address, latitude, longitude, phone, email, accepted_materials, hours_operation, status } = req.body;

    const center = await Center.create({
      name,
      address,
      latitude,
      longitude,
      phone,
      email,
      accepted_materials,
      hours_operation,
      status: status || 'pending'
    });

    res.status(201).json(center);
  } catch (error) {
    next(error);
  }
};

const updateCenter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const center = await Center.findByPk(id);

    if (!center) {
      return res.status(404).json({ error: 'Center not found' });
    }

    await center.update(updateData);

    res.json(center);
  } catch (error) {
    next(error);
  }
};

const deleteCenter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const center = await Center.findByPk(id);

    if (!center) {
      return res.status(404).json({ error: 'Center not found' });
    }

    await center.destroy();

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
