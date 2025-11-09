import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile, changePassword } from '../services/api';

function AccountSettings({ user, onUpdateUser }) {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    username: user.username
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUserProfile(profileData);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      if (onUpdateUser) {
        onUpdateUser(response.user);
      }
    } catch (error) {
      setMessage({ text: error.message || 'Error updating profile', type: 'error' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'error' });
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ text: 'Password changed successfully!', type: 'success' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage({ text: error.message || 'Error changing password', type: 'error' });
    }
  };

  return (
    <div className="account-settings-container">
      <div className="settings-header">
        <h1>Account Settings</h1>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
          Back to Dashboard
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="settings-section">
        <h2>Profile Information</h2>
        <form onSubmit={handleProfileSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={profileData.username}
              onChange={handleProfileChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Update Profile
          </button>
        </form>
      </div>

      <div className="settings-section">
        <h2>Change Password</h2>
        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default AccountSettings;