/**
 * Problem Controller Module Exports
 *
 * Central export point for all problem controller functions.
 * This maintains backwards compatibility with the original problemController.js interface.
 */

const { getRandom, getById } = require('./studentController');
const { createProblem, updateProblem, deleteProblem, bulkDeleteProblems, listProblems } = require('./adminController');
const { getProblemAnalytics, seed } = require('./analyticsController');

module.exports = {
  // Student operations
  getRandom,
  getById,

  // Admin CRUD operations
  createProblem,
  updateProblem,
  deleteProblem,
  bulkDeleteProblems,
  listProblems,

  // Analytics and seeding
  getProblemAnalytics,
  seed
};
