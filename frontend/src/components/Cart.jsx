import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';

function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const handleQuantityChange = (productId, newQuantity) => {
    const item = cart.find(item => item.product._id === productId);
    if (newQuantity > item.product.stock) {
      setError(`Only ${item.product.stock} units available`);
      return;
    }
    updateQuantity(productId, newQuantity);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const orderData = {
        items: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        shippingAddress
      };

      const response = await createOrder(orderData);
      if (response.success) {
        clearCart();
        navigate('/orders');
      }
    } catch (error) {
      setError(error.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {error && <div className="alert alert-error">{error}</div>}
      
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.product._id} className="cart-item">
            <img src={item.product.imageUrl} alt={item.product.name} />
            <div className="item-details">
              <h3>{item.product.name}</h3>
              <p>Price: ${item.product.price.toFixed(2)}</p>
              <div className="quantity-controls">
                <button 
                  onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >-</button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock}
                >+</button>
              </div>
              <button 
                onClick={() => removeFromCart(item.product._id)}
                className="btn-remove"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Order Summary</h3>
        <p>Total: ${getTotal().toFixed(2)}</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="shipping-form">
        <h3>Shipping Address</h3>
        <div className="form-group">
          <label htmlFor="street">Street Address</label>
          <input
            type="text"
            id="street"
            name="street"
            value={shippingAddress.street}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={shippingAddress.city}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={shippingAddress.state}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="zipCode">ZIP Code</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={shippingAddress.zipCode}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={shippingAddress.country}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/products')} 
            className="btn btn-secondary"
          >
            Continue Shopping
          </button>
        </div>
      </form>
    </div>
  );
}

export default Cart;