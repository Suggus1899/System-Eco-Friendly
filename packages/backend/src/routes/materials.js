const express = require('express');
const router = express.Router();
const {
  getAllMaterials,
  searchMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} = require('../controllers/materialsController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', getAllMaterials);
router.get('/search', searchMaterials);
router.get('/:id', getMaterialById);
router.post('/', authMiddleware, createMaterial);
router.put('/:id', authMiddleware, adminMiddleware, updateMaterial);
router.delete('/:id', authMiddleware, adminMiddleware, deleteMaterial);

module.exports = router;
