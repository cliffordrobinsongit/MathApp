/**
 * Prompt Utilities
 *
 * Helper functions for prompt template manipulation.
 */

/**
 * Safely interpolates variables into a prompt template
 * @param {string} template - The template string with ${variableName} placeholders
 * @param {Object} variables - Object with variable names and values
 * @returns {string} The interpolated prompt
 */
function interpolatePrompt(template, variables) {
  let result = template;

  // Replace each ${variableName} with actual value
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
    result = result.replace(regex, String(value || ''));
  }

  // Check for unreplaced variables (for debugging)
  const unreplaced = result.match(/\$\{[^}]+\}/g);
  if (unreplaced && unreplaced.length > 0) {
    console.warn(`Unreplaced variables in prompt: ${unreplaced.join(', ')}`);
  }

  return result;
}

module.exports = { interpolatePrompt };
