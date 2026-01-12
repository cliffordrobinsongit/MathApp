import PropTypes from 'prop-types';

function ProblemSelector({ problems, selectedProblemId, selectedProblem, onSelectProblem, disabled }) {
  return (
    <>
      <div className="form-group">
        <label htmlFor="example-problem">Select Example Problem *</label>
        <select
          id="example-problem"
          value={selectedProblemId}
          onChange={(e) => onSelectProblem(e.target.value)}
          disabled={disabled}
        >
          <option value="">Choose a problem...</option>
          {problems.map(p => (
            <option key={p._id} value={p._id}>
              {p.title} ({p.category} - {p.difficulty})
            </option>
          ))}
        </select>
      </div>

      {selectedProblem && (
        <div className="problem-preview">
          <h3>Example Problem Preview</h3>
          <div className="preview-content">
            <p><strong>Title:</strong> {selectedProblem.title}</p>
            <p><strong>Category:</strong> {selectedProblem.category}</p>
            <p><strong>Subcategory:</strong> {selectedProblem.subcategory}</p>
            <p><strong>Difficulty:</strong> {selectedProblem.difficulty}</p>
            <p><strong>Problem:</strong> {selectedProblem.problemText}</p>
            <p><strong>Answer:</strong> {selectedProblem.correctAnswer}</p>
          </div>
        </div>
      )}
    </>
  );
}

ProblemSelector.propTypes = {
  problems: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      subcategory: PropTypes.string,
      difficulty: PropTypes.string.isRequired,
      problemText: PropTypes.string,
      correctAnswer: PropTypes.string
    })
  ).isRequired,
  selectedProblemId: PropTypes.string.isRequired,
  selectedProblem: PropTypes.object,
  onSelectProblem: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default ProblemSelector;
