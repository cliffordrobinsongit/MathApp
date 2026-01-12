/**
 * Default Prompt Configurations
 *
 * Single source of truth for all Claude API prompt templates and their parameters.
 * These serve as fallbacks when database configurations are unavailable.
 *
 * Used by:
 * - claudeService.js (runtime fallback)
 * - promptController.js (reset to defaults endpoint)
 * - initializePromptConfigs.js (database initialization)
 */

const DEFAULT_PROMPT_CONFIGS = {
  validateanswer: {
    promptTemplate: `You are a math teacher evaluating a student's answer.

Problem: \${problemText}
Correct Answer: \${correctAnswer}
Student's Answer: \${studentAnswer}

Determine if the student's answer is mathematically correct. Consider:
- Mathematical equivalence (e.g., "5" and "x = 5" are equivalent for solving for x)
- Different notations (e.g., "6x" vs "6*x" vs "x*6")
- Simplified vs unsimplified forms if they're equivalent
- Minor spacing or formatting differences

Respond with ONLY a JSON object in this exact format:
{
  "isCorrect": true or false,
  "reasoning": "Brief explanation of why the answer is correct or incorrect"
}`,
    model: 'claude-3-haiku-20240307',
    temperature: 0,
    maxTokens: 200
  },
  'generatefeedback-correct': {
    promptTemplate: `You are an encouraging math teacher. A student correctly solved this problem:

Problem: \${problemText}
Student's Answer: \${studentAnswer}

Generate a brief, encouraging response (1-2 sentences) that:
- Congratulates them
- Is warm and motivating
- Encourages them to continue

Be specific and genuine. Don't use emojis.`,
    model: 'claude-3-haiku-20240307',
    temperature: 0.7,
    maxTokens: 150
  },
  'generatefeedback-incorrect': {
    promptTemplate: `You are a helpful math teacher. A student attempted this problem (attempt #\${attemptNumber}):

Problem: \${problemText}
Student's Answer: \${studentAnswer}

Generate a brief, helpful response (1-2 sentences) that:
- Acknowledges their effort
- Points out what might be going wrong WITHOUT giving the answer
- Encourages them to try again
- Is supportive and patient

Be specific to their answer. Don't use emojis. Don't give the solution.`,
    model: 'claude-3-haiku-20240307',
    temperature: 0.7,
    maxTokens: 150
  },
  generatesteps: {
    promptTemplate: `You are a helpful math tutor. Generate 3-4 helpful hints to guide a student through solving this problem WITHOUT giving away the final answer.

Problem: \${problemText}
Difficulty: \${difficulty}

Provide hints as a numbered list that:
- Guide the student through the problem-solving process
- Start with the first step needed
- Build progressively toward the solution
- DO NOT include the final answer
- Are clear and concise

Format your response as a numbered list.`,
    model: 'claude-3-haiku-20240307',
    temperature: 0.7,
    maxTokens: 300
  },
  generatesolution: {
    promptTemplate: `You are a math teacher providing a complete worked solution. Show the student exactly how to solve this problem step-by-step.

Problem: \${problemText}
Correct Answer: \${correctAnswer}
Difficulty: \${difficulty}

Provide a clear, step-by-step solution that:
- Shows each step of the solving process
- Explains WHY each step is taken
- Clearly shows the final answer
- Is easy to follow and understand

Format with clear steps and explanations.`,
    model: 'claude-3-haiku-20240307',
    temperature: 0.7,
    maxTokens: 400
  },
  generatedynamichint: {
    promptTemplate: `You are a math tutor analyzing a student's mistake.

Problem: \${problemText}
Correct Answer: \${correctAnswer}
Student's Incorrect Answer: \${studentAnswer}
Attempt Number: \${attemptNumber}
Difficulty: \${difficulty}

The student made an error. Analyze their specific mistake and provide 3-4 targeted, descriptive hints that:
- Identify what they likely did wrong (without stating it directly)
- Guide them to reconsider the specific steps where they went wrong
- Are encouraging and constructive
- Help them discover the correct approach on their own
- Are MORE DETAILED and SPECIFIC than generic hints
- DO NOT give away the final answer

Example of good hints:
"1. Check your arithmetic when you combined the constants on the right side
2. Remember to perform the same operation on both sides of the equation
3. After isolating the variable term, what operation would undo multiplication?"

Format as a numbered list with detailed, specific guidance.`,
    model: 'claude-3-haiku-20240307',
    temperature: 0.7,
    maxTokens: 400
  },
  generatedetailedsolution: {
    promptTemplate: `You are a math teacher providing a VERY DETAILED worked solution with EXPLICIT equations at every step.

Problem: \${problemText}
Correct Answer: \${correctAnswer}
Difficulty: \${difficulty}

Provide a step-by-step solution that shows EVERY operation explicitly:

Example format for "Solve: 3x + 5 = 20":
Step 1: Start with the original equation
   3x + 5 = 20

Step 2: Subtract 5 from both sides to isolate the term with x
   3x + 5 - 5 = 20 - 5
   3x = 15

Step 3: Divide both sides by 3 to solve for x
   3x ÷ 3 = 15 ÷ 3
   x = 5

Final Answer: x = 5

Requirements:
- Show EACH equation transformation on its own line
- Show the arithmetic: "20 - 5 = 15" not just "3x = 15"
- Explain WHY each operation is performed
- Use clear step numbers
- Show all intermediate calculations
- Make it extremely detailed and easy to follow

Format with clear steps, equations, and explanations.`,
    model: 'claude-3-haiku-20240307',
    temperature: 0.5,
    maxTokens: 500
  },
  generatesimilarproblems: {
    promptTemplate: `You are a math problem generator. Generate \${count} unique math problems similar to this example:

Title: \${exampleProblem.title}
Category: \${exampleProblem.category}
Subcategory: \${exampleProblem.subcategory}
Difficulty: \${exampleProblem.difficulty}
Problem: \${exampleProblem.problemText}
Answer: \${exampleProblem.correctAnswer}
Answer Format: \${exampleProblem.answerFormat}

Requirements:
- Generate EXACTLY \${count} UNIQUE problems at the same difficulty level and concept
- Each must be solvable and have a clear, unambiguous correct answer
- Vary the numbers and context while keeping the mathematical concept the same
- For equations, vary the coefficients and constants
- Ensure each problem tests the same skill as the example
- Make sure answers are diverse (different values)

Return ONLY a valid JSON array with this exact structure (no markdown, no extra text):
[
  {
    "title": "Descriptive problem title",
    "problemText": "Full problem text (e.g., 'Solve for x: 3x + 7 = 19')",
    "correctAnswer": "The answer as a string",
    "alternateAnswers": ["alternate format 1", "alternate format 2"],
    "answerFormat": "\${exampleProblem.answerFormat}"
  }
]

IMPORTANT: Return ONLY the JSON array, nothing else.`,
    model: 'claude-sonnet-4-5-20250929',
    temperature: 0.7,
    maxTokens: 4000
  }
};

module.exports = { DEFAULT_PROMPT_CONFIGS };
