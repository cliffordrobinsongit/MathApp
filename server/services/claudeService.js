const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

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
    const prompt = `You are a math teacher evaluating a student's answer.

Problem: ${problemText}
Correct Answer: ${correctAnswer}
Student's Answer: ${studentAnswer}

Determine if the student's answer is mathematically correct. Consider:
- Mathematical equivalence (e.g., "5" and "x = 5" are equivalent for solving for x)
- Different notations (e.g., "6x" vs "6*x" vs "x*6")
- Simplified vs unsimplified forms if they're equivalent
- Minor spacing or formatting differences

Respond with ONLY a JSON object in this exact format:
{
  "isCorrect": true or false,
  "reasoning": "Brief explanation of why the answer is correct or incorrect"
}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 200,
      temperature: 0,
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
    const prompt = isCorrect
      ? `You are an encouraging math teacher. A student correctly solved this problem:

Problem: ${problemText}
Student's Answer: ${studentAnswer}

Generate a brief, encouraging response (1-2 sentences) that:
- Congratulates them
- Is warm and motivating
- Encourages them to continue

Be specific and genuine. Don't use emojis.`
      : `You are a helpful math teacher. A student attempted this problem (attempt #${attemptNumber}):

Problem: ${problemText}
Student's Answer: ${studentAnswer}

Generate a brief, helpful response (1-2 sentences) that:
- Acknowledges their effort
- Points out what might be going wrong WITHOUT giving the answer
- Encourages them to try again
- Is supportive and patient

Be specific to their answer. Don't use emojis. Don't give the solution.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 150,
      temperature: 0.7,
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

/**
 * Generate step-by-step hints for solving a problem
 * @param {string} problemText - The problem statement
 * @param {string} difficulty - The difficulty level
 * @returns {Promise<{steps: string}>}
 */
const generateSteps = async (problemText, difficulty) => {
  try {
    const prompt = `You are a helpful math tutor. Generate 3-4 helpful hints to guide a student through solving this problem WITHOUT giving away the final answer.

Problem: ${problemText}
Difficulty: ${difficulty}

Provide hints as a numbered list that:
- Guide the student through the problem-solving process
- Start with the first step needed
- Build progressively toward the solution
- DO NOT include the final answer
- Are clear and concise

Format your response as a numbered list.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 300,
      temperature: 0.7,
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
    const prompt = `You are a math teacher providing a complete worked solution. Show the student exactly how to solve this problem step-by-step.

Problem: ${problemText}
Correct Answer: ${correctAnswer}
Difficulty: ${difficulty}

Provide a clear, step-by-step solution that:
- Shows each step of the solving process
- Explains WHY each step is taken
- Clearly shows the final answer
- Is easy to follow and understand

Format with clear steps and explanations.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 400,
      temperature: 0.7,
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

module.exports = {
  validateAnswer,
  generateFeedback,
  generateSteps,
  generateSolution
};
