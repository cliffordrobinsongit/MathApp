/**
 * Hint Controller
 *
 * Handles hint generation and caching for students.
 */

const Problem = require('../../models/Problem');
const Attempt = require('../../models/Attempt');
const { generateDynamicHint, generateDetailedSolution } = require('../../services/claudeService');
const { MemoryCache, findCachedHint, saveHintToCache } = require('../../utils/cache');

// In-memory cache for hints (resets on server restart)
// Key format: "problemId-studentAnswer-attemptNumber-level"
const hintCache = new MemoryCache();

// @desc    Get hint for a problem (dynamic, based on student's wrong answer)
// @route   POST /api/attempts/:problemId/hint
// @access  Private
const getHint = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { level, studentAnswer, attemptNumber } = req.body;
    const userId = req.user._id; // From auth middleware

    // Validate input
    if (!level || !['steps', 'solution'].includes(level)) {
      return res.status(400).json({
        success: false,
        message: 'Hint level must be either "steps" or "solution"'
      });
    }

    if (!studentAnswer) {
      return res.status(400).json({
        success: false,
        message: 'Student answer is required for hint generation'
      });
    }

    // Get the problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Track API calls made
    let hintApiCallMade = false;

    // Create cache key
    const cacheKey = `${problemId}-${studentAnswer}-${attemptNumber || 1}-${level}`;

    // Check cache first
    if (hintCache.has(cacheKey)) {
      const cachedHint = hintCache.get(cacheKey);
      console.log('Returning cached hint for:', cacheKey);
      return res.status(200).json({
        success: true,
        level,
        hint: cachedHint,
        nextStep: level === 'steps' ? 'try_again' : 'reveal_solution',
        cached: true
      });
    }

    let hint = '';

    if (level === 'steps') {
      // Check if we have a cached hint for this specific wrong answer
      const cachedHint = await findCachedHint(problemId, studentAnswer);

      if (cachedHint) {
        hint = cachedHint.hint;
      } else {
        // Generate dynamic hint based on student's wrong answer
        console.log(`Generating dynamic hint for problem ${problemId}, student answer: ${studentAnswer}`);
        hintApiCallMade = true;
        const result = await generateDynamicHint(
          problem.problemText,
          problem.correctAnswer,
          studentAnswer,
          attemptNumber || 1,
          problem.difficulty
        );
        hint = result.hint;

        // Save to database for future use
        await saveHintToCache(problemId, studentAnswer, hint);
      }
    } else if (level === 'solution') {
      // Check if problem has cached solution in database
      if (problem.hints && problem.hints.solution && problem.hints.solution.trim() !== '') {
        console.log('✓ Returning cached solution from database');
        hint = problem.hints.solution;
      } else {
        // Generate detailed solution with explicit equations
        console.log('Generating detailed solution and caching to database');
        hintApiCallMade = true;
        const result = await generateDetailedSolution(
          problem.problemText,
          problem.correctAnswer,
          problem.difficulty
        );
        hint = result.solution;

        // Save to database for future use
        try {
          await Problem.findByIdAndUpdate(problemId, {
            'hints.solution': hint
          });
          console.log('✓ Cached solution to database');
        } catch (err) {
          console.error('Error caching solution to database:', err);
        }
      }
    }

    // Save hint request as an attempt
    try {
      await Attempt.create({
        userId: userId,
        problemId: problemId,
        studentAnswer: studentAnswer.trim(),
        isCorrect: false, // If they're asking for a hint, answer was wrong
        attemptNumber: attemptNumber || 1,
        feedback: '', // No feedback on hint requests
        hintLevel: level,
        apiCallsMade: {
          validation: false,
          feedback: false,
          hint: hintApiCallMade
        }
      });
      console.log('✓ Saved hint request to database');
    } catch (err) {
      console.error('Error saving hint request to database:', err);
      // Don't fail the request if saving fails
    }

    // Cache the generated hint in memory (with 1 hour TTL)
    hintCache.set(cacheKey, hint, 60 * 60 * 1000);

    res.status(200).json({
      success: true,
      level,
      hint,
      nextStep: level === 'steps' ? 'try_again' : 'reveal_solution',
      cached: false
    });
  } catch (error) {
    console.error('Get hint error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get hint. Please try again.'
    });
  }
};

module.exports = {
  getHint
};
