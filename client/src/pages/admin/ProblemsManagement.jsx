import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listProblems, deleteProblem, bulkDeleteProblems } from '../../services/admin';
import useSelection from '../../hooks/useSelection';
import ProblemFilters from './components/ProblemFilters';
import ProblemTable from './components/ProblemTable';
import Pagination from './components/Pagination';
import './ProblemsManagement.css';

function ProblemsManagement() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    category: '',
    difficulty: '',
    source: '',
    search: ''
  });
  const [pagination, setPagination] = useState(null);
  const { selectedItems: selectedProblems, toggleItem, toggleAll, isAllSelected, setSelectedItems } = useSelection();

  useEffect(() => {
    fetchProblems();
  }, [filters]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '')
      );
      const response = await listProblems(cleanFilters);
      setProblems(response.problems);
      setPagination(response.pagination);
      setSelectedItems([]); // Clear selections when fetching new data
    } catch (error) {
      console.error('Failed to fetch problems:', error);
      alert('Failed to load problems');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await deleteProblem(id);
      alert('Problem deleted successfully');
      fetchProblems();
    } catch (error) {
      console.error('Failed to delete problem:', error);
      alert('Failed to delete problem');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProblems.length === 0) {
      alert('Please select problems to delete');
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedProblems.length} problem(s)? This action cannot be undone.`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await bulkDeleteProblems(selectedProblems);
      alert(`Successfully deleted ${selectedProblems.length} problem(s)`);
      fetchProblems();
    } catch (error) {
      console.error('Failed to delete problems:', error);
      alert('Failed to delete problems: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSelectAll = () => {
    toggleAll(problems);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="problems-management">
      <div className="header">
        <h1>Problem Management</h1>
        <div className="header-actions">
          {selectedProblems.length > 0 && (
            <button onClick={handleBulkDelete} className="btn-danger">
              Delete Selected ({selectedProblems.length})
            </button>
          )}
          <Link to="/admin/problems/new" className="btn-primary">
            Create New Problem
          </Link>
        </div>
      </div>

      <ProblemFilters filters={filters} onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="loading">Loading problems...</div>
      ) : (
        <>
          <ProblemTable
            problems={problems}
            selectedProblems={selectedProblems}
            onSelectAll={handleSelectAll}
            onSelectProblem={toggleItem}
            onDelete={handleDelete}
            isAllSelected={isAllSelected(problems)}
          />

          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
}

export default ProblemsManagement;
