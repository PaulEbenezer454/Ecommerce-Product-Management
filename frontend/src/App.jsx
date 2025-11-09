import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Orders from './components/Orders';
import AccountSettings from './components/AccountSettings';
import Cart from './components/Cart';
import Shop from './components/Shop';
import { CartProvider } from './context/CartContext';
import api from './services/api';
import './App.css';
import './styles/navigation.css';
import './styles/animations.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Clear any existing user state first
        if (!token) {
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        // Validate the token by making a request to getCurrentUser
        const response = await api.get('/auth/me');
        
        if (!isMounted) return;

        if (response.data && response.data.user) {
          setUser(response.data.user);
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    // Add interceptor for 401 responses
    const interceptor = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setUser(null);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      isMounted = false;
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // Call logout endpoint to invalidate token
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <CartProvider>
        <div className="app">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={
              !user ? <Login onLogin={setUser} /> : <Navigate to="/dashboard" replace />
            } />
            
            <Route path="/register" element={
              !user ? <Register /> : <Navigate to="/dashboard" replace />
            } />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              user ? (
                <Dashboard 
                  user={{
                    ...user,
                    createdAt: user.createdAt || user.created_at || new Date().toISOString()
                  }} 
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" state={{ from: '/dashboard' }} replace />
              )
            } />

            <Route path="/products" element={
              user ? <Products user={user} /> : <Navigate to="/login" state={{ from: '/products' }} replace />
            } />

            <Route path="/orders" element={
              user ? <Orders onLogout={handleLogout} /> : <Navigate to="/login" state={{ from: '/orders' }} replace />
            } />

            <Route path="/shop" element={
              user ? <Shop onLogout={handleLogout} /> : <Navigate to="/login" state={{ from: '/shop' }} replace />
            } />

            <Route path="/cart" element={
              user ? <Cart /> : <Navigate to="/login" state={{ from: '/cart' }} replace />
            } />

            <Route path="/account-settings" element={
              user ? (
                <AccountSettings user={user} onUpdateUser={setUser} />
              ) : (
                <Navigate to="/login" state={{ from: '/account-settings' }} replace />
              )
            } />

            {/* Root and catch-all routes */}
            <Route path="/" element={
              user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;