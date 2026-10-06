import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from '../redux/cartSlice';
import { AuthContext } from '../context/AuthContext';
import {
  FaShoppingBag,
  FaTrashAlt,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaTag,
  FaMinus,
  FaPlus,
  FaCheck,
} from 'react-icons/fa';
import '../styles/cart.css';

const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 99;

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponFeedback, setCouponFeedback] = useState({ type: '', message: '' });

  // Calculate Subtotal and Item Count
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 1),
    0
  );

  const totalItemsCount = cartItems.reduce(
    (acc, item) => acc + (Number(item.qty) || 1),
    0
  );

  // Shipping Calculation
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = cartItems.length === 0 || isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  // Discount Calculation
  const discountAmount = discountPercent > 0 ? (subtotal * discountPercent) / 100 : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  // Quantity Handlers
  const handleIncreaseQty = (item) => {
    const currentQty = Number(item.qty) || 1;
    if (item.stock && currentQty >= item.stock) {
      return;
    }
    dispatch(addToCart({ ...item, qty: currentQty + 1 }));
  };

  const handleDecreaseQty = (item) => {
    const currentQty = Number(item.qty) || 1;
    if (currentQty > 1) {
      dispatch(addToCart({ ...item, qty: currentQty - 1 }));
    } else {
      dispatch(removeFromCart(item._id));
    }
  };

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to remove all items from your cart?')) {
      dispatch(clearCart());
      setDiscountPercent(0);
      setCouponFeedback({ type: '', message: '' });
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      setCouponFeedback({ type: 'error', message: 'Please enter a coupon code.' });
      return;
    }

    if (code === 'PRACHI10' || code === 'WELCOME10') {
      setDiscountPercent(10);
      setCouponFeedback({
        type: 'success',
        message: `Coupon "${code}" applied! You saved 10% on your order.`,
      });
    } else if (code === 'FESTIVE20') {
      setDiscountPercent(20);
      setCouponFeedback({
        type: 'success',
        message: `Coupon "${code}" applied! You saved 20% on your order.`,
      });
    } else {
      setDiscountPercent(0);
      setCouponFeedback({
        type: 'error',
        message: 'Invalid or expired coupon code.',
      });
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  // Empty State
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-page-container">
        <div className="cart-empty-container">
          <FaShoppingBag className="cart-empty-icon" />
          <h2 className="cart-empty-title">Your Cart is Empty</h2>
          <p className="cart-empty-text">
            Looks like you haven't added anything to your wardrobe yet. Explore our latest collections and find styles crafted for you.
          </p>
          <Link to="/shop" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
            <FaShoppingBag /> Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      {/* Header */}
      <div className="cart-header">
        <div className="cart-title-row">
          <h1 className="cart-title">Shopping Cart</h1>
          <span className="cart-badge-count">
            {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
          </span>
        </div>
        <Link to="/shop" className="btn-continue-shopping">
          <FaArrowLeft size={12} /> Continue Shopping
        </Link>
      </div>

      {/* Main Grid Layout */}
      <div className="cart-layout">
        {/* Left Column: Cart Items List */}
        <div className="cart-items-section">
          {cartItems.map((item) => {
            const itemPrice = Number(item.price) || 0;
            const itemQty = Number(item.qty) || 1;
            const itemTotal = itemPrice * itemQty;
            const isMaxStock = item.stock && itemQty >= item.stock;

            return (
              <div key={item._id} className="cart-item-card">
                {/* Image */}
                <div className="cart-item-image-wrap">
                  <Link to={`/product/${item._id}`}>
                    <img
                      src={item.imageUrl || 'https://placehold.co/200x200?text=No+Image'}
                      alt={item.name}
                      className="cart-item-image"
                    />
                  </Link>
                </div>

                {/* Info */}
                <div className="cart-item-details">
                  {item.category && (
                    <span className="cart-item-category">{item.category}</span>
                  )}
                  <h3 className="cart-item-name">
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </h3>
                  <span className="cart-item-unit-price">
                    ₹{itemPrice.toFixed(2)} each
                  </span>
                </div>

                {/* Quantity Stepper */}
                <div className="cart-item-stepper-wrap">
                  <div className="cart-stepper">
                    <button
                      type="button"
                      onClick={() => handleDecreaseQty(item)}
                      className="cart-stepper-btn"
                      title="Decrease quantity"
                      aria-label="Decrease quantity"
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="cart-stepper-qty">{itemQty}</span>
                    <button
                      type="button"
                      onClick={() => handleIncreaseQty(item)}
                      disabled={isMaxStock}
                      className="cart-stepper-btn"
                      title={isMaxStock ? 'Maximum stock reached' : 'Increase quantity'}
                      aria-label="Increase quantity"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
                </div>

                {/* Total & Remove */}
                <div className="cart-item-pricing">
                  <span className="cart-item-total">₹{itemTotal.toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(item._id)}
                    className="cart-btn-remove"
                    title="Remove item"
                    aria-label={`Remove ${item.name}`}
                  >
                    <FaTrashAlt size={12} /> Remove
                  </button>
                </div>
              </div>
            );
          })}

          {/* Bottom Actions */}
          <div className="cart-actions-bottom">
            <Link to="/shop" className="btn-continue-shopping">
              <FaArrowLeft size={13} /> Back to Shop
            </Link>
            <button
              type="button"
              onClick={handleClear}
              className="btn-clear-cart"
            >
              <FaTrash size={12} /> Clear Entire Cart
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <aside className="order-summary-card">
          <h2 className="summary-title">Order Summary</h2>

          {/* Free Shipping Progress Indicator */}
          <div className="summary-free-shipping-bar">
            {isFreeShipping ? (
              <span style={{ color: '#4ade80', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaCheck /> You have unlocked FREE Express Delivery!
              </span>
            ) : (
              <span>
                Add <strong>₹{amountNeededForFreeShipping.toFixed(2)}</strong> more for <strong>FREE Delivery</strong>
              </span>
            )}
            <div className="free-shipping-progress">
              <div
                className="free-shipping-progress-fill"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="summary-rows">
            <div className="summary-row">
              <span>Items Subtotal ({totalItemsCount})</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            {discountPercent > 0 && (
              <div className="summary-row" style={{ color: '#4ade80' }}>
                <span>Coupon Discount ({discountPercent}%)</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Shipping Fee</span>
              <span>
                {isFreeShipping ? (
                  <span style={{ color: '#4ade80', fontWeight: 600 }}>FREE</span>
                ) : (
                  `₹${shippingFee.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="summary-row">
              <span>Taxes & GST</span>
              <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Included in price</span>
            </div>

            <div className="summary-row total">
              <span>Grand Total</span>
              <span className="summary-total-amount">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Coupon / Promo Form */}
          <form onSubmit={handleApplyCoupon}>
            <div className="coupon-box">
              <input
                type="text"
                placeholder="Promo code (e.g. PRACHI10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="coupon-input"
              />
              <button type="submit" className="btn-apply-coupon">
                Apply
              </button>
            </div>
            {couponFeedback.message && (
              <p
                style={{
                  fontSize: '0.82rem',
                  marginTop: '8px',
                  color: couponFeedback.type === 'success' ? '#4ade80' : '#ef4444',
                }}
              >
                {couponFeedback.message}
              </p>
            )}
          </form>

          {/* Checkout Button */}
          <button
            type="button"
            onClick={handleCheckout}
            className="btn-checkout"
          >
            Proceed to Checkout <FaArrowRight size={14} />
          </button>

          {/* Trust Assurances */}
          <div className="summary-trust-badges">
            <div className="trust-item">
              <FaShieldAlt />
              <span>Safe & Secure 256-bit Encrypted Checkout</span>
            </div>
            <div className="trust-item">
              <FaUndo />
              <span>7-Day Hassle-Free Returns & Replacements</span>
            </div>
            <div className="trust-item">
              <FaTruck />
              <span>Fast Doorstep Delivery Across All Cities</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
