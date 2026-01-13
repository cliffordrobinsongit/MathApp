/**
 * useProblemForm Hook
 *
 * Manages form state and handlers for problem create/edit forms.
 * Includes logic for alternate answers management.
 */

import { useState } from 'react';

const defaultFormData = {
  title: '',
  category: '',
  subcategory: '',
  difficulty: '',
  problemText: '',
  answerFormat: 'number',
  correctAnswer: '',
  alternateAnswers: [''],
  preGenerateHints: true
};

export const useProblemForm = (initialData = null) => {
  const [formData, setFormData] = useState(initialData || defaultFormData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAlternateAnswerChange = (index, value) => {
    const newAlternates = [...formData.alternateAnswers];
    newAlternates[index] = value;
    setFormData(prev => ({ ...prev, alternateAnswers: newAlternates }));
  };

  const addAlternateAnswer = () => {
    setFormData(prev => ({
      ...prev,
      alternateAnswers: [...prev.alternateAnswers, '']
    }));
  };

  const removeAlternateAnswer = (index) => {
    setFormData(prev => ({
      ...prev,
      alternateAnswers: prev.alternateAnswers.filter((_, i) => i !== index)
    }));
  };

  const cleanFormData = () => {
    return {
      ...formData,
      alternateAnswers: formData.alternateAnswers.filter(a => a.trim() !== '')
    };
  };

  const resetForm = () => {
    setFormData(initialData || defaultFormData);
  };

  return {
    formData,
    handleChange,
    handleAlternateAnswerChange,
    addAlternateAnswer,
    removeAlternateAnswer,
    cleanFormData,
    resetForm,
    setFormData
  };
};
