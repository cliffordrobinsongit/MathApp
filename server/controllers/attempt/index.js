/**
 * Attempt Controller Module Exports
 *
 * Central export point for all attempt controller functions.
 * This maintains backwards compatibility with the original attemptController.js interface.
 */

const { submitAnswer } = require('./submitController');
const { getHint } = require('./hintController');

module.exports = {
  submitAnswer,
  getHint
};
