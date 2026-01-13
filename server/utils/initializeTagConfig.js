const mongoose = require('mongoose');
const path = require('path');
const TagConfig = require('../models/TagConfig');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function initializeTagConfig() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Define initial tag configurations
    const tagConfigs = [
      {
        configType: 'categories',
        values: ['pre-algebra', 'algebra']
      },
      {
        configType: 'subcategories',
        values: [
          'one-step-equations',
          'two-step-equations',
          'linear-equations',
          'polynomials',
          'quadratic-equations',
          'systems',
          'rational-equations',
          'exponential-equations'
        ]
      },
      {
        configType: 'difficulties',
        values: ['pre-algebra', 'algebra-1', 'algebra-2']
      }
    ];

    // Insert or update each config
    for (const config of tagConfigs) {
      const result = await TagConfig.findOneAndUpdate(
        { configType: config.configType },
        {
          values: config.values,
          updatedAt: Date.now()
        },
        { upsert: true, new: true }
      );
      console.log(`✓ Initialized ${config.configType} with ${result.values.length} values`);
    }

    console.log('\n✓ Tag configuration initialized successfully');

  } catch (error) {
    console.error('Error initializing tag configuration:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

initializeTagConfig();
