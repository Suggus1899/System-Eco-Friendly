const express = require('express');
const router = express.Router();
const remindersController = require('../controllers/remindersController');
const { authMiddleware } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createReminderSchema, updateReminderSchema } = require('../schemas/remindersSchemas');

router.get('/', authMiddleware, remindersController.getAllReminders);
router.get('/:id', authMiddleware, remindersController.getReminderById);
router.post('/', authMiddleware, validate(createReminderSchema), remindersController.createReminder);
router.put('/:id', authMiddleware, validate(updateReminderSchema), remindersController.updateReminder);
router.delete('/:id', authMiddleware, remindersController.deleteReminder);

module.exports = router;
