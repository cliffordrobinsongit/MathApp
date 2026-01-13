import api from './api';

// Token management
const TOKEN_KEY = 'authToken';

/**
 * Save authentication token to localStorage
 */
export const saveToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('Error saving token:', error);
    return false;
  }
};

/**
 * Get authentication token from localStorage
 */
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Clear authentication token from localStorage
 */
export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing token:', error);
    return false;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

/**
 * Register a new user
 * @param {string} username - User's username
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Response with token and user data
 */
export const registerUser = async (username, email, password) => {
  try {
    const response = await api.post('/api/auth/register', {
      username,
      email,
      password
    });

    // Save token if registration successful
    if (response.success && response.token) {
      saveToken(response.token);
    }

    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Login user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Response with token and user data
 */
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', {
      email,
      password
    });

    // Save token if login successful
    if (response.success && response.token) {
      saveToken(response.token);
    }

    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 */
export const logoutUser = () => {
  clearToken();
  window.location.href = '/login';
};

/**
 * Get current user data
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/auth/me');
    return response;
  } catch (error) {
    throw error;
  }
};
