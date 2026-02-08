const { Reminder } = require('../models');
const { getPaginationMetadata } = require('../utils/pagination');

const getAllReminders = async (req, res, next) => {
  try {
    const { user_id, zone, active, page: pageQuery, limit: limitQuery, sort, order } = req.query;
    
    const page = parseInt(pageQuery) || 1;
    const limit = parseInt(limitQuery) || 20;
    const offset = (page - 1) * limit;

    const where = {};
    if (user_id) where.user_id = user_id;
    if (zone) where.zone = zone;
    if (active !== undefined) where.active = active === 'true';

    const allowedSortFields = ['title', 'reminder_date', 'created_at', 'zone'];
    const sortField = allowedSortFields.includes(sort) ? sort : 'created_at';
    const sortOrder = order === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await Reminder.findAndCountAll({
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

const getReminderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.findByPk(id);

    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    res.json(reminder);
  } catch (error) {
    next(error);
  }
};

const createReminder = async (req, res, next) => {
  try {
    const { user_id, title, message, zone, material_category, reminder_date, reminder_time, frequency } = req.body;

    const reminder = await Reminder.create({
      user_id,
      title,
      message,
      zone,
      material_category,
      reminder_date,
      reminder_time,
      frequency: frequency || 'once'
    });

    res.status(201).json(reminder);
  } catch (error) {
    next(error);
  }
};

const updateReminder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const reminder = await Reminder.findByPk(id);

    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    await reminder.update(updateData);

    res.json(reminder);
  } catch (error) {
    next(error);
  }
};

const deleteReminder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.findByPk(id);

    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    await reminder.destroy();

    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllReminders,
  getReminderById,
  createReminder,
  updateReminder,
  deleteReminder
};
