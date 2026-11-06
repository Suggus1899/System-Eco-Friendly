const express = require('express');
const router = express.Router();
const {
  getAllChallenges,
  getWeeklyChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  completeChallenge
} = require('../controllers/challengesController');
const { authMiddleware, isAdmin } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createChallengeSchema, updateChallengeSchema } = require('../schemas/challengesSchemas');

router.get('/', getAllChallenges);
router.get('/weekly', getWeeklyChallenges);
router.get('/:id', getChallengeById);
router.post('/', authMiddleware, isAdmin, validate(createChallengeSchema), createChallenge);
router.put('/:id', authMiddleware, isAdmin, validate(updateChallengeSchema), updateChallenge);
router.delete('/:id', authMiddleware, isAdmin, deleteChallenge);
router.post('/:id/complete', authMiddleware, completeChallenge);

module.exports = router;
