/**
 * Claude API Client Setup
 *
 * Initializes and exports the Anthropic API client with error handling.
 */

const Anthropic = require('@anthropic-ai/sdk');

// Verify API key is loaded
if (!process.env.CLAUDE_API_KEY) {
  console.error('WARNING: CLAUDE_API_KEY environment variable is not set!');
} else {
  console.log('✓ Claude API key loaded');
}

/**
 * Anthropic API client instance
 */
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

module.exports = { anthropic };
