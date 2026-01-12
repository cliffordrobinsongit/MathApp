/**
 * AlternateAnswersField Component
 *
 * Manages dynamic list of alternate answer inputs.
 * Allows adding/removing alternate answer fields.
 */

function AlternateAnswersField({
  alternateAnswers,
  onChange,
  onAdd,
  onRemove,
  disabled = false
}) {
  return (
    <div className="form-group">
      <label>Alternate Answers (Optional)</label>
      <div className="alternate-answers-list">
        {alternateAnswers.map((alt, index) => (
          <div key={index} className="alternate-answer-item">
            <input
              type="text"
              value={alt}
              onChange={(e) => onChange(index, e.target.value)}
              placeholder={`Alternate answer ${index + 1}`}
              disabled={disabled}
            />
            {alternateAnswers.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="btn-secondary"
                disabled={disabled}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="btn-secondary"
        disabled={disabled}
      >
        + Add Alternate Answer
      </button>
      <small className="help-text">
        Add alternate ways to express the correct answer (e.g., "x = 5" when answer is "5")
      </small>
    </div>
  );
}

export default AlternateAnswersField;
