/**
 * useTags Hook
 *
 * Fetches and manages tag configurations (categories, subcategories, difficulties).
 * Shared between CreateProblem and EditProblem forms.
 */

import { useState, useEffect } from 'react';
import { getTags } from '../services/admin';

export const useTags = () => {
  const [tags, setTags] = useState({
    categories: [],
    subcategories: [],
    difficulties: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
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
      setError(null);
    } catch (err) {
      console.error('Failed to fetch tags:', err);
      setError('Failed to load tag options');
    } finally {
      setLoading(false);
    }
  };

  return { tags, loading, error, refetch: fetchTags };
};
