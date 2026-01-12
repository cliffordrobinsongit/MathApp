import { useState, useEffect } from 'react';
import { listPrompts, updatePrompt, resetPrompt } from '../../services/admin';
import './PromptManagement.css';

const MODEL_OPTIONS = [
  { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku (fast, economical)' },
  { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet (high quality)' },
  { value: 'claude-3-opus-latest', label: 'Claude 3 Opus (highest quality)' }
];

function PromptManagement() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [editForm, setEditForm] = useState({
    promptTemplate: '',
    model: '',
    temperature: 0,
    maxTokens: 0
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const response = await listPrompts();
      setPrompts(response.prompts || []);
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
      alert('Failed to load prompts');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (prompt) => {
    setSelectedPrompt(prompt);
    setEditForm({
      promptTemplate: prompt.promptTemplate,
      model: prompt.model,
      temperature: prompt.temperature,
      maxTokens: prompt.maxTokens
    });
  };

  const handleCloseModal = () => {
    setSelectedPrompt(null);
    setEditForm({
      promptTemplate: '',
      model: '',
      temperature: 0,
      maxTokens: 0
    });
  };

  const handleSave = async () => {
    if (!selectedPrompt) return;

    // Validation
    if (!editForm.promptTemplate.trim()) {
      alert('Prompt template cannot be empty');
      return;
    }

    if (editForm.temperature < 0 || editForm.temperature > 2) {
      alert('Temperature must be between 0 and 2');
      return;
    }

    if (editForm.maxTokens < 1 || editForm.maxTokens > 10000) {
      alert('Max tokens must be between 1 and 10000');
      return;
    }

    try {
      setSaving(true);
      await updatePrompt(selectedPrompt.promptKey, {
        promptTemplate: editForm.promptTemplate,
        model: editForm.model,
        temperature: Number(editForm.temperature),
        maxTokens: Number(editForm.maxTokens)
      });
      alert('Prompt updated successfully!');
      handleCloseModal();
      fetchPrompts();
    } catch (error) {
      console.error('Failed to update prompt:', error);
      alert('Failed to update prompt: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!selectedPrompt) return;

    if (!window.confirm(`Reset "${selectedPrompt.displayName}" to default configuration?\n\nThis will discard all custom changes.`)) {
      return;
    }

    try {
      setSaving(true);
      await resetPrompt(selectedPrompt.promptKey);
      alert('Prompt reset to default successfully!');
      handleCloseModal();
      fetchPrompts();
    } catch (error) {
      console.error('Failed to reset prompt:', error);
      alert('Failed to reset prompt: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="prompt-management">
        <div className="loading">Loading prompts...</div>
      </div>
    );
  }

  return (
    <div className="prompt-management">
      <div className="page-header">
        <h1>Prompt Management</h1>
        <p className="description">
          Manage Claude API prompts and parameters. Changes take effect within 5 minutes.
        </p>
      </div>

      <div className="prompts-list">
        {prompts.map(prompt => (
          <div key={prompt.promptKey} className="prompt-card">
            <div className="prompt-card-header">
              <h3>{prompt.displayName}</h3>
              <button
                onClick={() => handleEdit(prompt)}
                className="btn-edit"
              >
                Edit
              </button>
            </div>
            <p className="prompt-key">{prompt.promptKey}</p>
            <p className="prompt-description">{prompt.description}</p>
            <div className="prompt-metadata">
              <span className="metadata-item">
                <strong>Model:</strong> {prompt.model}
              </span>
              <span className="metadata-item">
                <strong>Temperature:</strong> {prompt.temperature}
              </span>
              <span className="metadata-item">
                <strong>Max Tokens:</strong> {prompt.maxTokens}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedPrompt && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Prompt: {selectedPrompt.displayName}</h2>
              <button onClick={handleCloseModal} className="btn-close">×</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="form-label-readonly">
                  <strong>Prompt Key:</strong> {selectedPrompt.promptKey}
                </label>
              </div>

              <div className="form-group">
                <label className="form-label-readonly">
                  <strong>Description:</strong> {selectedPrompt.description}
                </label>
              </div>

              <div className="form-group">
                <label className="form-label-readonly">
                  <strong>Available Variables:</strong>
                </label>
                <div className="variables-list">
                  {selectedPrompt.availableVariables.map((variable, index) => (
                    <code key={index} className="variable-tag">${'{' + variable + '}'}</code>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <strong>Prompt Template</strong>
                </label>
                <textarea
                  className="form-textarea"
                  value={editForm.promptTemplate}
                  onChange={(e) => setEditForm({ ...editForm, promptTemplate: e.target.value })}
                  rows={20}
                  spellCheck={false}
                />
                <div className="char-count">
                  {editForm.promptTemplate.length} characters
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <strong>Model</strong>
                  </label>
                  <select
                    className="form-select"
                    value={editForm.model}
                    onChange={(e) => setEditForm({ ...editForm, model: e.target.value })}
                  >
                    {MODEL_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <strong>Temperature</strong> <span className="help-text">(0-2)</span>
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={editForm.temperature}
                    onChange={(e) => setEditForm({ ...editForm, temperature: e.target.value })}
                    min="0"
                    max="2"
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <strong>Max Tokens</strong> <span className="help-text">(1-10000)</span>
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={editForm.maxTokens}
                    onChange={(e) => setEditForm({ ...editForm, maxTokens: e.target.value })}
                    min="1"
                    max="10000"
                    step="50"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={handleReset}
                className="btn-reset"
                disabled={saving}
              >
                Reset to Default
              </button>
              <div className="footer-right">
                <button
                  onClick={handleCloseModal}
                  className="btn-cancel"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn-save"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PromptManagement;
