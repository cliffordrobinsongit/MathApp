const express = require('express');
const router = express.Router();
const { submitAnswer, getHint } = require('../controllers/attemptController');
const authenticate = require('../middleware/auth');

// @route   POST /api/attempts/submit
// @desc    Submit an answer to a problem
// @access  Private
router.post('/submit', authenticate, submitAnswer);

// @route   GET /api/attempts/:problemId/hint
// @desc    Get hint for a problem (query param: level=steps|solution)
// @access  Private
router.get('/:problemId/hint', authenticate, getHint);

module.exports = router;
