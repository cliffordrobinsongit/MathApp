import { useState, useEffect } from 'react';
import { listProblems, bulkGenerate } from '../../services/admin';
import ProblemSelector from './components/ProblemSelector';
import GenerationProgress from './components/GenerationProgress';
import GenerationResult from './components/GenerationResult';
import './BulkGenerate.css';

function BulkGenerate() {
  const [problems, setProblems] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState('');
  const [count, setCount] = useState(5);
  const [preGenerateHints, setPreGenerateHints] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    if (selectedProblemId) {
      const problem = problems.find(p => p._id === selectedProblemId);
      setSelectedProblem(problem);
    } else {
      setSelectedProblem(null);
    }
  }, [selectedProblemId, problems]);

  const fetchProblems = async () => {
    try {
      const response = await listProblems({ limit: 1000 });
      setProblems(response.problems);
    } catch (error) {
      console.error('Failed to fetch problems:', error);
      alert('Failed to load problems');
    }
  };

  const handleGenerate = async () => {
    if (!selectedProblemId) {
      alert('Please select an example problem');
      return;
    }

    if (count < 1 || count > 20) {
      alert('Count must be between 1 and 20');
      return;
    }

    if (!window.confirm(`Generate ${count} problems similar to "${selectedProblem?.title}"?`)) {
      return;
    }

    try {
      setGenerating(true);
      setResult(null);
      const response = await bulkGenerate({
        exampleProblemId: selectedProblemId,
        count,
        preGenerateHints
      });
      setResult(response);
      alert(`Successfully generated ${response.count} problems!`);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Generation failed: ' + (error.message || 'Unknown error'));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bulk-generate">
      <h1>Bulk Generate Problems</h1>
      <p className="subtitle">
        Select an example problem and generate multiple similar problems using AI
      </p>

      <div className="form-container">
        <ProblemSelector
          problems={problems}
          selectedProblemId={selectedProblemId}
          selectedProblem={selectedProblem}
          onSelectProblem={setSelectedProblemId}
          disabled={generating}
        />

        <div className="form-group">
          <label htmlFor="count">Number of Problems to Generate (1-20) *</label>
          <input
            type="number"
            id="count"
            min="1"
            max="20"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            disabled={generating}
          />
          <small>Note: Each problem counts as 1 Claude API call. With hints enabled, this becomes 2 calls per problem.</small>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={preGenerateHints}
              onChange={(e) => setPreGenerateHints(e.target.checked)}
              disabled={generating}
            />
            Pre-generate hints and solutions (recommended)
          </label>
          <small>
            If enabled, hints and solutions will be generated immediately. This increases generation time but provides instant hints to students.
          </small>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!selectedProblemId || generating}
          className="btn-generate"
        >
          {generating ? 'Generating Problems...' : `Generate ${count} Problem${count !== 1 ? 's' : ''}`}
        </button>

        {generating && <GenerationProgress preGenerateHints={preGenerateHints} />}

        <GenerationResult result={result} />
      </div>
    </div>
  );
}

export default BulkGenerate;
