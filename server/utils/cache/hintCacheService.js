/**
 * Hint Cache Database Service
 *
 * Handles HintCache model operations for storing and retrieving
 * dynamically generated hints based on student wrong answers.
 */

const HintCache = require('../../models/HintCache');

/**
 * Find a cached hint for a specific problem and student answer
 * @param {string} problemId - Problem ID
 * @param {string} studentAnswer - Student's answer
 * @returns {Promise<Object|null>} Cached hint object or null
 */
async function findCachedHint(problemId, studentAnswer) {
  try {
    const cachedHint = await HintCache.findOne({
      problemId: problemId,
      studentAnswer: studentAnswer.trim()
    });

    if (cachedHint) {
      // Update usage statistics
      cachedHint.hitCount += 1;
      cachedHint.lastUsed = new Date();
      await cachedHint.save();

      console.log('✓ Returning cached hint from database for wrong answer:', studentAnswer);
      return cachedHint;
    }

    return null;
  } catch (error) {
    console.error('Error finding cached hint:', error);
    return null;
  }
}

/**
 * Save a new hint to the cache
 * @param {string} problemId - Problem ID
 * @param {string} studentAnswer - Student's answer
 * @param {string} hint - Generated hint text
 * @returns {Promise<boolean>} True if saved successfully
 */
async function saveHintToCache(problemId, studentAnswer, hint) {
  try {
    await HintCache.create({
      problemId: problemId,
      studentAnswer: studentAnswer.trim(),
      hint: hint
    });

    console.log('✓ Cached hint to database');
    return true;
  } catch (err) {
    // Ignore duplicate key errors (race condition)
    if (err.code === 11000) {
      console.log('Hint already cached (race condition)');
      return true;
    }

    console.error('Error caching hint to database:', err);
    return false;
  }
}

/**
 * Delete old cached hints (cleanup utility)
 * @param {number} daysOld - Delete hints older than this many days
 * @returns {Promise<number>} Number of deleted hints
 */
async function deleteOldHints(daysOld = 30) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await HintCache.deleteMany({
      lastUsed: { $lt: cutoffDate }
    });

    console.log(`✓ Deleted ${result.deletedCount} old hints`);
    return result.deletedCount;
  } catch (error) {
    console.error('Error deleting old hints:', error);
    return 0;
  }
}

module.exports = {
  findCachedHint,
  saveHintToCache,
  deleteOldHints
};
