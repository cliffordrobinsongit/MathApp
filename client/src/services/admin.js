import api from './api';

// Problem CRUD
export const createProblem = (data) => api.post('/api/admin/problems', data);
export const updateProblem = (id, data) => api.put(`/api/admin/problems/${id}`, data);
export const deleteProblem = (id) => api.delete(`/api/admin/problems/${id}`);
export const bulkDeleteProblems = (problemIds) => api.post('/api/admin/problems/bulk-delete', { problemIds });
export const listProblems = (params) => api.get('/api/admin/problems', { params });
export const getProblemAnalytics = (id) => api.get(`/api/admin/problems/${id}/analytics`);

// Bulk generation
export const bulkGenerate = (data) => api.post('/api/admin/bulk-generate', data);

// Tag management
export const getTags = (configType) => api.get(`/api/admin/tags/${configType}`);
export const updateTags = (configType, values) => api.put(`/api/admin/tags/${configType}`, { values });
export const addTag = (configType, value) => api.post(`/api/admin/tags/${configType}/add`, { value });
export const deleteTag = (configType, value) => api.delete(`/api/admin/tags/${configType}/${value}`);

// Prompt management
export const listPrompts = () => api.get('/api/admin/prompts');
export const getPrompt = (promptKey) => api.get(`/api/admin/prompts/${promptKey}`);
export const updatePrompt = (promptKey, data) => api.put(`/api/admin/prompts/${promptKey}`, data);
export const resetPrompt = (promptKey) => api.post(`/api/admin/prompts/${promptKey}/reset`);
