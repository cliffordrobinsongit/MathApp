const Problem = require('../models/Problem');
const sampleProblems = require('./problemData');
const { generateSteps, generateSolution } = require('../services/claudeService');

/**
 * Seed database with problems and generate hints using Claude
 * This is called automatically on server start if database is empty
 */
const seedProblemsWithHints = async () => {
  try {
    console.log('📚 Seeding problems with AI-generated hints...');

    const problemsWithHints = [];

    for (let i = 0; i < sampleProblems.length; i++) {
      const problem = sampleProblems[i];

      console.log(`  Generating hints for problem ${i + 1}/${sampleProblems.length}: ${problem.title}`);

      // Generate steps and solution using Claude
      const [stepsResult, solutionResult] = await Promise.all([
        generateSteps(problem.problemText, problem.difficulty),
        generateSolution(problem.problemText, problem.correctAnswer, problem.difficulty)
      ]);

      // Add hints to problem
      const problemWithHints = {
        ...problem,
        hints: {
          steps: stepsResult.steps,
          solution: solutionResult.solution
        },
        explanation: solutionResult.solution // Store full explanation
      };

      problemsWithHints.push(problemWithHints);
    }

    // Insert all problems with hints
    await Problem.insertMany(problemsWithHints);
    console.log(`✓ Successfully seeded ${problemsWithHints.length} problems with hints`);

    return problemsWithHints.length;
  } catch (error) {
    console.error('Error seeding problems with hints:', error);

    // Fallback: seed without hints
    console.log('⚠️  Falling back to seeding without hints...');
    await Problem.insertMany(sampleProblems);
    console.log(`✓ Seeded ${sampleProblems.length} problems (without hints)`);

    return sampleProblems.length;
  }
};

module.exports = seedProblemsWithHints;
