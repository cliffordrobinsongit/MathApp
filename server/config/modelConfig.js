/**
 * Claude API Model Configuration
 *
 * Constants related to Claude API models and their capabilities.
 */

/**
 * Valid Claude model names accepted by the Anthropic API
 * Used for validation in prompt configuration endpoints
 */
const VALID_MODELS = [
  'claude-3-haiku-20240307',      // Fast, cost-effective model for simple tasks
  'claude-3-5-sonnet-20241022',   // Balanced model for complex reasoning
  'claude-3-opus-latest'          // Most capable model for difficult tasks
];

/**
 * Model selection recommendations by task type
 */
const MODEL_RECOMMENDATIONS = {
  validation: 'claude-3-haiku-20240307',          // Fast validation tasks
  feedback: 'claude-3-haiku-20240307',            // Simple feedback generation
  hints: 'claude-3-haiku-20240307',               // Hint generation
  solutions: 'claude-3-haiku-20240307',           // Solution generation
  problemGeneration: 'claude-3-5-sonnet-20241022' // Complex problem creation
};

module.exports = {
  VALID_MODELS,
  MODEL_RECOMMENDATIONS
};
