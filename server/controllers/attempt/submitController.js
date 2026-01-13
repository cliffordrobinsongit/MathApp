/**
 * Submit Answer Controller
 *
 * Handles answer submission and validation for students.
 */

const Problem = require('../../models/Problem');
const Attempt = require('../../models/Attempt');
const { validateAnswer, generateFeedback } = require('../../services/claudeService');

// @desc    Submit an answer to a problem
// @route   POST /api/attempts/submit
// @access  Private
const submitAnswer = async (req, res) => {
  try {
    const { problemId, studentAnswer, attemptNumber } = req.body;
    const userId = req.user._id; // From auth middleware

    // Validate input
    if (!problemId || !studentAnswer) {
      return res.status(400).json({
        success: false,
        message: 'Problem ID and student answer are required'
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
    const apiCalls = {
      validation: false,
      feedback: false,
      hint: false
    };

    // Check for recent duplicate answer (within 24 hours)
    const recentAttempt = await Attempt.findRecentDuplicate(
      userId,
      problemId,
      studentAnswer
    );

    // Check if student has already viewed the solution
    const hasViewedSolution = await Attempt.hasViewedSolution(userId, problemId);

    if (hasViewedSolution) {
      return res.status(403).json({
        success: false,
        message: 'You have already viewed the solution for this problem. Please move to the next problem.',
        solutionViewed: true
      });
    }

    let validation, feedbackResult;

    if (recentAttempt) {
      // Use cached validation result
      console.log('✓ Using cached validation from recent attempt');
      validation = {
        isCorrect: recentAttempt.isCorrect,
        reasoning: 'Cached from recent attempt'
      };
      feedbackResult = {
        feedback: recentAttempt.feedback
      };
    } else {
      // Validate the answer using Claude
      apiCalls.validation = true;
      validation = await validateAnswer(
        problem.problemText,
        studentAnswer,
        problem.correctAnswer,
        problem.alternateAnswers
      );

      // Generate feedback
      apiCalls.feedback = true;
      feedbackResult = await generateFeedback(
        problem.problemText,
        studentAnswer,
        validation.isCorrect,
        attemptNumber || 1
      );
    }

    // Save attempt to database
    try {
      await Attempt.create({
        userId: userId,
        problemId: problemId,
        studentAnswer: studentAnswer.trim(),
        isCorrect: validation.isCorrect,
        attemptNumber: attemptNumber || 1,
        feedback: feedbackResult.feedback,
        hintLevel: 'none',
        apiCallsMade: apiCalls
      });
      console.log('✓ Saved attempt to database');
    } catch (err) {
      console.error('Error saving attempt to database:', err);
      // Don't fail the request if saving fails
    }

    // Determine next step
    const nextStep = validation.isCorrect ? 'next_problem' : 'try_again';

    res.status(200).json({
      success: true,
      isCorrect: validation.isCorrect,
      feedback: feedbackResult.feedback,
      reasoning: validation.reasoning,
      nextStep,
      ...(validation.isCorrect && { correctAnswer: problem.correctAnswer })
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit answer. Please try again.'
    });
  }
};

module.exports = {
  submitAnswer
};
