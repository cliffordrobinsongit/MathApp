const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Problem title is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  subcategory: {
    type: String,
    required: [true, 'Subcategory is required'],
    trim: true
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required'],
    trim: true
  },
  problemText: {
    type: String,
    required: [true, 'Problem text is required'],
    trim: true
  },
  answerFormat: {
    type: String,
    required: [true, 'Answer format is required'],
    enum: ['number', 'expression'],
    lowercase: true
  },
  correctAnswer: {
    type: String,
    required: [true, 'Correct answer is required'],
    trim: true
  },
  alternateAnswers: {
    type: [String],
    default: []
  },
  hints: {
    steps: {
      type: String,
      default: ''
    },
    solution: {
      type: String,
      default: ''
    }
  },
  explanation: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    enum: ['seed', 'admin-manual', 'admin-generated'],
    default: 'seed'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  exampleProblemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
problemSchema.index({ category: 1, difficulty: 1, subcategory: 1 });
problemSchema.index({ source: 1, createdAt: -1 });

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
