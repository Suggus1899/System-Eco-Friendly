const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const { authMiddleware, isAdmin } = require('../middleware/auth');

// Protect all export routes (admin only)
router.get('/materials', authMiddleware, isAdmin, exportController.exportMaterials);
router.get('/centers', authMiddleware, isAdmin, exportController.exportCenters);
router.get('/schedules', authMiddleware, isAdmin, exportController.exportSchedules);
router.get('/challenges', authMiddleware, isAdmin, exportController.exportChallenges);

module.exports = router;
