/**
 * Claude Service Module Exports
 *
 * Central export point for all Claude API service functions.
 * Import from this file to access any Claude service functionality.
 *
 * Usage:
 *   const { validateAnswer, generateSteps } = require('./services/claude');
 */

const { validateAnswer } = require('./validation');
const { generateFeedback } = require('./feedback');
const { generateSteps, generateSolution, generateDynamicHint, generateDetailedSolution } = require('./hints');
const { generateSimilarProblems } = require('./problemGeneration');

module.exports = {
  validateAnswer,
  generateFeedback,
  generateSteps,
  generateSolution,
  generateDynamicHint,
  generateDetailedSolution,
  generateSimilarProblems
};
