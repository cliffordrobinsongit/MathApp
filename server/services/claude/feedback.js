/**
 * Feedback Generation
 *
 * Generates personalized feedback for students based on their answer correctness.
 */

const { anthropic } = require('./apiClient');
const { getPromptConfig } = require('./configCache');
const { interpolatePrompt } = require('./promptUtils');

/**
 * Generate feedback for the student
 * @param {string} problemText - The problem statement
 * @param {string} studentAnswer - The student's answer
 * @param {boolean} isCorrect - Whether the answer is correct
 * @param {number} attemptNumber - Which attempt this is (1, 2, 3, etc.)
 * @returns {Promise<{feedback: string}>}
 */
const generateFeedback = async (problemText, studentAnswer, isCorrect, attemptNumber = 1) => {
  try {
    // Choose prompt based on correctness
    const promptKey = isCorrect ? 'generatefeedback-correct' : 'generatefeedback-incorrect';
    const config = await getPromptConfig(promptKey);

    const prompt = interpolatePrompt(config.promptTemplate, {
      problemText,
      studentAnswer,
      attemptNumber: attemptNumber.toString()
    });

    const message = await anthropic.messages.create({
      model: config.model,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const feedback = message.content[0].text.trim();

    return { feedback };
  } catch (error) {
    console.error('Claude feedback generation error:', error);

    // Fallback feedback
    const fallbackFeedback = isCorrect
      ? "Great job! You solved it correctly. Keep up the excellent work!"
      : `Not quite right. Take another look at your steps and try again. You've got this!`;

    return { feedback: fallbackFeedback };
  }
};

module.exports = { generateFeedback };
