const Problem = require('../models/Problem');
const { validateAnswer, generateFeedback } = require('../services/claudeService');

// @desc    Submit an answer to a problem
// @route   POST /api/attempts/submit
// @access  Private
const submitAnswer = async (req, res) => {
  try {
    const { problemId, studentAnswer, attemptNumber } = req.body;

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

    // Validate the answer using Claude
    const validation = await validateAnswer(
      problem.problemText,
      studentAnswer,
      problem.correctAnswer,
      problem.alternateAnswers
    );

    // Generate feedback
    const feedbackResult = await generateFeedback(
      problem.problemText,
      studentAnswer,
      validation.isCorrect,
      attemptNumber || 1
    );

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

// @desc    Get hint for a problem
// @route   GET /api/attempts/:problemId/hint?level=steps|solution
// @access  Private
const getHint = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { level } = req.query;

    // Validate level
    if (!level || !['steps', 'solution'].includes(level)) {
      return res.status(400).json({
        success: false,
        message: 'Hint level must be either "steps" or "solution"'
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

    // Get hint based on level
    let hint = '';
    if (level === 'steps') {
      hint = problem.hints?.steps || 'No hints available for this problem.';
    } else if (level === 'solution') {
      hint = problem.hints?.solution || problem.explanation || 'No solution available for this problem.';
    }

    res.status(200).json({
      success: true,
      level,
      hint,
      nextStep: level === 'steps' ? 'try_again' : 'reveal_solution'
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
  submitAnswer,
  getHint
};
