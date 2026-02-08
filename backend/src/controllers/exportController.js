const { Material, Center, Schedule, Challenge } = require('../models');
const { convertToCSV } = require('../utils/csv');

const exportMaterials = async (req, res, next) => {
  try {
    const materials = await Material.findAll({
      order: [['id', 'ASC']]
    });
    
    // Convert Sequelize instances to plain objects
    const data = materials.map(m => m.toJSON());
    const fields = ['id', 'name', 'category', 'description', 'disposal_instructions', 'recyclable', 'created_at'];
    
    const csv = convertToCSV(data, fields);
    
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="materials.csv"');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

const exportCenters = async (req, res, next) => {
  try {
    const centers = await Center.findAll({
      order: [['id', 'ASC']]
    });
    
    const data = centers.map(c => {
      const plain = c.toJSON();
      // Ensure accepted_materials is string for CSV if it's an array
      if (Array.isArray(plain.accepted_materials)) {
        plain.accepted_materials = JSON.stringify(plain.accepted_materials);
      }
      return plain;
    });
    
    const fields = ['id', 'name', 'address', 'latitude', 'longitude', 'phone', 'email', 'status', 'created_at', 'accepted_materials'];
    
    const csv = convertToCSV(data, fields);
    
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="centers.csv"');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

const exportSchedules = async (req, res, next) => {
  try {
    const schedules = await Schedule.findAll({
      order: [['zone', 'ASC'], ['day_of_week', 'ASC']]
    });
    
    const data = schedules.map(s => s.toJSON());
    const fields = ['id', 'zone', 'material_category', 'day_of_week', 'time', 'active', 'description'];
    
    const csv = convertToCSV(data, fields);
    
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="schedules.csv"');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

const exportChallenges = async (req, res, next) => {
  try {
    const challenges = await Challenge.findAll({
      order: [['created_at', 'DESC']]
    });
    
    const data = challenges.map(c => c.toJSON());
    const fields = ['id', 'title', 'description', 'points_reward', 'challenge_type', 'start_date', 'end_date', 'status', 'target_value'];
    
    const csv = convertToCSV(data, fields);
    
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="challenges.csv"');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  exportMaterials,
  exportCenters,
  exportSchedules,
  exportChallenges
};
