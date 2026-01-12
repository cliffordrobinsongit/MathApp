const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const {
  createProblem,
  updateProblem,
  deleteProblem,
  bulkDeleteProblems,
  listProblems,
  getProblemAnalytics
} = require('../controllers/problemController');
const { bulkGenerate } = require('../controllers/bulkGenerationController');
const { getTags, updateTags, addTag, deleteTag } = require('../controllers/tagController');
const {
  listPrompts,
  getPrompt,
  updatePrompt,
  resetPromptToDefault
} = require('../controllers/promptController');

// All routes require authentication + admin privileges
// The authenticate middleware must be applied first to populate req.user

// Problem CRUD
router.post('/problems', authenticate, requireAdmin, createProblem);
router.put('/problems/:id', authenticate, requireAdmin, updateProblem);
router.delete('/problems/:id', authenticate, requireAdmin, deleteProblem);
router.post('/problems/bulk-delete', authenticate, requireAdmin, bulkDeleteProblems);
router.get('/problems', authenticate, requireAdmin, listProblems);
router.get('/problems/:id/analytics', authenticate, requireAdmin, getProblemAnalytics);

// Bulk generation
router.post('/bulk-generate', authenticate, requireAdmin, bulkGenerate);

// Tag management
router.get('/tags/:configType', authenticate, requireAdmin, getTags);
router.put('/tags/:configType', authenticate, requireAdmin, updateTags);
router.post('/tags/:configType/add', authenticate, requireAdmin, addTag);
router.delete('/tags/:configType/:value', authenticate, requireAdmin, deleteTag);

// Prompt management
router.get('/prompts', authenticate, requireAdmin, listPrompts);
router.get('/prompts/:promptKey', authenticate, requireAdmin, getPrompt);
router.put('/prompts/:promptKey', authenticate, requireAdmin, updatePrompt);
router.post('/prompts/:promptKey/reset', authenticate, requireAdmin, resetPromptToDefault);

module.exports = router;
