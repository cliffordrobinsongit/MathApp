import { useState } from 'react';
import { getProblemAnalytics, listProblems } from '../../services/admin';
import './Analytics.css';

function Analytics() {
  const [problemId, setProblemId] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [problems, setProblems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term.trim().length > 2) {
      try {
        const response = await listProblems({ search: term, limit: 10 });
        setProblems(response.problems);
        setShowDropdown(true);
      } catch (error) {
        console.error('Search failed:', error);
      }
    } else {
      setShowDropdown(false);
    }
  };

  const selectProblem = (problem) => {
    setProblemId(problem._id);
    setSearchTerm(problem.title);
    setShowDropdown(false);
    loadAnalytics(problem._id);
  };

  const loadAnalytics = async (id) => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await getProblemAnalytics(id);
      setAnalytics(response);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      alert('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analytics">
      <h1>Problem Analytics</h1>
      <p className="subtitle">
        View detailed analytics for individual problems
      </p>

      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for a problem by title..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchTerm.length > 2 && setShowDropdown(true)}
          />
          {showDropdown && problems.length > 0 && (
            <div className="dropdown">
              {problems.map(problem => (
                <div
                  key={problem._id}
                  className="dropdown-item"
                  onClick={() => selectProblem(problem)}
                >
                  <div className="dropdown-title">{problem.title}</div>
                  <div className="dropdown-meta">
                    {problem.category} - {problem.difficulty}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="loading">Loading analytics...</div>
      )}

      {analytics && !loading && (
        <div className="analytics-results">
          <div className="problem-info">
            <h2>{analytics.problem.title}</h2>
            <div className="problem-tags">
              <span className="tag">{analytics.problem.category}</span>
              <span className="tag">{analytics.problem.difficulty}</span>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{analytics.totalAttempts || 0}</div>
              <div className="stat-label">Total Attempts</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">{analytics.uniqueStudents || 0}</div>
              <div className="stat-label">Unique Students</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">{analytics.solvedByStudents || 0}</div>
              <div className="stat-label">Students Solved</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">
                {analytics.solveRate !== undefined
                  ? `${Math.round(analytics.solveRate)}%`
                  : 'N/A'}
              </div>
              <div className="stat-label">Solve Rate</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">
                {analytics.averageAttempts !== undefined
                  ? analytics.averageAttempts.toFixed(1)
                  : 'N/A'}
              </div>
              <div className="stat-label">Avg. Attempts</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">{analytics.hintsRequested || 0}</div>
              <div className="stat-label">Hints Requested</div>
            </div>
          </div>

          {analytics.totalAttempts === 0 && (
            <div className="no-data">
              No students have attempted this problem yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Analytics;
