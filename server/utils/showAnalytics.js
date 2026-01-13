const mongoose = require('mongoose');
const {
  getApiUsageStats,
  generateSystemReport
} = require('./analytics');
require('dotenv').config();

/**
 * Display analytics and API usage statistics
 */
async function showAnalytics() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB\n');

    // Get API usage statistics
    console.log('=== API Usage Statistics ===\n');
    const apiStats = await getApiUsageStats();

    console.log(`Period: ${apiStats.period.start} - ${apiStats.period.end}`);
    console.log(`\nTotal Attempts: ${apiStats.totalAttempts}`);

    console.log('\nAPI Calls Made:');
    console.log(`  Validation: ${apiStats.apiCalls.validation}`);
    console.log(`  Feedback: ${apiStats.apiCalls.feedback}`);
    console.log(`  Hints: ${apiStats.apiCalls.hint}`);
    console.log(`  TOTAL: ${apiStats.apiCalls.total}`);

    console.log('\nPotential API Calls (without caching):');
    console.log(`  Validation: ${apiStats.potentialCalls.validation}`);
    console.log(`  Feedback: ${apiStats.potentialCalls.feedback}`);
    console.log(`  Hints: ${apiStats.potentialCalls.hint}`);
    console.log(`  TOTAL: ${apiStats.potentialCalls.total}`);

    console.log('\nSavings:');
    console.log(`  Calls Avoided: ${apiStats.savings.callsAvoided}`);
    console.log(`  Percent Saved: ${apiStats.savings.percentSaved}%`);

    // Get system report
    console.log('\n\n=== System Report ===\n');
    const report = await generateSystemReport();

    console.log('Overview:');
    console.log(`  Total Attempts: ${report.overview.totalAttempts}`);
    console.log(`  Total Problems: ${report.overview.totalProblems}`);
    console.log(`  Active Students (Last 7 Days): ${report.overview.activeStudentsLast7Days}`);

    console.log('\nPerformance (Last 7 Days):');
    console.log(`  Average Correct Rate: ${report.performance.averageCorrectRate}%`);
    console.log(`  Hints Requested: ${report.performance.hintsRequestedLast7Days}`);

    // Disconnect
    await mongoose.disconnect();
    console.log('\n✓ Analytics display complete');
  } catch (error) {
    console.error('Error displaying analytics:', error);
    process.exit(1);
  }
}

// Run analytics if called directly
if (require.main === module) {
  showAnalytics();
}

module.exports = showAnalytics;
