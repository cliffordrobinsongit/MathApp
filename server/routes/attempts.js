const express = require('express');
const router = express.Router();
const { submitAnswer, getHint } = require('../controllers/attemptController');
const authenticate = require('../middleware/auth');

// @route   POST /api/attempts/submit
// @desc    Submit an answer to a problem
// @access  Private
router.post('/submit', authenticate, submitAnswer);

// @route   POST /api/attempts/:problemId/hint
// @desc    Get dynamic hint for a problem (body: level, studentAnswer, attemptNumber)
// @access  Private
router.post('/:problemId/hint', authenticate, getHint);

module.exports = router;
