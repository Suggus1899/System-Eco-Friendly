const express = require('express');
const router = express.Router();
const {
  getAllCenters,
  getCenterById,
  createCenter,
  updateCenter,
  deleteCenter,
} = require('../controllers/centersController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', getAllCenters);
router.get('/:id', getCenterById);
router.post('/', authMiddleware, createCenter);
router.put('/:id', authMiddleware, adminMiddleware, updateCenter);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCenter);

module.exports = router;
