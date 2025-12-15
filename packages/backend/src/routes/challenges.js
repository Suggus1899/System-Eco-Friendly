const express = require('express');
const router = express.Router();
const {
  getAllChallenges,
  getChallengeById,
  getUserChallenges,
  completeChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge,
} = require('../controllers/challengesController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', getAllChallenges);
router.get('/user/me', authMiddleware, getUserChallenges);
router.get('/:id', getChallengeById);
router.post('/:challengeId/complete', authMiddleware, completeChallenge);
router.post('/', authMiddleware, adminMiddleware, createChallenge);
router.put('/:id', authMiddleware, adminMiddleware, updateChallenge);
router.delete('/:id', authMiddleware, adminMiddleware, deleteChallenge);

module.exports = router;
