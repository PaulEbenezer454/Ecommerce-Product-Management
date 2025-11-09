import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getUserStats, getProducts, getOrders } from '../services/api';

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get products count
      const productsResponse = await getProducts();
      const products = productsResponse.products || [];

      // Get orders
      const ordersResponse = await getOrders();
      const orders = ordersResponse.orders || [];

      // Calculate stats
      const totalProducts = products.length;
      const activeOrders = orders.filter(order => order.status !== 'completed').length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

      setStats({
        totalProducts,
        activeOrders,
        totalRevenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      onLogout();
      navigate('/login');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>

      <div className="user-info-card">
        <h2>Welcome, {user.name}! 👋</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Username</span>
            <span className="info-value">@{user.username}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Member Since</span>
            <span className="info-value">{formatDate(user.createdAt || user.created_at)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Role</span>
            <span className="info-value">
              <span className="verification-badge verified">
                {user.role === 'admin' ? '👑 Admin' : '👤 User'}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Manage Products
        </button>
        <button onClick={() => navigate('/shop')} className="btn btn-primary">
          Shop Products
        </button>
        <button onClick={() => navigate('/orders')} className="btn btn-secondary">
          View Orders
        </button>
        <button onClick={() => navigate('/account-settings')} className="btn btn-secondary">
          Account Settings
        </button>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '16px', color: '#333' }}>Quick Stats</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Total Products</span>
            <span className="info-value" style={{ fontSize: '24px', color: '#667eea' }}>{stats.totalProducts}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Active Orders</span>
            <span className="info-value" style={{ fontSize: '24px', color: '#667eea' }}>{stats.activeOrders}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Total Revenue</span>
            <span className="info-value" style={{ fontSize: '24px', color: '#667eea' }}>${stats.totalRevenue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;