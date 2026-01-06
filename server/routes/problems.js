const express = require('express');
const router = express.Router();
const { getRandom, getById, seed } = require('../controllers/problemController');
const authenticate = require('../middleware/auth');

// @route   GET /api/problems/random
// @desc    Get a random problem (optional query: ?category=algebra&difficulty=algebra-1)
// @access  Private
router.get('/random', authenticate, getRandom);

// @route   GET /api/problems/:id
// @desc    Get problem by ID
// @access  Private
router.get('/:id', authenticate, getById);

// @route   POST /api/problems/seed
// @desc    Seed database with sample problems (development only)
// @access  Private
router.post('/seed', authenticate, seed);

module.exports = router;
