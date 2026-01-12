const mongoose = require('mongoose');

const promptConfigSchema = new mongoose.Schema({
  promptKey: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  displayName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  promptTemplate: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true,
    default: 'claude-3-haiku-20240307'
  },
  temperature: {
    type: Number,
    required: true,
    min: 0,
    max: 2,
    default: 0.7
  },
  maxTokens: {
    type: Number,
    required: true,
    min: 1,
    max: 10000,
    default: 500
  },
  availableVariables: {
    type: [String],
    required: true,
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Note: promptKey already has a unique index from unique: true in schema definition

const PromptConfig = mongoose.model('PromptConfig', promptConfigSchema);

module.exports = PromptConfig;
