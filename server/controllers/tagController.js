const TagConfig = require('../models/TagConfig');
const Problem = require('../models/Problem');

// @desc    Get tags for a specific config type
// @route   GET /api/admin/tags/:configType
// @access  Private + Admin
const getTags = async (req, res) => {
  try {
    const { configType } = req.params;

    // Validate config type
    if (!['categories', 'subcategories', 'difficulties'].includes(configType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid config type'
      });
    }

    const config = await TagConfig.findOne({ configType });

    res.json({
      success: true,
      values: config?.values || []
    });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tags',
      error: error.message
    });
  }
};

// @desc    Update all tags for a config type
// @route   PUT /api/admin/tags/:configType
// @access  Private + Admin
const updateTags = async (req, res) => {
  try {
    const { configType } = req.params;
    const { values } = req.body;

    // Validate config type
    if (!['categories', 'subcategories', 'difficulties'].includes(configType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid config type'
      });
    }

    // Validate values is an array
    if (!Array.isArray(values)) {
      return res.status(400).json({
        success: false,
        message: 'Values must be an array'
      });
    }

    await TagConfig.findOneAndUpdate(
      { configType },
      {
        values,
        lastUpdatedBy: req.userId,
        updatedAt: Date.now()
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: `Successfully updated ${configType}`
    });
  } catch (error) {
    console.error('Update tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update tags',
      error: error.message
    });
  }
};

// @desc    Add a single tag to a config type
// @route   POST /api/admin/tags/:configType/add
// @access  Private + Admin
const addTag = async (req, res) => {
  try {
    const { configType } = req.params;
    const { value } = req.body;

    // Validate config type
    if (!['categories', 'subcategories', 'difficulties'].includes(configType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid config type'
      });
    }

    // Validate value
    if (!value || typeof value !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Value must be a non-empty string'
      });
    }

    await TagConfig.findOneAndUpdate(
      { configType },
      {
        $addToSet: { values: value.toLowerCase().trim() },
        lastUpdatedBy: req.userId,
        updatedAt: Date.now()
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: `Successfully added "${value}" to ${configType}`
    });
  } catch (error) {
    console.error('Add tag error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add tag',
      error: error.message
    });
  }
};

// @desc    Delete a tag from a config type
// @route   DELETE /api/admin/tags/:configType/:value
// @access  Private + Admin
const deleteTag = async (req, res) => {
  try {
    const { configType, value } = req.params;

    // Validate config type
    if (!['categories', 'subcategories', 'difficulties'].includes(configType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid config type'
      });
    }

    // Map configType to Problem field name (remove 'ies' or 's')
    const fieldMap = {
      'categories': 'category',
      'subcategories': 'subcategory',
      'difficulties': 'difficulty'
    };
    const fieldName = fieldMap[configType];

    // Check if tag is in use by any problems
    const count = await Problem.countDocuments({ [fieldName]: value });
    if (count > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete "${value}". ${count} problem(s) use this tag.`,
        count
      });
    }

    // Remove the tag
    await TagConfig.findOneAndUpdate(
      { configType },
      {
        $pull: { values: value },
        lastUpdatedBy: req.userId,
        updatedAt: Date.now()
      }
    );

    res.json({
      success: true,
      message: `Successfully deleted "${value}" from ${configType}`
    });
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete tag',
      error: error.message
    });
  }
};

module.exports = {
  getTags,
  updateTags,
  addTag,
  deleteTag
};
