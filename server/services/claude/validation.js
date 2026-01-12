/**
 * Answer Validation
 *
 * Validates student answers using Claude API for mathematical equivalence checking.
 */

const { anthropic } = require('./apiClient');
const { getPromptConfig } = require('./configCache');
const { interpolatePrompt } = require('./promptUtils');

/**
 * Validate if a student's answer is correct
 * @param {string} problemText - The problem statement
 * @param {string} studentAnswer - The student's answer
 * @param {string} correctAnswer - The correct answer
 * @param {Array<string>} alternateAnswers - Array of alternate valid answers
 * @returns {Promise<{isCorrect: boolean, reasoning: string}>}
 */
const validateAnswer = async (problemText, studentAnswer, correctAnswer, alternateAnswers = []) => {
  try {
    // First do a simple string comparison (case-insensitive, trimmed)
    const normalizedStudentAnswer = studentAnswer.toString().trim().toLowerCase();
    const normalizedCorrectAnswer = correctAnswer.toString().trim().toLowerCase();

    // Check exact match with correct answer
    if (normalizedStudentAnswer === normalizedCorrectAnswer) {
      return {
        isCorrect: true,
        reasoning: 'Exact match with correct answer'
      };
    }

    // Check alternate answers
    const normalizedAlternates = alternateAnswers.map(ans => ans.toString().trim().toLowerCase());
    if (normalizedAlternates.includes(normalizedStudentAnswer)) {
      return {
        isCorrect: true,
        reasoning: 'Match with alternate answer format'
      };
    }

    // If no exact match, use Claude to evaluate mathematical equivalence
    const config = await getPromptConfig('validateanswer');
    const prompt = interpolatePrompt(config.promptTemplate, {
      problemText,
      correctAnswer,
      studentAnswer
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

    const responseText = message.content[0].text;
    const result = JSON.parse(responseText);

    return {
      isCorrect: result.isCorrect,
      reasoning: result.reasoning
    };
  } catch (error) {
    console.error('Claude validation error:', error);

    // Fallback: if Claude fails, do strict string comparison
    const normalizedStudentAnswer = studentAnswer.toString().trim().toLowerCase();
    const normalizedCorrectAnswer = correctAnswer.toString().trim().toLowerCase();

    return {
      isCorrect: normalizedStudentAnswer === normalizedCorrectAnswer,
      reasoning: 'Fallback comparison due to service error'
    };
  }
};

module.exports = { validateAnswer };
