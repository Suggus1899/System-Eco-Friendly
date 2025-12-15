const express = require('express');
const router = express.Router();
const {
  getProfile,
  getProgress,
  getBadges,
  updateProfile
} = require('../controllers/usersController');
const { authMiddleware } = require('../middleware/auth');

router.get('/profile', authMiddleware, getProfile);
router.get('/progress', authMiddleware, getProgress);
router.get('/badges', authMiddleware, getBadges);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
