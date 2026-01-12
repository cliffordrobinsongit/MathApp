import PropTypes from 'prop-types';

function GenerationProgress({ preGenerateHints }) {
  return (
    <div className="progress-indicator">
      <div className="spinner"></div>
      <p>Generating problems... This may take a minute.</p>
      {preGenerateHints && <p>Pre-generating hints and solutions for each problem...</p>}
    </div>
  );
}

GenerationProgress.propTypes = {
  preGenerateHints: PropTypes.bool
};

export default GenerationProgress;
