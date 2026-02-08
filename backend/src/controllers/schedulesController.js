const { Schedule } = require('../models');
const { getPaginationMetadata } = require('../utils/pagination');

const getAllSchedules = async (req, res, next) => {
  try {
    const { zone, page: pageQuery, limit: limitQuery, sort, order } = req.query;

    const page = parseInt(pageQuery) || 1;
    const limit = parseInt(limitQuery) || 20;
    const offset = (page - 1) * limit;

    const where = {
      active: true
    };

    if (zone) {
      where.zone = zone;
    }

    const allowedSortFields = ['zone', 'day_of_week', 'time', 'material_category'];
    const sortField = allowedSortFields.includes(sort) ? sort : 'zone';
    const sortOrder = order === 'DESC' ? 'DESC' : 'ASC';

    const { count, rows } = await Schedule.findAndCountAll({
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

const getSchedulesByZone = async (req, res, next) => {
  try {
    const { zone } = req.params;
    
    const schedules = await Schedule.findAll({
      where: { 
        zone, 
        active: true 
      },
      order: [['day_of_week', 'ASC'], ['time', 'ASC']]
    });
    
    res.json(schedules);
  } catch (error) {
    next(error);
  }
};

const createSchedule = async (req, res, next) => {
  try {
    const { zone, material_category, day_of_week, time, description, active } = req.body;
    
    const schedule = await Schedule.create({
      zone,
      material_category,
      day_of_week,
      time,
      description,
      active: active ?? true
    });
    
    res.status(201).json(schedule);
  } catch (error) {
    next(error);
  }
};

const updateSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const schedule = await Schedule.findByPk(id);
    
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    await schedule.update(updateData);
    
    res.json(schedule);
  } catch (error) {
    next(error);
  }
};

const deleteSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findByPk(id);
    
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    await schedule.destroy();
    
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
