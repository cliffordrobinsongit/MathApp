const PromptConfig = require('../models/PromptConfig');
const { DEFAULT_PROMPT_CONFIGS, VALID_MODELS } = require('../config');

// @desc    List all prompt configurations
// @route   GET /api/admin/prompts
// @access  Private + Admin
const listPrompts = async (req, res) => {
  try {
    const prompts = await PromptConfig.find({ isActive: true })
      .sort({ promptKey: 1 })
      .select('-__v');

    res.json({
      success: true,
      prompts
    });
  } catch (error) {
    console.error('List prompts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list prompts',
      error: error.message
    });
  }
};

// @desc    Get single prompt configuration
// @route   GET /api/admin/prompts/:promptKey
// @access  Private + Admin
const getPrompt = async (req, res) => {
  try {
    const { promptKey } = req.params;

    const prompt = await PromptConfig.findOne({
      promptKey: promptKey.toLowerCase(),
      isActive: true
    });

    if (!prompt) {
      return res.status(404).json({
        success: false,
        message: 'Prompt configuration not found'
      });
    }

    res.json({
      success: true,
      prompt
    });
  } catch (error) {
    console.error('Get prompt error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get prompt',
      error: error.message
    });
  }
};

// @desc    Update prompt configuration
// @route   PUT /api/admin/prompts/:promptKey
// @access  Private + Admin
const updatePrompt = async (req, res) => {
  try {
    const { promptKey } = req.params;
    const { promptTemplate, model, temperature, maxTokens } = req.body;

    // Find existing prompt
    const existingPrompt = await PromptConfig.findOne({
      promptKey: promptKey.toLowerCase(),
      isActive: true
    });

    if (!existingPrompt) {
      return res.status(404).json({
        success: false,
        message: 'Prompt configuration not found'
      });
    }

    // Validate prompt template
    if (promptTemplate !== undefined) {
      if (typeof promptTemplate !== 'string' || promptTemplate.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Prompt template must be a non-empty string'
        });
      }
    }

    // Validate model
    if (model !== undefined) {
      if (!VALID_MODELS.includes(model)) {
        return res.status(400).json({
          success: false,
          message: `Invalid model. Must be one of: ${VALID_MODELS.join(', ')}`
        });
      }
    }

    // Validate temperature
    if (temperature !== undefined) {
      const temp = Number(temperature);
      if (isNaN(temp) || temp < 0 || temp > 2) {
        return res.status(400).json({
          success: false,
          message: 'Temperature must be a number between 0 and 2'
        });
      }
    }

    // Validate maxTokens
    if (maxTokens !== undefined) {
      const tokens = Number(maxTokens);
      if (isNaN(tokens) || tokens < 1 || tokens > 10000) {
        return res.status(400).json({
          success: false,
          message: 'Max tokens must be a number between 1 and 10000'
        });
      }
    }

    // Build update object
    const updateData = {
      lastUpdatedBy: req.userId,
      updatedAt: Date.now()
    };

    if (promptTemplate !== undefined) updateData.promptTemplate = promptTemplate;
    if (model !== undefined) updateData.model = model;
    if (temperature !== undefined) updateData.temperature = Number(temperature);
    if (maxTokens !== undefined) updateData.maxTokens = Number(maxTokens);

    // Update the prompt
    const updatedPrompt = await PromptConfig.findOneAndUpdate(
      { promptKey: promptKey.toLowerCase() },
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: 'Prompt configuration updated successfully',
      prompt: updatedPrompt
    });
  } catch (error) {
    console.error('Update prompt error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update prompt',
      error: error.message
    });
  }
};

// @desc    Reset prompt to default configuration
// @route   POST /api/admin/prompts/:promptKey/reset
// @access  Private + Admin
const resetPromptToDefault = async (req, res) => {
  try {
    const { promptKey } = req.params;

    // Find existing prompt
    const existingPrompt = await PromptConfig.findOne({
      promptKey: promptKey.toLowerCase(),
      isActive: true
    });

    if (!existingPrompt) {
      return res.status(404).json({
        success: false,
        message: 'Prompt configuration not found'
      });
    }

    // Use shared default configurations
    const defaultConfig = DEFAULT_PROMPT_CONFIGS[promptKey.toLowerCase()];

    if (!defaultConfig) {
      return res.status(400).json({
        success: false,
        message: 'No default configuration found for this prompt key'
      });
    }

    // Reset to default
    const updatedPrompt = await PromptConfig.findOneAndUpdate(
      { promptKey: promptKey.toLowerCase() },
      {
        promptTemplate: defaultConfig.promptTemplate,
        model: defaultConfig.model,
        temperature: defaultConfig.temperature,
        maxTokens: defaultConfig.maxTokens,
        lastUpdatedBy: req.userId,
        updatedAt: Date.now()
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Prompt configuration reset to default',
      prompt: updatedPrompt
    });
  } catch (error) {
    console.error('Reset prompt error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset prompt',
      error: error.message
    });
  }
};

module.exports = {
  listPrompts,
  getPrompt,
  updatePrompt,
  resetPromptToDefault
};
