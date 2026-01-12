import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function ProblemTable({
  problems,
  selectedProblems,
  onSelectAll,
  onSelectProblem,
  onDelete,
  isAllSelected
}) {
  return (
    <div className="table-container">
      <table className="problems-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={onSelectAll}
                checked={isAllSelected}
              />
            </th>
            <th>Title</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Difficulty</th>
            <th>Source</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {problems.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>
                No problems found
              </td>
            </tr>
          ) : (
            problems.map((problem) => (
              <tr key={problem._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedProblems.includes(problem._id)}
                    onChange={() => onSelectProblem(problem._id)}
                  />
                </td>
                <td>{problem.title}</td>
                <td>{problem.category}</td>
                <td>{problem.subcategory}</td>
                <td>{problem.difficulty}</td>
                <td>
                  <span className={`badge badge-${problem.source}`}>
                    {problem.source}
                  </span>
                </td>
                <td className="actions">
                  <Link
                    to={`/admin/problems/${problem._id}/edit`}
                    className="btn-sm btn-edit"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete(problem._id, problem.title)}
                    className="btn-sm btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

ProblemTable.propTypes = {
  problems: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      subcategory: PropTypes.string.isRequired,
      difficulty: PropTypes.string.isRequired,
      source: PropTypes.string.isRequired
    })
  ).isRequired,
  selectedProblems: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectAll: PropTypes.func.isRequired,
  onSelectProblem: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isAllSelected: PropTypes.bool.isRequired
};

export default ProblemTable;
