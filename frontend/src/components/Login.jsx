import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!login || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        login,
        password,
      });

      console.log('Login response:', response.data);

      if (response.data.token) {
        // Store only the token
        localStorage.setItem('token', response.data.token);

        console.log('Login successful, getting user data...');
        
        // Get user data from /me endpoint
        const userResponse = await api.get('/auth/me', {
          headers: {
            'Authorization': `Bearer ${response.data.token}`
          }
        });

        if (userResponse.data && userResponse.data.user) {
          // Update user state and navigate to dashboard
          if (onLogin) {
            onLogin(userResponse.data.user);
          }
          console.log('Redirecting to dashboard...');
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to access your dashboard</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <i className="alert-icon">⚠️</i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login">Username or Email</label>
            <div className="input-group">
              <i className="input-icon">👤</i>
              <input
                type="text"
                id="login"
                name="login"
                value={login}
                onChange={handleChange}
                placeholder="Enter your username or email"
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
                placeholder="Enter your password"
                disabled={loading}
                className="input-with-icon"
              />
            </div>
          </div>

          <div className="forgot-password-link">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button 
            type="submit" 
            className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <i className="btn-icon">→</i>
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account?</p>
          <Link to="/register" className="btn btn-secondary">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;