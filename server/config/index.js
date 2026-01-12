/**
 * Configuration Module Exports
 *
 * Central export point for all server configuration constants.
 * Import from this file to access shared configurations.
 *
 * Usage:
 *   const { DEFAULT_PROMPT_CONFIGS, VALID_MODELS } = require('../config');
 */

const { DEFAULT_PROMPT_CONFIGS } = require('./promptDefaults');
const { VALID_MODELS, MODEL_RECOMMENDATIONS } = require('./modelConfig');

module.exports = {
  DEFAULT_PROMPT_CONFIGS,
  VALID_MODELS,
  MODEL_RECOMMENDATIONS
};
