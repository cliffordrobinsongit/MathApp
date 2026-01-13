/**
 * Claude Service
 *
 * This file maintains backward compatibility by re-exporting
 * functions from the modularized claude service directory.
 *
 * The service has been split into focused modules:
 * - apiClient.js: Anthropic client setup
 * - configCache.js: Prompt config fetching with TTL
 * - promptUtils.js: interpolatePrompt() helper
 * - validation.js: validateAnswer()
 * - feedback.js: generateFeedback()
 * - hints.js: generateSteps(), generateDynamicHint(), generateDetailedSolution()
 * - problemGeneration.js: generateSimilarProblems()
 *
 * For direct access to sub-modules, import from ./claude/ directory.
 */

module.exports = require('./claude');
