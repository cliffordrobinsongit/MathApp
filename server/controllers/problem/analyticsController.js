/**
 * Problem Analytics Controller
 *
 * Handles analytics and database seeding operations for problems.
 */

const Problem = require('../../models/Problem');
const Attempt = require('../../models/Attempt');
const sampleProblems = require('../../utils/problemData');

// @desc    Get problem analytics (admin only)
// @route   GET /api/admin/problems/:id/analytics
// @access  Private + Admin
const getProblemAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Use existing Attempt model method
    const metrics = await Attempt.getProblemMetrics(id);

    res.json({
      success: true,
      problem: {
        id: problem._id,
        title: problem.title,
        category: problem.category,
        difficulty: problem.difficulty
      },
      ...metrics
    });
  } catch (error) {
    console.error('Get problem analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get problem analytics',
      error: error.message
    });
  }
};

// @desc    Seed database with sample problems
// @route   POST /api/problems/seed
// @access  Private (development only)
const seed = async (req, res) => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'Seeding is not allowed in production'
      });
    }

    // Clear existing problems
    await Problem.deleteMany({});

    // Insert sample problems
    const problems = await Problem.insertMany(sampleProblems);

    res.status(201).json({
      success: true,
      message: `Successfully seeded ${problems.length} problems`,
      count: problems.length
    });
  } catch (error) {
    console.error('Seed database error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message
    });
  }
};

module.exports = {
  getProblemAnalytics,
  seed
};
