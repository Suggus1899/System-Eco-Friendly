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
const validate = require('../middleware/validate');
const { createCenterSchema, updateCenterSchema } = require('../schemas/centersSchemas');

router.get('/', getAllCenters);
router.get('/nearby', getNearbyCenters);
router.get('/:id', getCenterById);
router.post('/', authMiddleware, isAdmin, validate(createCenterSchema), createCenter);
router.put('/:id', authMiddleware, isAdmin, validate(updateCenterSchema), updateCenter);
router.delete('/:id', authMiddleware, isAdmin, deleteCenter);

module.exports = router;
