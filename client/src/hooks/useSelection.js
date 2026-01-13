import { useState } from 'react';

/**
 * Custom hook for managing multi-select state
 * @returns {Object} Selection state and handlers
 */
function useSelection() {
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleItem = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const selectAll = (items) => {
    setSelectedItems(items.map(item => item._id || item.id || item));
  };

  const deselectAll = () => {
    setSelectedItems([]);
  };

  const toggleAll = (items) => {
    if (selectedItems.length === items.length) {
      deselectAll();
    } else {
      selectAll(items);
    }
  };

  const isSelected = (itemId) => {
    return selectedItems.includes(itemId);
  };

  const isAllSelected = (items) => {
    return items.length > 0 && selectedItems.length === items.length;
  };

  return {
    selectedItems,
    toggleItem,
    selectAll,
    deselectAll,
    toggleAll,
    isSelected,
    isAllSelected,
    setSelectedItems
  };
}

export default useSelection;
