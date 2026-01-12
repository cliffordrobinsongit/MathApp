import PropTypes from 'prop-types';

function ProblemFilters({ filters, onFilterChange }) {
  const handleChange = (key, value) => {
    onFilterChange(key, value);
  };

  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search problems..."
        value={filters.search}
        onChange={(e) => handleChange('search', e.target.value)}
        className="filter-input"
      />

      <select
        value={filters.category}
        onChange={(e) => handleChange('category', e.target.value)}
        className="filter-select"
      >
        <option value="">All Categories</option>
        <option value="pre-algebra">Pre-Algebra</option>
        <option value="algebra">Algebra</option>
      </select>

      <select
        value={filters.difficulty}
        onChange={(e) => handleChange('difficulty', e.target.value)}
        className="filter-select"
      >
        <option value="">All Difficulties</option>
        <option value="pre-algebra">Pre-Algebra</option>
        <option value="algebra-1">Algebra 1</option>
        <option value="algebra-2">Algebra 2</option>
      </select>

      <select
        value={filters.source}
        onChange={(e) => handleChange('source', e.target.value)}
        className="filter-select"
      >
        <option value="">All Sources</option>
        <option value="seed">Seeded</option>
        <option value="admin-manual">Admin Created</option>
        <option value="admin-generated">AI Generated</option>
      </select>
    </div>
  );
}

ProblemFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    category: PropTypes.string,
    difficulty: PropTypes.string,
    source: PropTypes.string
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired
};

export default ProblemFilters;
