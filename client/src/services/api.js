import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Request interceptor - attach JWT token to all requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');

    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle common response scenarios
api.interceptors.response.use(
  (response) => {
    // Return the response data directly
    return response.data;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('authToken');
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = '/login';
          }
          break;

        case 403:
          console.error('Access forbidden:', data.message);
          break;

        case 404:
          console.error('Resource not found:', data.message);
          break;

        case 500:
          console.error('Server error:', data.message);
          break;

        default:
          console.error('Error:', data.message);
      }

      // Return error with message
      return Promise.reject({
        message: data.message || 'An error occurred',
        status,
        data
      });
    } else if (error.request) {
      // Request made but no response received
      console.error('No response from server');
      return Promise.reject({
        message: 'Unable to connect to server. Please check your internet connection.',
        status: null
      });
    } else {
      // Something else happened
      console.error('Request setup error:', error.message);
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        status: null
      });
    }
  }
);

export default api;
