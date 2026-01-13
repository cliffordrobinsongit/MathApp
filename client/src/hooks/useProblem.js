import { useState } from 'react';
import api from '../services/api';

const useProblem = () => {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  /**
   * Fetch a random problem from the API
   */
  const fetchRandomProblem = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.get('/api/problems/random');

      if (response.success && response.problem) {
        setProblem(response.problem);
      } else {
        throw new Error('Failed to fetch problem');
      }
    } catch (err) {
      console.error('Error fetching problem:', err);
      setError(err.message || 'Failed to load problem');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Submit an answer to the current problem
   * @param {string} answer - The student's answer
   * @param {number} attemptNumber - The current attempt number
   */
  const submitAnswer = async (answer, attemptNumber = 1) => {
    if (!problem) {
      setError('No problem loaded');
      return null;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await api.post('/api/attempts/submit', {
        problemId: problem._id,
        studentAnswer: answer,
        attemptNumber
      });

      if (response.success) {
        setResult({
          isCorrect: response.isCorrect,
          feedback: response.feedback,
          reasoning: response.reasoning,
          nextStep: response.nextStep,
          correctAnswer: response.correctAnswer
        });
        return response;
      } else {
        throw new Error('Failed to submit answer');
      }
    } catch (err) {
      console.error('Error submitting answer:', err);

      // Handle solution viewed error
      if (err.response?.status === 403 && err.response?.data?.solutionViewed) {
        setError(err.response.data.message);
        // Auto-clear error after 3 seconds
        setTimeout(() => {
          setError(null);
        }, 3000);
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to submit answer');
      }
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Reset the result state (for try again)
   */
  const resetResult = () => {
    setResult(null);
  };

  /**
   * Request a hint for the current problem
   * @param {string} problemId - The problem ID
   * @param {string} level - Hint level ('steps' or 'solution')
   * @param {string} studentAnswer - The student's incorrect answer
   * @param {number} attemptNumber - The current attempt number
   */
  const requestHint = async (problemId, level, studentAnswer, attemptNumber) => {
    try {
      const response = await api.post(`/api/attempts/${problemId}/hint`, {
        level,
        studentAnswer,
        attemptNumber
      });

      if (response.success) {
        return {
          hint: response.hint,
          level: response.level,
          nextStep: response.nextStep,
          cached: response.cached
        };
      } else {
        throw new Error('Failed to get hint');
      }
    } catch (err) {
      console.error('Error requesting hint:', err);
      setError(err.message || 'Failed to get hint');
      return null;
    }
  };

  return {
    problem,
    loading,
    error,
    submitting,
    result,
    fetchRandomProblem,
    submitAnswer,
    resetResult,
    requestHint
  };
};

export default useProblem;
