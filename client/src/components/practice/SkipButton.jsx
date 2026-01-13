/**
 * SkipButton Component
 *
 * Button to skip to the next problem.
 */

function SkipButton({ onClick, disabled = false }) {
  return (
    <div className="practice-skip-container">
      <button
        onClick={onClick}
        className="practice-skip-button"
        disabled={disabled}
      >
        Skip to Next Problem →
      </button>
    </div>
  );
}

export default SkipButton;
