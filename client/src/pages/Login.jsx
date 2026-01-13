import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/auth';
import { useUser } from '../contexts/UserContext';
import { FormCard, FormInput, FormButton, ErrorAlert } from '../components/forms';
import '../styles/authForms.css';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser(formData.email, formData.password);

      if (response.success) {
        // Set user in context
        setUser(response.user);

        // Login successful, redirect to practice page
        navigate('/practice');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setServerError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormCard
      title="Welcome Back"
      subtitle="Login to continue practicing math"
    >
      <ErrorAlert message={serverError} />

      <form onSubmit={handleSubmit} className="auth-form">
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isLoading}
          autoComplete="email"
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          disabled={isLoading}
          autoComplete="current-password"
        />

        <FormButton isLoading={isLoading} loadingText="Logging in...">
          Login
        </FormButton>
      </form>

      <p className="auth-link-text">
        Don't have an account?{' '}
        <Link to="/register" className="auth-link">Sign up here</Link>
      </p>
    </FormCard>
  );
};

export default Login;
