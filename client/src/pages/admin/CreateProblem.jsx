import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProblem } from '../../services/admin';
import { useTags } from '../../hooks/useTags';
import { useProblemForm } from '../../hooks/useProblemForm';
import ProblemFormFields from './components/ProblemFormFields';
import './ProblemForm.css';

function CreateProblem() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { tags, error: tagsError } = useTags();
  const {
    formData,
    handleChange,
    handleAlternateAnswerChange,
    addAlternateAnswer,
    removeAlternateAnswer,
    cleanFormData
  } = useProblemForm();

  if (tagsError) {
    return (
      <div className="problem-form">
        <div className="error-message">{tagsError}</div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await createProblem(cleanFormData());
      alert('Problem created successfully!');
      navigate('/admin/problems');
    } catch (error) {
      console.error('Failed to create problem:', error);
      alert('Failed to create problem: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="problem-form">
      <h1>Create New Problem</h1>

      <form onSubmit={handleSubmit}>
        <ProblemFormFields
          formData={formData}
          tags={tags}
          onChange={handleChange}
          onAlternateAnswerChange={handleAlternateAnswerChange}
          onAddAlternateAnswer={addAlternateAnswer}
          onRemoveAlternateAnswer={removeAlternateAnswer}
          disabled={loading}
        />

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/admin/problems')}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Problem'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateProblem;
