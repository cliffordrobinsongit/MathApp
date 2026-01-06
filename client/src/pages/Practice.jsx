import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/auth';
import useProblem from '../hooks/useProblem';
import ProblemDisplay from '../components/ProblemDisplay';
import AnswerInput from '../components/AnswerInput';
import HintSystem from '../components/HintSystem';

const Practice = () => {
  const navigate = useNavigate();
  const {
    problem,
    loading,
    error,
    submitting,
    result,
    fetchRandomProblem,
    submitAnswer,
    resetResult,
    requestHint
  } = useProblem();

  const [attemptNumber, setAttemptNumber] = useState(1);

  useEffect(() => {
    fetchRandomProblem();
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleSubmitAnswer = async (answer) => {
    await submitAnswer(answer, attemptNumber);
  };

  const handleTryAgain = () => {
    setAttemptNumber(prev => prev + 1);
    resetResult();
  };

  const handleNextProblem = () => {
    setAttemptNumber(1);
    fetchRandomProblem();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Math Practice</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div style={styles.content}>
        {loading && (
          <div style={styles.loadingContainer}>
            <p style={styles.loadingText}>Loading problem...</p>
          </div>
        )}

        {error && (
          <div style={styles.errorContainer}>
            <p style={styles.errorText}>{error}</p>
            <button onClick={fetchRandomProblem} style={styles.retryButton}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && problem && (
          <>
            <ProblemDisplay problem={problem} attemptNumber={attemptNumber} />

            {!result && (
              <AnswerInput
                onSubmit={handleSubmitAnswer}
                loading={submitting}
                disabled={submitting}
              />
            )}

            {result && (
              <div style={styles.resultContainer}>
                <div style={{
                  ...styles.resultCard,
                  ...(result.isCorrect ? styles.resultCardCorrect : styles.resultCardIncorrect)
                }}>
                  <h3 style={styles.resultTitle}>
                    {result.isCorrect ? '✓ Correct!' : '✗ Not Quite'}
                  </h3>
                  <p style={styles.feedback}>{result.feedback}</p>

                  {result.isCorrect && result.correctAnswer && (
                    <p style={styles.correctAnswer}>
                      Answer: {result.correctAnswer}
                    </p>
                  )}

                  <div style={styles.buttonGroup}>
                    {result.isCorrect ? (
                      <button
                        onClick={handleNextProblem}
                        style={styles.nextButton}
                      >
                        Next Problem →
                      </button>
                    ) : (
                      <button
                        onClick={handleTryAgain}
                        style={styles.tryAgainButton}
                      >
                        Try Again
                      </button>
                    )}
                  </div>
                </div>

                {!result.isCorrect && (
                  <HintSystem
                    problemId={problem._id}
                    onHintRequest={requestHint}
                    attemptNumber={attemptNumber}
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '20px 30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '600',
    color: '#333'
  },
  logoutButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'white',
    backgroundColor: '#ef4444',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  loadingContainer: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  loadingText: {
    fontSize: '18px',
    color: '#6b7280'
  },
  errorContainer: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  errorText: {
    fontSize: '16px',
    color: '#ef4444',
    marginBottom: '20px'
  },
  retryButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'white',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  resultContainer: {
    marginTop: '20px'
  },
  resultCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderLeft: '4px solid'
  },
  resultCardCorrect: {
    borderLeftColor: '#10b981'
  },
  resultCardIncorrect: {
    borderLeftColor: '#f59e0b'
  },
  resultTitle: {
    margin: '0 0 12px 0',
    fontSize: '20px',
    fontWeight: '600'
  },
  feedback: {
    margin: '0 0 16px 0',
    fontSize: '16px',
    color: '#374151',
    lineHeight: '1.6'
  },
  correctAnswer: {
    margin: '0 0 20px 0',
    fontSize: '14px',
    color: '#6b7280',
    fontFamily: 'monospace'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center'
  },
  nextButton: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#10b981',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  tryAgainButton: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#f59e0b',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }
};

export default Practice;
