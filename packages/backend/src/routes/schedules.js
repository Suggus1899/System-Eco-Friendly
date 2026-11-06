const express = require('express');
const router = express.Router();
const {
  getSchedulesByZone,
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} = require('../controllers/schedulesController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', getAllSchedules);
router.get('/zone/:zone', getSchedulesByZone);
router.post('/', authMiddleware, adminMiddleware, createSchedule);
router.put('/:id', authMiddleware, adminMiddleware, updateSchedule);
router.delete('/:id', authMiddleware, adminMiddleware, deleteSchedule);

module.exports = router;
