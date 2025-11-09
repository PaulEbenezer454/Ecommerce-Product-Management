import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getShopProducts, logout } from '../services/api';

function Shop({ onLogout }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setError(null);
      const response = await getShopProducts();
      console.log('Shop products response:', response);
      if (response.success && Array.isArray(response.products)) {
        setProducts(response.products);
      } else {
        setError('Invalid response from server');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error loading shop products:', error);
      setError(error.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      onLogout();
      navigate('/login');
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    navigate('/cart');
  };

  const categories = ['all', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Food & Beverages', 'Health & Beauty', 'Automotive', 'Other'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="main-layout">
      <nav className="sidebar">
        <div className="logo">
          <h1>E-Shop</h1>
        </div>
        <div className="nav-links">
          <button onClick={() => navigate('/dashboard')} className="nav-link">
            <i className="nav-icon">📊</i>
            <span>Dashboard</span>
          </button>
          <button onClick={() => navigate('/cart')} className="nav-link active">
            <i className="nav-icon">🛒</i>
            <span>Cart</span>
          </button>
          <button onClick={handleLogout} className="nav-link">
            <i className="nav-icon">🚪</i>
            <span>Logout</span>
          </button>
        </div>
      </nav>
      
      <main className="main-content">
        <header className="top-header">
          <div className="header-content">
            <div className="header-title">
              <h1>Shop Products</h1>
              <p className="header-subtitle">Discover amazing products from our sellers</p>
            </div>
            <div className="filters-wrapper">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <i className="search-icon">🔍</i>
              </div>
              <div className="filters-group">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="category-select"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={() => navigate('/cart')} className="btn btn-primary">
              <i className="cart-icon">�</i>
              <span>View Cart</span>
            </button>
          </div>
        </header>

      {error && (
        <div className="error-banner">
          <i className="error-icon">⚠️</i>
          {error}
        </div>
      )}

        <div className="content-container">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">
              <div className="empty-state">
                <img src="https://via.placeholder.com/150?text=Empty" alt="No products" />
                <h2>No Products Found</h2>
                <p>{searchTerm || selectedCategory !== 'all' ? 
                  'Try adjusting your search or filter criteria.' : 
                  'There are currently no products available in the shop.'}
                </p>
              </div>
            </div>
          ) : (
            <section className="products-section">
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <article key={product._id} className="product-card">
                    <div className="product-image-wrapper">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="product-image"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'}
                      />
                    </div>
                    <div className="product-info">
                      <div>
                        <h3>{product.name}</h3>
                        <p className="product-description">{product.description}</p>
                        <div className="seller-info">
                          <i className="seller-icon">👤</i> 
                          <span>{product.user.name}</span>
                        </div>
                      </div>
                      <div className="product-meta">
                        <div className="product-details">
                          <span className="product-price">${product.price.toFixed(2)}</span>
                          <span className={`product-stock ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </span>
                        </div>
                        <div className="product-actions">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`btn ${product.stock === 0 ? 'btn-disabled' : 'btn-primary'}`}
                            disabled={product.stock === 0}
                          >
                            {product.stock === 0 ? 'Out of Stock' : (
                              <>
                                <i className="cart-icon">🛒</i>
                                Add to Cart
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default Shop;