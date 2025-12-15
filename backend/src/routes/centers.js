const express = require('express');
const router = express.Router();
const {
  getAllCenters,
  getCenterById,
  getNearbyCenters,
  createCenter,
  updateCenter,
  deleteCenter
} = require('../controllers/centersController');
const { authMiddleware, isAdmin } = require('../middleware/auth');

router.get('/', getAllCenters);
router.get('/nearby', getNearbyCenters);
router.get('/:id', getCenterById);
router.post('/', authMiddleware, isAdmin, createCenter);
router.put('/:id', authMiddleware, isAdmin, updateCenter);
router.delete('/:id', authMiddleware, isAdmin, deleteCenter);

module.exports = router;
