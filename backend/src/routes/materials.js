const express = require('express');
const router = express.Router();
const {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial
} = require('../controllers/materialsController');
const { authMiddleware, isAdmin } = require('../middleware/auth');

router.get('/', getAllMaterials);
router.get('/:id', getMaterialById);
router.post('/', authMiddleware, isAdmin, createMaterial);
router.put('/:id', authMiddleware, isAdmin, updateMaterial);
router.delete('/:id', authMiddleware, isAdmin, deleteMaterial);

module.exports = router;
