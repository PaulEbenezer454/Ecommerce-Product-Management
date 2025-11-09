import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { name, email, username, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!name || !email || !username || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        username,
        password,
      });

      console.log('Registration response:', response.data);

      if (response.data.success) {
        // Store token
        localStorage.setItem('token', response.data.token);
        
        // Store user data
        localStorage.setItem('user', JSON.stringify(response.data.user));

        setSuccess('Registration successful! Redirecting to dashboard...');

        // Reload the page to let App.jsx pick up the new user state
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors
          .map((e) => e.msg)
          .join(', ');
        setError(errorMessages);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join us today</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <i className="alert-icon">⚠️</i>
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            <i className="alert-icon">✓</i>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-group">
              <i className="input-icon">👤</i>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={loading}
                className="input-with-icon"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-group">
              <i className="input-icon">✉️</i>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={loading}
                className="input-with-icon"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-group">
              <i className="input-icon">🏷️</i>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={handleChange}
                placeholder="Choose a username"
                disabled={loading}
                className="input-with-icon"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-group">
              <i className="input-icon">🔒</i>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Create a password (min 6 characters)"
                disabled={loading}
                className="input-with-icon"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-group">
              <i className="input-icon">🔒</i>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                disabled={loading}
                className="input-with-icon"
              />
            </div>
            {password && confirmPassword && (
              <div className={`validation-message ${password === confirmPassword ? 'success-message' : 'error-message'}`}>
                {password === confirmPassword ? '✓ Passwords match' : '⚠️ Passwords do not match'}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <i className="btn-icon">✨</i>
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account?</p>
          <Link to="/login" className="btn btn-secondary">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;