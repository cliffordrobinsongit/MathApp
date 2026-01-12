import PropTypes from 'prop-types';

function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.pages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(pagination.page - 1)}
        disabled={pagination.page === 1}
        className="btn-pagination"
      >
        Previous
      </button>
      <span className="pagination-info">
        Page {pagination.page} of {pagination.pages} ({pagination.total} total)
      </span>
      <button
        onClick={() => onPageChange(pagination.page + 1)}
        disabled={pagination.page === pagination.pages}
        className="btn-pagination"
      >
        Next
      </button>
    </div>
  );
}

Pagination.propTypes = {
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
  }),
  onPageChange: PropTypes.func.isRequired
};

export default Pagination;
