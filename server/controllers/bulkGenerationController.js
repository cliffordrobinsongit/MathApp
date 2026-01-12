const Problem = require('../models/Problem');
const { generateSimilarProblems, generateDetailedSolution } = require('../services/claudeService');

// @desc    Bulk generate problems from example
// @route   POST /api/admin/bulk-generate
// @access  Private + Admin
const bulkGenerate = async (req, res) => {
  try {
    const { exampleProblemId, count, preGenerateHints = true } = req.body;

    // Validate count
    if (!count || count < 1 || count > 20) {
      return res.status(400).json({
        success: false,
        message: 'Count must be between 1 and 20'
      });
    }

    // Fetch example problem
    const exampleProblem = await Problem.findById(exampleProblemId);
    if (!exampleProblem) {
      return res.status(404).json({
        success: false,
        message: 'Example problem not found'
      });
    }

    // Generate problems via Claude
    console.log(`Generating ${count} problems similar to "${exampleProblem.title}"...`);
    const generatedProblems = await generateSimilarProblems(exampleProblem, count);

    // Pre-generate hints/solutions if requested
    const problemsToSave = [];
    for (const prob of generatedProblems) {
      let hints = { steps: '', solution: '' };

      if (preGenerateHints) {
        console.log(`Pre-generating hints for: ${prob.title}...`);
        try {
          const { solution } = await generateDetailedSolution(
            prob.problemText,
            prob.correctAnswer,
            prob.difficulty
          );
          hints.solution = solution;
        } catch (error) {
          console.error(`Failed to generate hints for "${prob.title}":`, error.message);
          // Continue with empty hints if generation fails
        }
      }

      problemsToSave.push({
        ...prob,
        hints,
        source: 'admin-generated',
        createdBy: req.userId,
        exampleProblemId
      });
    }

    // Bulk insert
    const inserted = await Problem.insertMany(problemsToSave);
    console.log(`Successfully created ${inserted.length} problems`);

    res.status(201).json({
      success: true,
      count: inserted.length,
      problemIds: inserted.map(p => p._id),
      message: `Successfully generated ${inserted.length} problems`
    });
  } catch (error) {
    console.error('Bulk generate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk generate problems',
      error: error.message
    });
  }
};

module.exports = {
  bulkGenerate
};
