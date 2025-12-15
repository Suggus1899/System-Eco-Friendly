const express = require('express');
const router = express.Router();
const {
  getAllSchedules,
  getSchedulesByZone,
  createSchedule,
  updateSchedule,
  deleteSchedule
} = require('../controllers/schedulesController');
const { authMiddleware, isAdmin } = require('../middleware/auth');

router.get('/', getAllSchedules);
router.get('/zone/:zone', getSchedulesByZone);
router.post('/', authMiddleware, isAdmin, createSchedule);
router.put('/:id', authMiddleware, isAdmin, updateSchedule);
router.delete('/:id', authMiddleware, isAdmin, deleteSchedule);

module.exports = router;
