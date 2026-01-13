const Attempt = require('../models/Attempt');
const Problem = require('../models/Problem');

/**
 * Get comprehensive statistics for a specific student
 * @param {ObjectId} userId - The student's user ID
 * @returns {Object} Student statistics
 */
async function getStudentStats(userId) {
  const attempts = await Attempt.find({ userId }).populate('problemId');

  if (attempts.length === 0) {
    return {
      totalAttempts: 0,
      problemsAttempted: 0,
      problemsSolved: 0,
      correctRate: 0,
      hintsRequested: 0,
      averageAttemptsPerProblem: 0
    };
  }

  const problemIds = new Set(attempts.map(a => a.problemId._id.toString()));
  const solvedProblems = new Set(
    attempts.filter(a => a.isCorrect).map(a => a.problemId._id.toString())
  );
  const correctAttempts = attempts.filter(a => a.isCorrect).length;
  const hintsRequested = attempts.filter(a => a.hintLevel !== 'none').length;

  return {
    totalAttempts: attempts.length,
    problemsAttempted: problemIds.size,
    problemsSolved: solvedProblems.size,
    correctRate: ((correctAttempts / attempts.length) * 100).toFixed(1),
    hintsRequested: hintsRequested,
    averageAttemptsPerProblem: (attempts.length / problemIds.size).toFixed(1)
  };
}

/**
 * Get statistics for a specific problem across all students
 * @param {ObjectId} problemId - The problem ID
 * @returns {Object} Problem statistics
 */
async function getProblemStats(problemId) {
  return await Attempt.getProblemMetrics(problemId);
}

/**
 * Get API usage statistics for cost tracking
 * @param {Date} startDate - Start date for the analysis
 * @param {Date} endDate - End date for the analysis
 * @returns {Object} API usage statistics
 */
async function getApiUsageStats(startDate = null, endDate = null) {
  const query = {};

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = startDate;
    if (endDate) query.createdAt.$lte = endDate;
  }

  const attempts = await Attempt.find(query);

  let validationCalls = 0;
  let feedbackCalls = 0;
  let hintCalls = 0;

  attempts.forEach(attempt => {
    if (attempt.apiCallsMade.validation) validationCalls++;
    if (attempt.apiCallsMade.feedback) feedbackCalls++;
    if (attempt.apiCallsMade.hint) hintCalls++;
  });

  const totalApiCalls = validationCalls + feedbackCalls + hintCalls;
  const totalAttempts = attempts.length;

  // Calculate potential calls without caching
  const potentialValidationCalls = attempts.length;
  const potentialFeedbackCalls = attempts.length;
  const potentialHintCalls = attempts.filter(a => a.hintLevel !== 'none').length;
  const potentialTotalCalls = potentialValidationCalls + potentialFeedbackCalls + potentialHintCalls;

  const savingsPercent = potentialTotalCalls > 0
    ? (((potentialTotalCalls - totalApiCalls) / potentialTotalCalls) * 100).toFixed(1)
    : 0;

  return {
    period: {
      start: startDate || 'All time',
      end: endDate || 'Present'
    },
    apiCalls: {
      validation: validationCalls,
      feedback: feedbackCalls,
      hint: hintCalls,
      total: totalApiCalls
    },
    potentialCalls: {
      validation: potentialValidationCalls,
      feedback: potentialFeedbackCalls,
      hint: potentialHintCalls,
      total: potentialTotalCalls
    },
    savings: {
      callsAvoided: potentialTotalCalls - totalApiCalls,
      percentSaved: savingsPercent
    },
    totalAttempts: totalAttempts
  };
}

/**
 * Get most common wrong answers for a problem
 * @param {ObjectId} problemId - The problem ID
 * @param {Number} limit - Maximum number of results to return
 * @returns {Array} Most common wrong answers
 */
async function getCommonWrongAnswers(problemId, limit = 10) {
  const wrongAttempts = await Attempt.find({
    problemId: problemId,
    isCorrect: false
  });

  // Count occurrences of each wrong answer
  const answerCounts = {};
  wrongAttempts.forEach(attempt => {
    const answer = attempt.studentAnswer;
    answerCounts[answer] = (answerCounts[answer] || 0) + 1;
  });

  // Convert to array and sort by count
  const sortedAnswers = Object.entries(answerCounts)
    .map(([answer, count]) => ({ answer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return sortedAnswers;
}

/**
 * Get student progress over time
 * @param {ObjectId} userId - The student's user ID
 * @param {Number} days - Number of days to analyze (default 30)
 * @returns {Object} Progress metrics
 */
async function getStudentProgress(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const attempts = await Attempt.find({
    userId: userId,
    createdAt: { $gte: startDate }
  }).sort({ createdAt: 1 });

  if (attempts.length === 0) {
    return {
      period: `Last ${days} days`,
      noActivity: true
    };
  }

  const problemsSolved = new Set(
    attempts.filter(a => a.isCorrect).map(a => a.problemId.toString())
  ).size;

  const hintsUsed = attempts.filter(a => a.hintLevel !== 'none').length;
  const correctRate = ((attempts.filter(a => a.isCorrect).length / attempts.length) * 100).toFixed(1);

  return {
    period: `Last ${days} days`,
    totalAttempts: attempts.length,
    problemsSolved: problemsSolved,
    hintsUsed: hintsUsed,
    correctRate: correctRate,
    trend: attempts.length > 0 ? 'active' : 'inactive'
  };
}

/**
 * Generate a summary report for administrators
 * @returns {Object} Comprehensive system report
 */
async function generateSystemReport() {
  const totalAttempts = await Attempt.countDocuments();
  const totalProblems = await Problem.countDocuments();
  const apiStats = await getApiUsageStats();

  const recentAttempts = await Attempt.find({
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
  });

  const uniqueStudentsLast7Days = new Set(
    recentAttempts.map(a => a.userId.toString())
  ).size;

  return {
    overview: {
      totalAttempts: totalAttempts,
      totalProblems: totalProblems,
      activeStudentsLast7Days: uniqueStudentsLast7Days
    },
    apiUsage: apiStats,
    performance: {
      averageCorrectRate: recentAttempts.length > 0
        ? ((recentAttempts.filter(a => a.isCorrect).length / recentAttempts.length) * 100).toFixed(1)
        : 0,
      hintsRequestedLast7Days: recentAttempts.filter(a => a.hintLevel !== 'none').length
    }
  };
}

module.exports = {
  getStudentStats,
  getProblemStats,
  getApiUsageStats,
  getCommonWrongAnswers,
  getStudentProgress,
  generateSystemReport
};
