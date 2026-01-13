/**
 * Attempt Controller
 *
 * This file maintains backward compatibility by re-exporting
 * functions from the modularized attempt controller directory.
 *
 * The controller has been split into focused modules:
 * - submitController.js: submitAnswer() with validation flow
 * - hintController.js: getHint() with caching logic
 *
 * For direct access to sub-modules, import from ./attempt/ directory.
 */

module.exports = require('./attempt');
