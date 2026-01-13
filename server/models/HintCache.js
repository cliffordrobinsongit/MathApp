const mongoose = require('mongoose');

const hintCacheSchema = new mongoose.Schema({
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
  hint: {
    type: String,
    required: [true, 'Hint text is required']
  },
  hitCount: {
    type: Number,
    default: 1,
    min: 1
  },
  lastUsed: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for fast lookups by problem and student answer
hintCacheSchema.index({ problemId: 1, studentAnswer: 1 }, { unique: true });

// Index for cleanup queries (removing old, unused hints)
hintCacheSchema.index({ lastUsed: 1, hitCount: 1 });

const HintCache = mongoose.model('HintCache', hintCacheSchema);

module.exports = HintCache;
