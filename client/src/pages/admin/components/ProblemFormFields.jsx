/**
 * ProblemFormFields Component
 *
 * All form fields for problem create/edit forms.
 * Shared between CreateProblem and EditProblem pages.
 */

import AlternateAnswersField from './AlternateAnswersField';

function ProblemFormFields({
  formData,
  tags,
  onChange,
  onAlternateAnswerChange,
  onAddAlternateAnswer,
  onRemoveAlternateAnswer,
  disabled = false
}) {
  return (
    <>
      <div className="form-group">
        <label htmlFor="title">Problem Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={onChange}
          required
          placeholder="e.g., Two-Step Equation 1"
          disabled={disabled}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={onChange}
            required
            disabled={disabled}
          >
            <option value="">Select Category</option>
            {tags.categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="subcategory">Subcategory *</label>
          <select
            id="subcategory"
            name="subcategory"
            value={formData.subcategory}
            onChange={onChange}
            required
            disabled={disabled}
          >
            <option value="">Select Subcategory</option>
            {tags.subcategories.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="difficulty">Difficulty *</label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={onChange}
            required
            disabled={disabled}
          >
            <option value="">Select Difficulty</option>
            {tags.difficulties.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="problemText">Problem Text *</label>
        <textarea
          id="problemText"
          name="problemText"
          value={formData.problemText}
          onChange={onChange}
          required
          rows="3"
          placeholder="e.g., Solve for x: 2x + 5 = 13"
          disabled={disabled}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="answerFormat">Answer Format *</label>
          <select
            id="answerFormat"
            name="answerFormat"
            value={formData.answerFormat}
            onChange={onChange}
            required
            disabled={disabled}
          >
            <option value="number">Number</option>
            <option value="expression">Expression</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="correctAnswer">Correct Answer *</label>
          <input
            type="text"
            id="correctAnswer"
            name="correctAnswer"
            value={formData.correctAnswer}
            onChange={onChange}
            required
            placeholder="e.g., 4"
            disabled={disabled}
          />
        </div>
      </div>

      <AlternateAnswersField
        alternateAnswers={formData.alternateAnswers}
        onChange={onAlternateAnswerChange}
        onAdd={onAddAlternateAnswer}
        onRemove={onRemoveAlternateAnswer}
        disabled={disabled}
      />

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="preGenerateHints"
            checked={formData.preGenerateHints}
            onChange={onChange}
            disabled={disabled}
          />
          Pre-generate hints and solutions (uses Claude API)
        </label>
      </div>
    </>
  );
}

export default ProblemFormFields;
