/**
 * Problem Controller
 *
 * This file maintains backward compatibility by re-exporting
 * functions from the modularized problem controller directory.
 *
 * The controller has been split into focused modules:
 * - studentController.js: getRandom, getById
 * - adminController.js: createProblem, updateProblem, deleteProblem, bulkDeleteProblems, listProblems
 * - analyticsController.js: getProblemAnalytics, seed
 *
 * For direct access to sub-modules, import from ./problem/ directory.
 */

module.exports = require('./problem');
