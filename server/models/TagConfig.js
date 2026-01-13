const mongoose = require('mongoose');

const tagConfigSchema = new mongoose.Schema({
  configType: {
    type: String,
    required: true,
    unique: true,
    enum: ['categories', 'subcategories', 'difficulties'],
    lowercase: true
  },
  values: {
    type: [String],
    required: true,
    default: []
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Note: configType already has a unique index from unique: true in schema definition

const TagConfig = mongoose.model('TagConfig', tagConfigSchema);

module.exports = TagConfig;
