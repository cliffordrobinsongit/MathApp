const mongoose = require('mongoose');
const path = require('path');
const PromptConfig = require('../models/PromptConfig');
const { DEFAULT_PROMPT_CONFIGS } = require('../config');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function initializePromptConfigs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Define metadata for each prompt (core configs imported from shared config)
    const promptMetadata = {
      validateanswer: {
        displayName: 'Answer Validation',
        description: 'Validates if a student\'s answer is mathematically equivalent to the correct answer. Uses mathematical equivalence checking for different notations and formats.',
        availableVariables: ['problemText', 'correctAnswer', 'studentAnswer']
      },
      'generatefeedback-correct': {
        displayName: 'Positive Feedback',
        description: 'Generates encouraging feedback when a student answers correctly. Should be warm, motivating, and specific.',
        availableVariables: ['problemText', 'studentAnswer']
      },
      'generatefeedback-incorrect': {
        displayName: 'Corrective Feedback',
        description: 'Generates helpful feedback when a student answers incorrectly. Should acknowledge effort, provide guidance without giving the answer, and encourage retry.',
        availableVariables: ['problemText', 'studentAnswer', 'attemptNumber']
      },
      generatesteps: {
        displayName: 'Generic Hints',
        description: 'Generates 3-4 step-by-step hints to guide students through solving a problem without revealing the final answer.',
        availableVariables: ['problemText', 'difficulty']
      },
      generatesolution: {
        displayName: 'Complete Solution',
        description: 'Generates a complete worked solution showing each step of the solving process with explanations.',
        availableVariables: ['problemText', 'correctAnswer', 'difficulty']
      },
      generatedynamichint: {
        displayName: 'Targeted Hints',
        description: 'Analyzes a student\'s specific incorrect answer and provides targeted, detailed hints based on their mistake. More specific than generic hints.',
        availableVariables: ['problemText', 'correctAnswer', 'studentAnswer', 'attemptNumber', 'difficulty']
      },
      generatedetailedsolution: {
        displayName: 'Detailed Solution (Pre-generation)',
        description: 'Generates extremely detailed solution with explicit equation transformations at every step. Used for pre-generating solutions during problem creation.',
        availableVariables: ['problemText', 'correctAnswer', 'difficulty']
      },
      generatesimilarproblems: {
        displayName: 'Bulk Problem Generation',
        description: 'Generates multiple unique math problems similar to an example problem. Used by admins for bulk problem creation.',
        availableVariables: ['count', 'exampleProblem.title', 'exampleProblem.category', 'exampleProblem.subcategory', 'exampleProblem.difficulty', 'exampleProblem.problemText', 'exampleProblem.correctAnswer', 'exampleProblem.answerFormat']
      }
    };

    // Build complete configs by merging defaults with metadata
    const promptConfigs = Object.keys(DEFAULT_PROMPT_CONFIGS).map(promptKey => {
      const defaults = DEFAULT_PROMPT_CONFIGS[promptKey];
      const metadata = promptMetadata[promptKey];

      return {
        promptKey,
        displayName: metadata.displayName,
        description: metadata.description,
        promptTemplate: defaults.promptTemplate,
        model: defaults.model,
        temperature: defaults.temperature,
        maxTokens: defaults.maxTokens,
        availableVariables: metadata.availableVariables
      };
    });

    // Insert or update each config
    for (const config of promptConfigs) {
      const result = await PromptConfig.findOneAndUpdate(
        { promptKey: config.promptKey },
        {
          displayName: config.displayName,
          description: config.description,
          promptTemplate: config.promptTemplate,
          model: config.model,
          temperature: config.temperature,
          maxTokens: config.maxTokens,
          availableVariables: config.availableVariables,
          isActive: true,
          updatedAt: Date.now()
        },
        { upsert: true, new: true }
      );
      console.log(`✓ Initialized ${config.displayName} (${config.promptKey})`);
    }

    console.log(`\n✓ Prompt configuration initialized successfully`);
    console.log(`✓ Total prompts: ${promptConfigs.length}`);

  } catch (error) {
    console.error('Error initializing prompt configuration:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

initializePromptConfigs();
