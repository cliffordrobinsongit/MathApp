/**
 * Prompt Configuration Cache
 *
 * Manages caching and retrieval of prompt configurations from database
 * with fallback to default configurations.
 */

const PromptConfig = require('../../models/PromptConfig');
const { DEFAULT_PROMPT_CONFIGS } = require('../../config');

// In-memory cache for prompt configurations (5-minute TTL)
const promptConfigCache = {
  data: new Map(),
  lastFetch: null,
  TTL: 5 * 60 * 1000 // 5 minutes
};

/**
 * Fetches prompt configuration from cache or database with fallback to defaults
 * @param {string} promptKey - The unique identifier for the prompt
 * @returns {Promise<{promptTemplate: string, model: string, temperature: number, maxTokens: number}>}
 */
async function getPromptConfig(promptKey) {
  const now = Date.now();

  // Check if cache is fresh
  if (promptConfigCache.lastFetch &&
      (now - promptConfigCache.lastFetch) < promptConfigCache.TTL &&
      promptConfigCache.data.has(promptKey)) {
    return promptConfigCache.data.get(promptKey);
  }

  // Fetch from database
  try {
    const config = await PromptConfig.findOne({
      promptKey: promptKey.toLowerCase(),
      isActive: true
    });

    if (config) {
      const configData = {
        promptTemplate: config.promptTemplate,
        model: config.model,
        temperature: config.temperature,
        maxTokens: config.maxTokens
      };

      // Update cache
      promptConfigCache.data.set(promptKey, configData);
      promptConfigCache.lastFetch = now;

      return configData;
    }

    // Config not found, use default
    console.warn(`Prompt config not found for ${promptKey}, using default`);
    return DEFAULT_PROMPT_CONFIGS[promptKey.toLowerCase()] || DEFAULT_PROMPT_CONFIGS[promptKey];
  } catch (error) {
    console.error(`Failed to fetch prompt config for ${promptKey}:`, error);

    // Fallback to default on error
    return DEFAULT_PROMPT_CONFIGS[promptKey.toLowerCase()] || DEFAULT_PROMPT_CONFIGS[promptKey];
  }
}

module.exports = { getPromptConfig };
