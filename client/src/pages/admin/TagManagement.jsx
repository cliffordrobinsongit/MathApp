import { useState, useEffect } from 'react';
import { getTags, addTag, deleteTag } from '../../services/admin';
import './TagManagement.css';

function TagManagement() {
  const [tags, setTags] = useState({
    categories: [],
    subcategories: [],
    difficulties: []
  });
  const [newValues, setNewValues] = useState({
    categories: '',
    subcategories: '',
    difficulties: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllTags();
  }, []);

  const fetchAllTags = async () => {
    try {
      setLoading(true);
      const [cats, subs, diffs] = await Promise.all([
        getTags('categories'),
        getTags('subcategories'),
        getTags('difficulties')
      ]);
      setTags({
        categories: cats.values,
        subcategories: subs.values,
        difficulties: diffs.values
      });
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      alert('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (configType) => {
    const value = newValues[configType].trim();
    if (!value) {
      alert('Please enter a value');
      return;
    }

    try {
      await addTag(configType, value);
      setNewValues({ ...newValues, [configType]: '' });
      fetchAllTags();
      alert(`Added "${value}" to ${configType}`);
    } catch (error) {
      console.error('Failed to add tag:', error);
      alert('Failed to add tag: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDelete = async (configType, value) => {
    if (!window.confirm(`Delete "${value}" from ${configType}?\n\nNote: This will fail if any problems use this tag.`)) {
      return;
    }

    try {
      await deleteTag(configType, value);
      fetchAllTags();
      alert(`Deleted "${value}" from ${configType}`);
    } catch (error) {
      console.error('Failed to delete tag:', error);
      const message = error.message || error.response?.data?.message || 'Unknown error';
      alert('Failed to delete tag: ' + message);
    }
  };

  const renderSection = (configType, title, description) => (
    <div className="tag-section">
      <div className="section-header">
        <h2>{title}</h2>
        <p className="description">{description}</p>
      </div>

      <div className="tag-list">
        {tags[configType].length === 0 ? (
          <p className="empty-message">No {title.toLowerCase()} defined</p>
        ) : (
          tags[configType].map(value => (
            <div key={value} className="tag-item">
              <span className="tag-value">{value}</span>
              <button
                onClick={() => handleDelete(configType, value)}
                className="btn-delete-tag"
                title={`Delete ${value}`}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <div className="add-tag-form">
        <input
          type="text"
          placeholder={`New ${title.slice(0, -1).toLowerCase()}...`}
          value={newValues[configType]}
          onChange={(e) => setNewValues({ ...newValues, [configType]: e.target.value })}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd(configType)}
        />
        <button onClick={() => handleAdd(configType)} className="btn-add-tag">
          Add
        </button>
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading">Loading tags...</div>;
  }

  return (
    <div className="tag-management">
      <h1>Tag Management</h1>
      <p className="subtitle">
        Manage the available tags for categorizing math problems. These tags are used when creating and filtering problems.
      </p>

      <div className="sections">
        {renderSection(
          'categories',
          'Categories',
          'Main subject area (e.g., pre-algebra, algebra)'
        )}

        {renderSection(
          'subcategories',
          'Subcategories',
          'Specific problem types (e.g., one-step-equations, linear-equations)'
        )}

        {renderSection(
          'difficulties',
          'Difficulties',
          'Difficulty levels (e.g., pre-algebra, algebra-1, algebra-2)'
        )}
      </div>
    </div>
  );
}

export default TagManagement;
