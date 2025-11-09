
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';
import { validateEmail } from '../utils/validation';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await forgotPassword(email);
      setSuccess(true);
      setEmail('');
    } catch (error) {
      console.error('Forgot password error:', error);
      setError(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Forgot Password?</h1>
        <p>Enter your email to receive a password reset link</p>
      </div>

      {success && (
        <div className="alert alert-success">
          Password reset email sent! Please check your email (and backend console).
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            className={error ? 'error' : ''}
            placeholder="Enter your registered email"
            autoComplete="email"
          />
          {error && (
            <span className="error-message">{error}</span>
          )}
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="back-to-login">
        <Link to="/login">← Back to Login</Link>
      </div>
    </div>
  );
}

export default ForgotPassword;