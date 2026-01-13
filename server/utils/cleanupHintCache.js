const mongoose = require('mongoose');
const HintCache = require('../models/HintCache');
require('dotenv').config();

/**
 * Cleanup old, unused hint cache entries to keep database lean
 *
 * Removal criteria:
 * - Hints that haven't been used in 90+ days AND have only been used once
 * - This keeps frequently used hints (common mistakes) while removing one-off errors
 */
async function cleanupHintCache() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Calculate date 90 days ago
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // Find and remove old, single-use hints
    const result = await HintCache.deleteMany({
      lastUsed: { $lt: ninetyDaysAgo },
      hitCount: 1
    });

    console.log(`✓ Cleaned up ${result.deletedCount} old hint cache entries`);

    // Show statistics
    const totalHints = await HintCache.countDocuments();
    const recentHints = await HintCache.countDocuments({
      lastUsed: { $gte: ninetyDaysAgo }
    });
    const popularHints = await HintCache.countDocuments({
      hitCount: { $gte: 3 }
    });

    console.log('\nHint Cache Statistics:');
    console.log(`  Total cached hints: ${totalHints}`);
    console.log(`  Recently used (< 90 days): ${recentHints}`);
    console.log(`  Popular hints (3+ uses): ${popularHints}`);

    // Disconnect
    await mongoose.disconnect();
    console.log('\n✓ Database cleanup complete');
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

// Run cleanup if called directly
if (require.main === module) {
  cleanupHintCache();
}

module.exports = cleanupHintCache;
