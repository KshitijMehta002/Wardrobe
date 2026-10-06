import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { AuthContext } from '../context/AuthContext';
import {
  FaShieldAlt,
  FaTruck,
  FaUndoAlt,
  FaLock,
  FaCheckCircle,
  FaArrowLeft,
  FaCreditCard,
  FaMoneyBillWave,
  FaTag,
  FaShoppingBag,
  FaReceipt,
  FaExclamationCircle,
  FaCopy,
  FaCheck,
  FaMapMarkerAlt,
  FaBoxOpen,
} from 'react-icons/fa';
import '../styles/checkout.css';

const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 99;

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  // Shipping details state
  const [formData, setFormData] = useState({
    fullname: user?.name || '',
    email: user?.email || '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const [formErrors, setFormErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponFeedback, setCouponFeedback] = useState({ type: '', message: '' });

  // Processing & Success states
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  // Sync user info if user logs in or updates
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullname: prev.fullname || user.name || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  // Load Razorpay Script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Price calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 1),
    0
  );

  const isEligibleForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = isEligibleForFreeShipping ? 0 : STANDARD_SHIPPING_FEE;

  const discountAmount = discountPercent > 0 ? Math.round((subtotal * discountPercent) / 100) : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.fullname.trim()) errors.fullname = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9+ -]{7,15}$/.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (!formData.street.trim()) errors.street = 'Street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.postalCode.trim()) errors.postalCode = 'Postal / PIN code is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Coupon handling
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponFeedback({ type: 'error', message: 'Enter a coupon code.' });
      return;
    }

    if (code === 'PRACHI10' || code === 'WELCOME10') {
      setDiscountPercent(10);
      setAppliedCoupon(code);
      setCouponFeedback({ type: 'success', message: `${code} applied! 10% OFF saved.` });
    } else if (code === 'FESTIVE20') {
      setDiscountPercent(20);
      setAppliedCoupon(code);
      setCouponFeedback({ type: 'success', message: `${code} applied! 20% OFF saved.` });
    } else {
      setCouponFeedback({ type: 'error', message: 'Invalid or expired code.' });
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountPercent(0);
    setAppliedCoupon('');
    setCouponCode('');
    setCouponFeedback({ type: '', message: '' });
  };

  // Submit Order to backend
  const submitOrderToBackend = async (paymentId) => {
    const orderPayload = {
      items: cartItems.map((item) => ({
        productId: item.productId || item._id,
        qty: Number(item.qty) || 1,
        price: Number(item.price) || 0,
      })),
      totalAmount: grandTotal.toString(),
      address: {
        fullname: formData.fullname.trim(),
        street: formData.apartment
          ? `${formData.street.trim()}, Apt/Suite: ${formData.apartment.trim()}`
          : formData.street.trim(),
        city: formData.city.trim(),
        postalCode: formData.postalCode.trim(),
        country: formData.country.trim() || 'India',
      },
      paymentId: String(paymentId),
    };

    const token = user?.token;
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to place order in database');
    }

    // Clear cart and display confirmation
    dispatch(clearCart());
    setOrderSuccess(data.order || { ...orderPayload, _id: 'ORD-' + Date.now() });
    setLoading(false);
  };

  // Primary Checkout Handler
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorBanner('');

    if (!user) {
      setErrorBanner('Please sign in to place your order so we can track and confirm it for you.');
      navigate('/login?redirect=checkout');
      return;
    }

    if (!validateForm()) {
      setErrorBanner('Please fill in all required shipping and contact details.');
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === 'cod') {
        // Cash on Delivery flow
        const codPaymentId = `COD-${Date.now().toString().slice(-6)}`;
        await submitOrderToBackend(codPaymentId);
      } else {
        // Razorpay Online Payment Flow
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error('Failed to load Razorpay payment gateway. Please check your internet connection or choose Cash on Delivery.');
        }

        // Fetch Razorpay public key
        let rzpKey = 'rzp_test_TW2YAuv3Z22HYe';
        try {
          const keyRes = await fetch('/api/payments/key');
          const keyData = await keyRes.json();
          if (keyData?.key) rzpKey = keyData.key;
        } catch (err) {
          console.warn('Could not fetch dynamic Razorpay key, using default.', err);
        }

        // Create Razorpay Order on server
        const rzpOrderRes = await fetch('/api/payments/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: grandTotal }),
        });

        if (!rzpOrderRes.ok) {
          throw new Error('Failed to create Razorpay checkout session.');
        }

        const rzpOrder = await rzpOrderRes.json();

        // Open Razorpay modal
        const options = {
          key: rzpKey,
          amount: rzpOrder.amount,
          currency: 'INR',
          name: 'Prachi Wardrobe',
          description: `Order Checkout - ${cartItems.length} item(s)`,
          image: '/logo.png',
          order_id: rzpOrder.id,
          handler: async (response) => {
            try {
              // Verify payment on server
              const verifyRes = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(response),
              });
              const verifyData = await verifyRes.json();

              if (!verifyRes.ok) {
                throw new Error(verifyData.message || 'Payment verification failed.');
              }

              // Save order with verified Razorpay payment ID
              await submitOrderToBackend(response.razorpay_payment_id);
            } catch (err) {
              setErrorBanner(err.message || 'Payment verification failed. Please contact support.');
              setLoading(false);
            }
          },
          prefill: {
            name: formData.fullname,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#d6a05a',
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
            },
          },
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.on('payment.failed', function (response) {
          setErrorBanner(response.error?.description || 'Payment was declined or cancelled.');
          setLoading(false);
        });

        razorpayInstance.open();
      }
    } catch (err) {
      console.error(err);
      setErrorBanner(err.message || 'An unexpected error occurred while initiating payment.');
      setLoading(false);
    }
  };

  const copyOrderIdToClipboard = (orderId) => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2500);
  };

  // SUCCESS SCREEN
  if (orderSuccess) {
    return (
      <div className="checkout-page-container">
        <div className="order-success-container">
          <div className="order-success-icon-wrap">
            <FaCheckCircle />
          </div>
          <h1 className="order-success-title">Order Confirmed!</h1>
          <p className="order-success-sub">
            Thank you for shopping with Prachi Wardrobe. A confirmation email with receipt details has been sent to <strong>{formData.email}</strong>.
          </p>

          <div
            className="order-success-id-pill"
            style={{ cursor: 'pointer' }}
            title="Click to copy Order ID"
            onClick={() => copyOrderIdToClipboard(orderSuccess._id)}
          >
            <span>Order ID: <strong>{orderSuccess._id}</strong></span>
            {copiedOrderId ? <FaCheck style={{ color: '#22c55e' }} /> : <FaCopy />}
          </div>

          <div className="order-success-details-grid">
            <div className="order-detail-block">
              <span className="order-detail-title">Payment Method</span>
              <span className="order-detail-value">
                {paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Razorpay Secure (Paid)'}
              </span>
            </div>
            <div className="order-detail-block">
              <span className="order-detail-title">Delivery Status</span>
              <span className="order-detail-value" style={{ color: '#22c55e' }}>
                Pending / Processing
              </span>
            </div>
            <div className="order-detail-block">
              <span className="order-detail-title">Estimated Delivery</span>
              <span className="order-detail-value">3 - 5 Business Days</span>
            </div>
            <div className="order-detail-block">
              <span className="order-detail-title">Total Amount</span>
              <span className="order-detail-value" style={{ color: 'var(--accent, #d6a05a)' }}>
                ₹{grandTotal.toLocaleString()}
              </span>
            </div>
            <div className="order-detail-block" style={{ gridColumn: '1 / -1' }}>
              <span className="order-detail-title">Shipping Address</span>
              <span className="order-detail-value">
                {formData.fullname} • {formData.street}
                {formData.apartment ? `, ${formData.apartment}` : ''}, {formData.city}, {formData.state} - {formData.postalCode}, {formData.country}
              </span>
            </div>
          </div>

          <div className="order-success-actions">
            <Link to="/shop" className="btn-order-action primary">
              <FaShoppingBag /> Continue Shopping
            </Link>
            <button
              onClick={() => window.print()}
              className="btn-order-action secondary"
            >
              <FaReceipt /> Print Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART GUARD
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="checkout-page-container">
        <div className="checkout-card" style={{ maxWidth: 580, margin: '60px auto', textAlign: 'center', padding: '50px 24px' }}>
          <FaBoxOpen style={{ fontSize: '3.5rem', color: 'var(--text-muted, #71717a)', marginBottom: 16 }} />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-secondary, #a1a1aa)', marginBottom: 24 }}>
            You don't have any items to checkout yet. Explore our designer styles and add items to your wardrobe.
          </p>
          <Link to="/shop" className="checkout-btn-submit" style={{ display: 'inline-flex', width: 'auto', padding: '12px 28px' }}>
            <FaShoppingBag /> Browse Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-container">
      {/* Checkout Steps Header */}
      <div className="checkout-steps-bar">
        <Link to="/cart" className="checkout-step-item completed">
          <span className="checkout-step-num"><FaCheck style={{ fontSize: '0.7rem' }} /></span>
          <span>Shopping Cart</span>
        </Link>
        <div className="checkout-step-divider active" />
        <div className="checkout-step-item active">
          <span className="checkout-step-num">2</span>
          <span>Shipping & Details</span>
        </div>
        <div className="checkout-step-divider active" />
        <div className="checkout-step-item active">
          <span className="checkout-step-num">3</span>
          <span>Payment</span>
        </div>
        <div className="checkout-step-divider" />
        <div className="checkout-step-item">
          <span className="checkout-step-num">4</span>
          <span>Confirmation</span>
        </div>
      </div>

      {/* Navigation Return Link */}
      <div style={{ marginBottom: 20 }}>
        <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
          <FaArrowLeft /> Return to Cart
        </Link>
      </div>

      {/* Global Alert Notification */}
      {errorBanner && (
        <div className="checkout-alert-box error">
          <FaExclamationCircle style={{ flexShrink: 0 }} />
          <span>{errorBanner}</span>
        </div>
      )}

      {/* Layout Grid */}
      <div className="checkout-layout">
        {/* Left Column: Forms */}
        <div className="checkout-main-section">
          {/* Guest Reminder if not logged in */}
          {!user && (
            <div className="checkout-guest-banner">
              <p>
                <strong>Already have an account?</strong> Sign in for instant autofill and order history tracking.
              </p>
              <Link to="/login?redirect=checkout" className="checkout-btn-login-quick">
                Sign In
              </Link>
            </div>
          )}

          {/* Contact Information */}
          <div className="checkout-card">
            <div className="checkout-card-header">
              <h2 className="checkout-card-title">
                <FaLock /> Contact Information
              </h2>
              {user && (
                <span style={{ fontSize: '0.82rem', color: '#22c55e', fontWeight: 600 }}>
                  ✓ Logged in as {user.name}
                </span>
              )}
            </div>

            <div className="checkout-form-grid">
              <div className="checkout-form-group">
                <label className="checkout-label">
                  Full Name <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  name="fullname"
                  className={`checkout-input ${formErrors.fullname ? 'error' : ''}`}
                  placeholder="e.g. Aditi Sharma"
                  value={formData.fullname}
                  onChange={handleInputChange}
                />
                {formErrors.fullname && <span className="checkout-error-text">{formErrors.fullname}</span>}
              </div>

              <div className="checkout-form-group">
                <label className="checkout-label">
                  Email Address <span className="required-star">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className={`checkout-input ${formErrors.email ? 'error' : ''}`}
                  placeholder="aditi@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {formErrors.email && <span className="checkout-error-text">{formErrors.email}</span>}
              </div>

              <div className="checkout-form-group full-width">
                <label className="checkout-label">
                  Phone Number (for courier updates) <span className="required-star">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  className={`checkout-input ${formErrors.phone ? 'error' : ''}`}
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {formErrors.phone && <span className="checkout-error-text">{formErrors.phone}</span>}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="checkout-card">
            <div className="checkout-card-header">
              <h2 className="checkout-card-title">
                <FaMapMarkerAlt /> Shipping Address
              </h2>
            </div>

            <div className="checkout-form-grid">
              <div className="checkout-form-group full-width">
                <label className="checkout-label">
                  Street Address & House / Flat No. <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  name="street"
                  className={`checkout-input ${formErrors.street ? 'error' : ''}`}
                  placeholder="Flat 402, Lotus Orchid, MG Road"
                  value={formData.street}
                  onChange={handleInputChange}
                />
                {formErrors.street && <span className="checkout-error-text">{formErrors.street}</span>}
              </div>

              <div className="checkout-form-group full-width">
                <label className="checkout-label">
                  Apartment, Landmark, Suite (Optional)
                </label>
                <input
                  type="text"
                  name="apartment"
                  className="checkout-input"
                  placeholder="Near City Center Mall"
                  value={formData.apartment}
                  onChange={handleInputChange}
                />
              </div>

              <div className="checkout-form-group">
                <label className="checkout-label">
                  City <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  className={`checkout-input ${formErrors.city ? 'error' : ''}`}
                  placeholder="Mumbai"
                  value={formData.city}
                  onChange={handleInputChange}
                />
                {formErrors.city && <span className="checkout-error-text">{formErrors.city}</span>}
              </div>

              <div className="checkout-form-group">
                <label className="checkout-label">
                  State <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  className={`checkout-input ${formErrors.state ? 'error' : ''}`}
                  placeholder="Maharashtra"
                  value={formData.state}
                  onChange={handleInputChange}
                />
                {formErrors.state && <span className="checkout-error-text">{formErrors.state}</span>}
              </div>

              <div className="checkout-form-group">
                <label className="checkout-label">
                  PIN / Postal Code <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  name="postalCode"
                  className={`checkout-input ${formErrors.postalCode ? 'error' : ''}`}
                  placeholder="400001"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
                {formErrors.postalCode && <span className="checkout-error-text">{formErrors.postalCode}</span>}
              </div>

              <div className="checkout-form-group">
                <label className="checkout-label">
                  Country <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  className="checkout-input"
                  value={formData.country}
                  disabled
                />
              </div>
            </div>
          </div>


          {/* Payment Method */}
          <div className="checkout-card">
            <div className="checkout-card-header">
              <h2 className="checkout-card-title">
                <FaCreditCard /> Payment Method
              </h2>
            </div>

            <div className="payment-methods-grid">
              {/* Razorpay Online */}
              <label
                className={`payment-method-card ${paymentMethod === 'razorpay' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('razorpay')}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                  className="payment-method-radio"
                />
                <div className="payment-method-content">
                  <div className="payment-method-header">
                    <div className="payment-method-title">
                      Razorpay Online Payment
                    </div>
                    <span className="payment-method-badge">Instant & Secure</span>
                  </div>
                  <p className="payment-method-subtitle">
                    Pay securely using UPI (Google Pay, PhonePe, Paytm), Credit / Debit Cards, or NetBanking.
                  </p>
                  <div className="payment-method-icons">
                    <span className="payment-icon-pill">UPI</span>
                    <span className="payment-icon-pill">Cards</span>
                    <span className="payment-icon-pill">NetBanking</span>
                    <span className="payment-icon-pill">Wallets</span>
                  </div>
                </div>
              </label>

              {/* Cash On Delivery */}
              <label
                className={`payment-method-card ${paymentMethod === 'cod' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="payment-method-radio"
                />
                <div className="payment-method-content">
                  <div className="payment-method-header">
                    <div className="payment-method-title">
                      <FaMoneyBillWave style={{ color: '#22c55e' }} /> Cash on Delivery (COD)
                    </div>
                  </div>
                  <p className="payment-method-subtitle">
                    Pay with cash or UPI directly to the delivery executive upon package arrival.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Sticky Panel */}
        <div className="checkout-summary-panel">
          <div className="checkout-summary-title">
            <span>Order Summary</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Cart Items Preview */}
          <div className="checkout-items-preview">
            {cartItems.map((item) => (
              <div key={item._id} className="checkout-item-row">
                <div className="checkout-item-img-wrap">
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/80'}
                    alt={item.name}
                    className="checkout-item-img"
                  />
                  <span className="checkout-item-qty-badge">{item.qty}</span>
                </div>
                <div className="checkout-item-details">
                  <h4 className="checkout-item-name">{item.name}</h4>
                  <div className="checkout-item-meta">
                    ₹{Number(item.price).toLocaleString()} × {item.qty}
                  </div>
                </div>
                <div className="checkout-item-total">
                  ₹{(Number(item.price) * Number(item.qty)).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Coupon Code Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {appliedCoupon ? (
              <div className="checkout-applied-coupon">
                <span>
                  <FaTag style={{ marginRight: 6 }} /> Code <strong>{appliedCoupon}</strong> ({discountPercent}% OFF)
                </span>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="checkout-btn-remove-coupon"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="checkout-coupon-form">
                <input
                  type="text"
                  placeholder="Promo code (e.g. PRACHI10)"
                  className="checkout-coupon-input"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button type="submit" className="checkout-btn-apply-coupon">
                  Apply
                </button>
              </form>
            )}

            {couponFeedback.message && (
              <span
                style={{
                  fontSize: '0.8rem',
                  color: couponFeedback.type === 'success' ? '#22c55e' : '#ef4444',
                }}
              >
                {couponFeedback.message}
              </span>
            )}
          </div>

          {/* Breakdown Rows */}
          <div className="checkout-breakdown-list">
            <div className="checkout-breakdown-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>

            {discountPercent > 0 && (
              <div className="checkout-breakdown-row discount-row">
                <span>Discount ({discountPercent}%)</span>
                <span>-₹{discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="checkout-breakdown-row">
              <span>Shipping</span>
              <span>
                {shippingFee === 0 ? (
                  <span style={{ color: '#22c55e', fontWeight: 700 }}>FREE</span>
                ) : (
                  `₹${shippingFee}`
                )}
              </span>
            </div>

            <div className="checkout-breakdown-row total-row">
              <span>Grand Total</span>
              <span className="checkout-total-value">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Primary CTA Submit Button */}
          <button
            type="button"
            className="checkout-btn-submit"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="checkout-spinner" />
                <span>Processing Order...</span>
              </>
            ) : paymentMethod === 'cod' ? (
              <>
                <FaLock /> Place Order (COD) • ₹{grandTotal.toLocaleString()}
              </>
            ) : (
              <>
                <FaLock /> Pay ₹{grandTotal.toLocaleString()} via Razorpay
              </>
            )}
          </button>

          {/* Trust Guarantees */}
          <div className="checkout-trust-box">
            <div className="checkout-trust-item">
              <FaShieldAlt /> 256-Bit Bank Grade SSL Encrypted Checkout
            </div>
            <div className="checkout-trust-item">
              <FaTruck /> Fast & Insured Trackable Courier Delivery
            </div>
            <div className="checkout-trust-item">
              <FaUndoAlt /> 7-Day Hassle-Free Returns & Replacements
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
