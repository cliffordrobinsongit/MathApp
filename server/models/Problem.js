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
    enum: ['pre-algebra', 'algebra'],
    lowercase: true
  },
  subcategory: {
    type: String,
    required: [true, 'Subcategory is required'],
    trim: true,
    lowercase: true
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required'],
    enum: ['pre-algebra', 'algebra-1', 'algebra-2'],
    lowercase: true
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster random selection
problemSchema.index({ category: 1, difficulty: 1 });

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
