/**
 * Student Problem Controller
 *
 * Handles problem retrieval operations for students.
 */

const Problem = require('../../models/Problem');

// @desc    Get a random problem
// @route   GET /api/problems/random
// @access  Private
const getRandom = async (req, res) => {
  try {
    const { category, difficulty } = req.query;

    // Build filter
    const filter = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    // Count total problems matching filter
    const count = await Problem.countDocuments(filter);

    if (count === 0) {
      return res.status(404).json({
        success: false,
        message: 'No problems found matching the criteria'
      });
    }

    // Get random index
    const randomIndex = Math.floor(Math.random() * count);

    // Get random problem
    const problem = await Problem.findOne(filter).skip(randomIndex);

    res.status(200).json({
      success: true,
      problem
    });
  } catch (error) {
    console.error('Get random problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get random problem'
    });
  }
};

// @desc    Get problem by ID
// @route   GET /api/problems/:id
// @access  Private
const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findById(id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    res.status(200).json({
      success: true,
      problem
    });
  } catch (error) {
    console.error('Get problem by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get problem'
    });
  }
};

module.exports = {
  getRandom,
  getById
};
