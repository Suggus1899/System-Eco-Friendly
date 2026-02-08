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
const validate = require('../middleware/validate');
const { createScheduleSchema, updateScheduleSchema } = require('../schemas/schedulesSchemas');

router.get('/', getAllSchedules);
router.get('/zone/:zone', getSchedulesByZone);
router.post('/', authMiddleware, isAdmin, validate(createScheduleSchema), createSchedule);
router.put('/:id', authMiddleware, isAdmin, validate(updateScheduleSchema), updateSchedule);
router.delete('/:id', authMiddleware, isAdmin, deleteSchedule);

module.exports = router;
