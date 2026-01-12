import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateProblem } from '../../services/admin';
import { useTags } from '../../hooks/useTags';
import { useProblemForm } from '../../hooks/useProblemForm';
import ProblemFormFields from './components/ProblemFormFields';
import api from '../../services/api';
import './ProblemForm.css';

function EditProblem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { tags, error: tagsError } = useTags();
  const {
    formData,
    handleChange,
    handleAlternateAnswerChange,
    addAlternateAnswer,
    removeAlternateAnswer,
    cleanFormData,
    setFormData
  } = useProblemForm();

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const fetchProblem = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/problems/${id}`);
      const problem = response.problem;

      setFormData({
        title: problem.title,
        category: problem.category,
        subcategory: problem.subcategory,
        difficulty: problem.difficulty,
        problemText: problem.problemText,
        answerFormat: problem.answerFormat,
        correctAnswer: problem.correctAnswer,
        alternateAnswers: problem.alternateAnswers.length > 0
          ? problem.alternateAnswers
          : [''],
        preGenerateHints: false,
        regenerateHints: false
      });
    } catch (error) {
      console.error('Failed to fetch problem:', error);
      alert('Failed to load problem');
      navigate('/admin/problems');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await updateProblem(id, cleanFormData());
      alert('Problem updated successfully!');
      navigate('/admin/problems');
    } catch (error) {
      console.error('Failed to update problem:', error);
      alert('Failed to update problem: ' + (error.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  if (tagsError) {
    return (
      <div className="problem-form">
        <div className="error-message">{tagsError}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="problem-form">
        <div>Loading problem...</div>
      </div>
    );
  }

  return (
    <div className="problem-form">
      <h1>Edit Problem</h1>

      <form onSubmit={handleSubmit}>
        <ProblemFormFields
          formData={formData}
          tags={tags}
          onChange={handleChange}
          onAlternateAnswerChange={handleAlternateAnswerChange}
          onAddAlternateAnswer={addAlternateAnswer}
          onRemoveAlternateAnswer={removeAlternateAnswer}
          disabled={saving}
        />

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="regenerateHints"
              checked={formData.regenerateHints}
              onChange={handleChange}
              disabled={saving}
            />
            Regenerate hints and solutions (uses Claude API)
          </label>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/admin/problems')}
            className="btn-secondary"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProblem;
