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

router.get('/', getAllChallenges);
router.get('/weekly', getWeeklyChallenges);
router.get('/:id', getChallengeById);
router.post('/', authMiddleware, isAdmin, createChallenge);
router.put('/:id', authMiddleware, isAdmin, updateChallenge);
router.delete('/:id', authMiddleware, isAdmin, deleteChallenge);
router.post('/:id/complete', authMiddleware, completeChallenge);

module.exports = router;
