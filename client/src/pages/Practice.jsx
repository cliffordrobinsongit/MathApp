import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/auth';
import useProblem from '../hooks/useProblem';
import ProblemDisplay from '../components/ProblemDisplay';
import AnswerInput from '../components/AnswerInput';
import HintSystem from '../components/HintSystem';
import PracticeHeader from '../components/practice/PracticeHeader';
import SkipButton from '../components/practice/SkipButton';
import ResultCard from '../components/practice/ResultCard';
import './Practice.css';

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
  const [lastAnswer, setLastAnswer] = useState('');
  const [solutionViewed, setSolutionViewed] = useState(false);

  useEffect(() => {
    fetchRandomProblem();
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleSubmitAnswer = async (answer) => {
    setLastAnswer(answer);
    await submitAnswer(answer, attemptNumber);
  };

  const handleTryAgain = () => {
    setAttemptNumber(prev => prev + 1);
    resetResult();
  };

  const handleNextProblem = () => {
    setAttemptNumber(1);
    setLastAnswer('');
    setSolutionViewed(false);
    fetchRandomProblem();
  };

  const handleSolutionViewed = () => {
    setSolutionViewed(true);
  };

  return (
    <div className="practice-container">
      <PracticeHeader onLogout={handleLogout} />

      <div className="practice-content">
        {loading && (
          <div className="practice-loading-container">
            <p className="practice-loading-text">Loading problem...</p>
          </div>
        )}

        {error && (
          <div className="practice-error-container">
            <p className="practice-error-text">{error}</p>
            <button onClick={fetchRandomProblem} className="practice-retry-button">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && problem && (
          <>
            <ProblemDisplay problem={problem} attemptNumber={attemptNumber} />

            {!result && (
              <>
                <AnswerInput
                  onSubmit={handleSubmitAnswer}
                  loading={submitting}
                  disabled={submitting}
                />

                <SkipButton
                  onClick={handleNextProblem}
                  disabled={submitting}
                />
              </>
            )}

            {result && (
              <>
                <ResultCard
                  result={result}
                  solutionViewed={solutionViewed}
                  onTryAgain={handleTryAgain}
                  onNextProblem={handleNextProblem}
                />

                {!result.isCorrect && (
                  <HintSystem
                    problemId={problem._id}
                    onHintRequest={requestHint}
                    attemptNumber={attemptNumber}
                    studentAnswer={lastAnswer}
                    onSolutionViewed={handleSolutionViewed}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Practice;
