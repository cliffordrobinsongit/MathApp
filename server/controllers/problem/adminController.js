/**
 * Admin Problem Controller
 *
 * Handles problem CRUD operations for administrators.
 */

const Problem = require('../../models/Problem');
const HintCache = require('../../models/HintCache');
const Attempt = require('../../models/Attempt');
const { generateDetailedSolution } = require('../../services/claudeService');

// @desc    Create a new problem (admin only)
// @route   POST /api/admin/problems
// @access  Private + Admin
const createProblem = async (req, res) => {
  try {
    const {
      title,
      category,
      subcategory,
      difficulty,
      problemText,
      answerFormat,
      correctAnswer,
      alternateAnswers,
      preGenerateHints
    } = req.body;

    // Create problem data
    const problemData = {
      title,
      category,
      subcategory,
      difficulty,
      problemText,
      answerFormat,
      correctAnswer,
      alternateAnswers: alternateAnswers || [],
      source: 'admin-manual',
      createdBy: req.userId
    };

    // Pre-generate hints/solutions if requested
    if (preGenerateHints) {
      const { solution } = await generateDetailedSolution(
        problemText,
        correctAnswer,
        difficulty
      );
      problemData.hints = {
        steps: '',
        solution: solution
      };
    }

    // Create problem
    const problem = await Problem.create(problemData);

    res.status(201).json({
      success: true,
      problem
    });
  } catch (error) {
    console.error('Create problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create problem',
      error: error.message
    });
  }
};

// @desc    Update a problem (admin only)
// @route   PUT /api/admin/problems/:id
// @access  Private + Admin
const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      subcategory,
      difficulty,
      problemText,
      answerFormat,
      correctAnswer,
      alternateAnswers,
      regenerateHints
    } = req.body;

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Update fields
    if (title !== undefined) problem.title = title;
    if (category !== undefined) problem.category = category;
    if (subcategory !== undefined) problem.subcategory = subcategory;
    if (difficulty !== undefined) problem.difficulty = difficulty;
    if (problemText !== undefined) problem.problemText = problemText;
    if (answerFormat !== undefined) problem.answerFormat = answerFormat;
    if (correctAnswer !== undefined) problem.correctAnswer = correctAnswer;
    if (alternateAnswers !== undefined) problem.alternateAnswers = alternateAnswers;

    // Regenerate hints if requested
    if (regenerateHints) {
      const { solution } = await generateDetailedSolution(
        problem.problemText,
        problem.correctAnswer,
        problem.difficulty
      );
      problem.hints.solution = solution;

      // Clear hint cache for this problem
      await HintCache.deleteMany({ problemId: id });
    }

    await problem.save();

    res.json({
      success: true,
      problem
    });
  } catch (error) {
    console.error('Update problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update problem',
      error: error.message
    });
  }
};

// @desc    Delete a problem (admin only)
// @route   DELETE /api/admin/problems/:id
// @access  Private + Admin
const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Delete associated hint cache entries
    await HintCache.deleteMany({ problemId: id });

    // Delete problem
    await Problem.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Problem deleted successfully'
    });
  } catch (error) {
    console.error('Delete problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete problem',
      error: error.message
    });
  }
};

// @desc    List problems with pagination and filters (admin only)
// @route   GET /api/admin/problems
// @access  Private + Admin
const listProblems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      difficulty,
      source,
      search
    } = req.query;

    // Build filter
    const filter = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (source) filter.source = source;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { problemText: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate skip
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get problems
    const problems = await Problem.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'username email');

    // Get total count
    const total = await Problem.countDocuments(filter);

    res.json({
      success: true,
      problems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('List problems error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list problems',
      error: error.message
    });
  }
};

// @desc    Bulk delete problems (admin only)
// @route   POST /api/admin/problems/bulk-delete
// @access  Private + Admin
const bulkDeleteProblems = async (req, res) => {
  try {
    const { problemIds } = req.body;

    // Validate input
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'problemIds must be a non-empty array'
      });
    }

    // Delete associated hint cache entries for all problems
    await HintCache.deleteMany({ problemId: { $in: problemIds } });

    // Delete all attempts for these problems
    await Attempt.deleteMany({ problemId: { $in: problemIds } });

    // Delete problems
    const result = await Problem.deleteMany({ _id: { $in: problemIds } });

    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} problem(s)`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Bulk delete problems error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete problems',
      error: error.message
    });
  }
};

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  bulkDeleteProblems,
  listProblems
};
