/**
 * Problem Generation
 *
 * Generates similar math problems based on example problems.
 */

const { anthropic } = require('./apiClient');
const { getPromptConfig } = require('./configCache');
const { interpolatePrompt } = require('./promptUtils');

/**
 * Generate similar problems based on an example
 * @param {Object} exampleProblem - The example problem to base generation on
 * @param {number} count - Number of similar problems to generate
 * @returns {Promise<Array>} Array of generated problems
 */
const generateSimilarProblems = async (exampleProblem, count) => {
  try {
    const config = await getPromptConfig('generatesimilarproblems');
    const prompt = interpolatePrompt(config.promptTemplate, {
      count: count.toString(),
      'exampleProblem.title': exampleProblem.title,
      'exampleProblem.category': exampleProblem.category,
      'exampleProblem.subcategory': exampleProblem.subcategory,
      'exampleProblem.difficulty': exampleProblem.difficulty,
      'exampleProblem.problemText': exampleProblem.problemText,
      'exampleProblem.correctAnswer': exampleProblem.correctAnswer,
      'exampleProblem.answerFormat': exampleProblem.answerFormat
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

    const responseText = message.content[0].text.trim();

    // Remove markdown code blocks if present
    let jsonText = responseText;
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }

    const problems = JSON.parse(jsonText);

    // Validate and ensure each problem has the required fields
    const validatedProblems = problems.map((prob, index) => {
      // Ensure alternateAnswers is an array
      if (!Array.isArray(prob.alternateAnswers)) {
        prob.alternateAnswers = [];
      }

      // Add alternate formats if not provided (e.g., "5" and "x = 5")
      if (exampleProblem.answerFormat === 'number' && prob.alternateAnswers.length === 0) {
        prob.alternateAnswers = [
          `x = ${prob.correctAnswer}`,
          `x=${prob.correctAnswer}`
        ];
      }

      return {
        title: prob.title || `${exampleProblem.subcategory} Problem ${index + 1}`,
        problemText: prob.problemText,
        correctAnswer: prob.correctAnswer,
        alternateAnswers: prob.alternateAnswers,
        answerFormat: prob.answerFormat || exampleProblem.answerFormat,
        category: exampleProblem.category,
        subcategory: exampleProblem.subcategory,
        difficulty: exampleProblem.difficulty
      };
    });

    return validatedProblems;
  } catch (error) {
    console.error('Claude problem generation error:', error);
    throw new Error(`Failed to generate similar problems: ${error.message}`);
  }
};

module.exports = {
  generateSimilarProblems
};
