const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: [true, 'Problem ID is required'],
    index: true
  },
  studentAnswer: {
    type: String,
    required: [true, 'Student answer is required'],
    trim: true
  },
  isCorrect: {
    type: Boolean,
    required: true,
    index: true
  },
  attemptNumber: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  feedback: {
    type: String,
    default: ''
  },
  hintLevel: {
    type: String,
    enum: ['none', 'steps', 'solution'],
    default: 'none'
  },
  apiCallsMade: {
    validation: {
      type: Boolean,
      default: false
    },
    feedback: {
      type: Boolean,
      default: false
    },
    hint: {
      type: Boolean,
      default: false
    }
  },
  timeSpent: {
    type: Number, // seconds
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound indexes for common queries
attemptSchema.index({ userId: 1, problemId: 1, createdAt: -1 });
attemptSchema.index({ problemId: 1, isCorrect: 1 });
attemptSchema.index({ userId: 1, createdAt: -1 });

// Index for cache optimization queries (checking recent attempts)
attemptSchema.index({ userId: 1, problemId: 1, studentAnswer: 1, createdAt: -1 });

// Virtual for checking if attempt is recent (within 24 hours)
attemptSchema.virtual('isRecent').get(function() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.createdAt >= twentyFourHoursAgo;
});

// Static method to find recent attempt with same answer
attemptSchema.statics.findRecentDuplicate = async function(userId, problemId, studentAnswer) {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  return await this.findOne({
    userId: userId,
    problemId: problemId,
    studentAnswer: studentAnswer.trim(),
    createdAt: { $gte: twentyFourHoursAgo }
  }).sort({ createdAt: -1 });
};

// Static method to get student statistics for a problem
attemptSchema.statics.getStudentProblemStats = async function(userId, problemId) {
  const attempts = await this.find({ userId, problemId }).sort({ createdAt: 1 });

  return {
    totalAttempts: attempts.length,
    correctAttempts: attempts.filter(a => a.isCorrect).length,
    hintsUsed: attempts.filter(a => a.hintLevel !== 'none').length,
    firstAttemptCorrect: attempts.length > 0 && attempts[0].isCorrect,
    solved: attempts.some(a => a.isCorrect)
  };
};

// Static method to get problem difficulty metrics
attemptSchema.statics.getProblemMetrics = async function(problemId) {
  const attempts = await this.find({ problemId });

  if (attempts.length === 0) {
    return null;
  }

  const uniqueStudents = new Set(attempts.map(a => a.userId.toString())).size;
  const solvedCount = new Set(
    attempts.filter(a => a.isCorrect).map(a => a.userId.toString())
  ).size;

  return {
    totalAttempts: attempts.length,
    uniqueStudents: uniqueStudents,
    solvedByStudents: solvedCount,
    solveRate: (solvedCount / uniqueStudents * 100).toFixed(1),
    averageAttempts: (attempts.length / uniqueStudents).toFixed(1),
    hintsRequested: attempts.filter(a => a.hintLevel !== 'none').length
  };
};

// Static method to check if student has viewed solution for a problem
attemptSchema.statics.hasViewedSolution = async function(userId, problemId) {
  const solutionAttempt = await this.findOne({
    userId: userId,
    problemId: problemId,
    hintLevel: 'solution'
  });

  return !!solutionAttempt;
};

const Attempt = mongoose.model('Attempt', attemptSchema);

module.exports = Attempt;
