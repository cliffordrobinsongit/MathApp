/**
 * ResultCard Component
 *
 * Displays result feedback after answer submission.
 * Shows different UI for correct vs incorrect answers.
 */

function ResultCard({
  result,
  solutionViewed,
  onTryAgain,
  onNextProblem
}) {
  return (
    <div className="practice-result-container">
      <div className={`practice-result-card ${result.isCorrect ? 'correct' : 'incorrect'}`}>
        <h3 className="practice-result-title">
          {result.isCorrect ? '✓ Correct!' : '✗ Not Quite'}
        </h3>
        <p className="practice-feedback">{result.feedback}</p>

        {result.isCorrect && result.correctAnswer && (
          <p className="practice-correct-answer">
            Answer: {result.correctAnswer}
          </p>
        )}

        <div className="practice-button-group">
          {result.isCorrect ? (
            <button
              onClick={onNextProblem}
              className="practice-next-button"
            >
              Next Problem →
            </button>
          ) : (
            <>
              {!solutionViewed ? (
                <button
                  onClick={onTryAgain}
                  className="practice-try-again-button"
                >
                  Try Again
                </button>
              ) : (
                <>
                  <p className="practice-solution-viewed-message">
                    You've viewed the solution for this problem.
                  </p>
                  <button
                    onClick={onNextProblem}
                    className="practice-next-button"
                  >
                    Next Problem →
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
