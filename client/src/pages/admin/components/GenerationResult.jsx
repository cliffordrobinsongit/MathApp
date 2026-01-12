import PropTypes from 'prop-types';

function GenerationResult({ result }) {
  if (!result) {
    return null;
  }

  return (
    <div className="result-box">
      <h3>✓ Generation Complete!</h3>
      <p>Successfully generated <strong>{result.count}</strong> problem(s)</p>
      <div className="result-details">
        <p><strong>Problem IDs:</strong></p>
        <div className="id-list">
          {result.problemIds.map((id, index) => (
            <code key={id}>
              {index + 1}. {id}
            </code>
          ))}
        </div>
      </div>
      <p className="result-note">
        The new problems are now available in the <a href="/admin/problems">Problems Management</a> page.
      </p>
    </div>
  );
}

GenerationResult.propTypes = {
  result: PropTypes.shape({
    count: PropTypes.number.isRequired,
    problemIds: PropTypes.arrayOf(PropTypes.string).isRequired
  })
};

export default GenerationResult;
