import { useState } from 'react';

/**
 * Custom hook for managing pagination state
 * @param {number} initialPage - Initial page number (default: 1)
 * @param {number} initialLimit - Initial items per page (default: 20)
 * @returns {Object} Pagination state and handlers
 */
function usePagination(initialPage = 1, initialLimit = 20) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const goToPage = (newPage) => {
    setPage(newPage);
  };

  const nextPage = () => {
    setPage(prev => prev + 1);
  };

  const previousPage = () => {
    setPage(prev => Math.max(1, prev - 1));
  };

  const resetPage = () => {
    setPage(1);
  };

  const changeLimit = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to page 1 when changing limit
  };

  return {
    page,
    limit,
    goToPage,
    nextPage,
    previousPage,
    resetPage,
    changeLimit,
    setPage
  };
}

export default usePagination;
