import { useState } from 'react';

const HintSystem = ({
  problemId,
  onHintRequest,
  attemptNumber,
  studentAnswer,
  onSolutionViewed
}) => {
  const [hintLevel, setHintLevel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState(null);

  const handleShowHint = async (level) => {
    setLoading(true);
    try {
      const result = await onHintRequest(problemId, level, studentAnswer, attemptNumber);
      if (result) {
        setHint(result.hint);
        setHintLevel(level);

        // Notify parent when solution is viewed
        if (level === 'solution' && onSolutionViewed) {
          onSolutionViewed(problemId);
        }
      }
    } catch (error) {
      console.error('Error fetching hint:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {!hint && (
        <div style={styles.buttonContainer}>
          {!hintLevel && (
            <button
              onClick={() => handleShowHint('steps')}
              disabled={loading}
              style={{
                ...styles.button,
                ...styles.hintButton,
                ...(loading ? styles.buttonDisabled : {})
              }}
            >
              {loading ? 'Loading...' : 'Show Hints'}
            </button>
          )}
        </div>
      )}

      {hint && (
        <div style={styles.hintCard}>
          <div style={styles.hintHeader}>
            <h4 style={styles.hintTitle}>
              {hintLevel === 'steps' ? 'Hints' : 'Solution'}
            </h4>
          </div>
          <div style={styles.hintContent}>
            <pre style={styles.hintText}>{hint}</pre>
          </div>

          {hintLevel === 'steps' && (
            <div style={styles.buttonContainer}>
              <button
                onClick={() => handleShowHint('solution')}
                disabled={loading}
                style={{
                  ...styles.button,
                  ...styles.solutionButton,
                  ...(loading ? styles.buttonDisabled : {})
                }}
              >
                {loading ? 'Loading...' : 'Show Full Solution'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginTop: '20px'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px'
  },
  button: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  hintButton: {
    color: 'white',
    backgroundColor: '#8b5cf6'
  },
  solutionButton: {
    color: 'white',
    backgroundColor: '#6366f1'
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  hintCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderLeft: '4px solid #8b5cf6'
  },
  hintHeader: {
    marginBottom: '12px'
  },
  hintTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#8b5cf6'
  },
  hintContent: {
    marginBottom: '16px'
  },
  hintText: {
    margin: 0,
    fontSize: '14px',
    lineHeight: '1.8',
    color: '#374151',
    whiteSpace: 'pre-wrap',
    fontFamily: 'inherit'
  }
};

export default HintSystem;
