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
const validate = require('../middleware/validate');
const { createMaterialSchema, updateMaterialSchema } = require('../schemas/materialsSchemas');

router.get('/', getAllMaterials);
router.get('/:id', getMaterialById);
router.post('/', authMiddleware, isAdmin, validate(createMaterialSchema), createMaterial);
router.put('/:id', authMiddleware, isAdmin, validate(updateMaterialSchema), updateMaterial);
router.delete('/:id', authMiddleware, isAdmin, deleteMaterial);

module.exports = router;
