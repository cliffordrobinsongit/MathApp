/**
 * Hint and Solution Generation
 *
 * Functions for generating hints, steps, and solutions for math problems.
 */

const { anthropic } = require('./apiClient');
const { getPromptConfig } = require('./configCache');
const { interpolatePrompt } = require('./promptUtils');

/**
 * Generate step-by-step hints for solving a problem
 * @param {string} problemText - The problem statement
 * @param {string} difficulty - The difficulty level
 * @returns {Promise<{steps: string}>}
 */
const generateSteps = async (problemText, difficulty) => {
  try {
    const config = await getPromptConfig('generatesteps');
    const prompt = interpolatePrompt(config.promptTemplate, {
      problemText,
      difficulty
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

    const steps = message.content[0].text.trim();

    return { steps };
  } catch (error) {
    console.error('Claude steps generation error:', error);
    return {
      steps: '1. Identify what you need to solve for\n2. Look at what operations are being performed\n3. Think about the inverse operations\n4. Work through the problem step by step'
    };
  }
};

/**
 * Generate a complete worked solution
 * @param {string} problemText - The problem statement
 * @param {string} correctAnswer - The correct answer
 * @param {string} difficulty - The difficulty level
 * @returns {Promise<{solution: string}>}
 */
const generateSolution = async (problemText, correctAnswer, difficulty) => {
  try {
    const config = await getPromptConfig('generatesolution');
    const prompt = interpolatePrompt(config.promptTemplate, {
      problemText,
      correctAnswer,
      difficulty
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

    const solution = message.content[0].text.trim();

    return { solution };
  } catch (error) {
    console.error('Claude solution generation error:', error);
    return {
      solution: `Solution:\nThe answer is ${correctAnswer}. Work through the problem by isolating the variable and performing the necessary operations.`
    };
  }
};

/**
 * Generate dynamic, targeted hints based on student's incorrect answer
 * @param {string} problemText - The problem statement
 * @param {string} correctAnswer - The correct answer
 * @param {string} studentAnswer - The student's incorrect answer
 * @param {number} attemptNumber - Which attempt this is
 * @param {string} difficulty - The difficulty level
 * @returns {Promise<{hint: string}>}
 */
const generateDynamicHint = async (problemText, correctAnswer, studentAnswer, attemptNumber, difficulty) => {
  try {
    const config = await getPromptConfig('generatedynamichint');
    const prompt = interpolatePrompt(config.promptTemplate, {
      problemText,
      correctAnswer,
      studentAnswer,
      attemptNumber: attemptNumber.toString(),
      difficulty
    });

    console.log('Calling Claude API for dynamic hint generation...');
    const message = await anthropic.messages.create({
      model: config.model,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const hint = message.content[0].text.trim();
    console.log('Successfully generated dynamic hint');

    return { hint };
  } catch (error) {
    console.error('Claude dynamic hint generation error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    return {
      hint: '1. Review the problem carefully and identify what you need to find\n2. Check each step of your calculation for arithmetic errors\n3. Make sure you performed the correct operations in the right order\n4. Try working through the problem again step by step'
    };
  }
};

/**
 * Generate detailed solution with explicit equation steps
 * @param {string} problemText - The problem statement
 * @param {string} correctAnswer - The correct answer
 * @param {string} difficulty - The difficulty level
 * @returns {Promise<{solution: string}>}
 */
const generateDetailedSolution = async (problemText, correctAnswer, difficulty) => {
  try {
    const config = await getPromptConfig('generatedetailedsolution');
    const prompt = interpolatePrompt(config.promptTemplate, {
      problemText,
      correctAnswer,
      difficulty
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

    const solution = message.content[0].text.trim();

    return { solution };
  } catch (error) {
    console.error('Claude detailed solution generation error:', error);
    return {
      solution: `Solution:\n\nStep 1: Start with the problem\n${problemText}\n\nStep 2: Solve step by step\n(Work through the operations to isolate the variable)\n\nFinal Answer: ${correctAnswer}`
    };
  }
};

module.exports = {
  generateSteps,
  generateSolution,
  generateDynamicHint,
  generateDetailedSolution
};
