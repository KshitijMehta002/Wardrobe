import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaShoppingBag,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaCheck,
  FaExclamationCircle,
  FaSignInAlt,
  FaSignOutAlt,
  FaEdit,
  FaClipboardList,
  FaCircle,
  FaShippingFast,
  FaCheckCircle,
  FaClock,
} from 'react-icons/fa';
import '../styles/profile.css';

/* Utility: get initials from name */
const getInitials = (name = '') =>
  name
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

/* Status badge config */
const STATUS_CONFIG = {
  pending:   { label: 'Pending',   icon: <FaClock />,        cls: 'pending' },
  shipped:   { label: 'Shipped',   icon: <FaShippingFast />, cls: 'shipped' },
  delivered: { label: 'Delivered', icon: <FaCheckCircle />,  cls: 'delivered' },
};

/* Format date nicely */
const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

const Profile = () => {
  const { user, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  /* ── Edit profile state ── */
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [editErrors, setEditErrors] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editFeedback, setEditFeedback] = useState({ type: '', message: '' });

  /* ── Orders state ── */
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  /* Sync edit form if user object changes */
  useEffect(() => {
    if (user) {
      setEditForm((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  /* Fetch orders on mount (only if logged in) */
  useEffect(() => {
    if (!user?.token) return;

    const fetchOrders = async () => {
      setOrdersLoading(true);
      setOrdersError('');
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load orders');
        setOrders(Array.isArray(data) ? data.reverse() : []);
      } catch (err) {
        setOrdersError(err.message || 'Could not load your orders.');
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user?.token]);

  /* ── Handlers ── */
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    if (editErrors[name]) setEditErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateEdit = () => {
    const errors = {};
    if (!editForm.name.trim()) errors.name = 'Name is required';
    if (!editForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      errors.email = 'Invalid email address';
    }
    if (editForm.password && editForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setEditFeedback({ type: '', message: '' });
    if (!validateEdit()) return;

    setEditLoading(true);
    try {
      const body = {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
      };
      if (editForm.password) body.password = editForm.password;

      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      // Persist updated user (includes new token)
      login(data);
      setEditForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      setEditFeedback({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setEditFeedback({ type: 'error', message: err.message || 'Something went wrong.' });
    } finally {
      setEditLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /* ── Derived stats ── */
  const totalSpend = orders.reduce((acc, o) => acc + parseFloat(o.totalAmount || 0), 0);
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  /* ── GUEST VIEW ── */
  if (!user) {
    return (
      <div className="profile-page-container">
        <div className="profile-login-prompt">
          <FaUser />
          <h2>Sign In to View Your Profile</h2>
          <p>Access your order history, manage your account details, and track your deliveries by signing in.</p>
          <Link to="/login" className="profile-login-btn">
            <FaSignInAlt /> Sign In to Your Account
          </Link>
        </div>
      </div>
    );
  }

  /* ── LOGGED-IN VIEW ── */
  return (
    <div className="profile-page-container">

      {/* ── Hero Banner ── */}
      <div className="profile-hero">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar-circle">
            {getInitials(user.name)}
          </div>
        </div>
        <div className="profile-hero-info">
          <h1 className="profile-hero-name">{user.name}</h1>
          <p className="profile-hero-email">{user.email}</p>
          <div className="profile-hero-badges">
            <span className="profile-badge role">
              <FaCircle style={{ fontSize: '0.5rem' }} />
              {user.role === 'admin' ? 'Admin' : 'Member'}
            </span>
            <span className="profile-badge member">
              <FaShoppingBag style={{ fontSize: '0.65rem' }} />
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Placed
            </span>
          </div>
        </div>
        <button onClick={handleLogout} className="profile-btn-danger" style={{ marginLeft: 'auto' }}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="profile-stats-row">
        <div className="profile-stat-card">
          <div className="profile-stat-value">{orders.length}</div>
          <div className="profile-stat-label">Total Orders</div>
        </div>
        <div className="profile-stat-card">
          <div className="profile-stat-value">{deliveredCount}</div>
          <div className="profile-stat-label">Delivered</div>
        </div>
        <div className="profile-stat-card">
          <div className="profile-stat-value">₹{totalSpend > 0 ? totalSpend.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '0'}</div>
          <div className="profile-stat-label">Total Spent</div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="profile-layout">

        {/* Left: Edit Profile Card */}
        <div className="profile-card">
          <div className="profile-card-header">
            <h2 className="profile-card-title">
              <FaEdit /> Edit Profile
            </h2>
          </div>

          {/* Feedback Alert */}
          {editFeedback.message && (
            <div className={`profile-alert ${editFeedback.type}`}>
              {editFeedback.type === 'success' ? <FaCheck /> : <FaExclamationCircle />}
              {editFeedback.message}
            </div>
          )}

          <form onSubmit={handleSaveProfile} noValidate>
            {/* Name */}
            <div className="profile-form-group">
              <label className="profile-label">
                <FaUser style={{ marginRight: 5, color: 'var(--accent)' }} />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                className={`profile-input ${editErrors.name ? 'error' : ''}`}
                value={editForm.name}
                onChange={handleEditChange}
                placeholder="Your full name"
              />
              {editErrors.name && <span className="profile-error-text">{editErrors.name}</span>}
            </div>

            {/* Email */}
            <div className="profile-form-group">
              <label className="profile-label">
                <FaEnvelope style={{ marginRight: 5, color: 'var(--accent)' }} />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className={`profile-input ${editErrors.email ? 'error' : ''}`}
                value={editForm.email}
                onChange={handleEditChange}
                placeholder="you@example.com"
              />
              {editErrors.email && <span className="profile-error-text">{editErrors.email}</span>}
            </div>

            <div className="profile-divider" />

            {/* New Password */}
            <div className="profile-form-group">
              <label className="profile-label">
                <FaLock style={{ marginRight: 5, color: 'var(--accent)' }} />
                New Password
              </label>
              <input
                type="password"
                name="password"
                className={`profile-input ${editErrors.password ? 'error' : ''}`}
                value={editForm.password}
                onChange={handleEditChange}
                placeholder="Leave blank to keep current"
                autoComplete="new-password"
              />
              {editErrors.password
                ? <span className="profile-error-text">{editErrors.password}</span>
                : <span className="profile-input-hint">Min. 6 characters. Leave blank to keep your current password.</span>
              }
            </div>

            {/* Confirm Password */}
            <div className="profile-form-group">
              <label className="profile-label">
                <FaLock style={{ marginRight: 5, color: 'var(--accent)' }} />
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className={`profile-input ${editErrors.confirmPassword ? 'error' : ''}`}
                value={editForm.confirmPassword}
                onChange={handleEditChange}
                placeholder="Repeat new password"
                autoComplete="new-password"
                disabled={!editForm.password}
              />
              {editErrors.confirmPassword && (
                <span className="profile-error-text">{editErrors.confirmPassword}</span>
              )}
            </div>

            <button
              type="submit"
              className="profile-btn-primary"
              disabled={editLoading}
              style={{ marginTop: 8 }}
            >
              {editLoading ? (
                <><span className="profile-spinner" /> Saving Changes...</>
              ) : (
                <><FaCheck /> Save Changes</>
              )}
            </button>
          </form>
        </div>

        {/* Right: Order History */}
        <div className="profile-card">
          <div className="profile-card-header">
            <h2 className="profile-card-title">
              <FaClipboardList /> Order History
            </h2>
          </div>

          <div className="profile-orders-panel">
            {/* Loading Skeletons */}
            {ordersLoading && (
              <>
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="profile-skeleton"
                    style={{ height: 110, borderRadius: 12 }}
                  />
                ))}
              </>
            )}

            {/* Error */}
            {!ordersLoading && ordersError && (
              <div className="profile-alert error">
                <FaExclamationCircle /> {ordersError}
              </div>
            )}

            {/* Empty */}
            {!ordersLoading && !ordersError && orders.length === 0 && (
              <div className="profile-orders-empty">
                <FaBoxOpen />
                <p>You haven't placed any orders yet. Start exploring our collections!</p>
                <Link to="/shop" className="profile-btn-primary" style={{ display: 'inline-flex', width: 'auto', padding: '11px 24px' }}>
                  <FaShoppingBag /> Browse Shop
                </Link>
              </div>
            )}

            {/* Order Cards */}
            {!ordersLoading && orders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const addr = order.address;
              const addrText = addr
                ? `${addr.street || ''}, ${addr.city || ''} ${addr.postalCode || ''}`
                : '';

              return (
                <div key={order._id} className="profile-order-card">
                  <div className="profile-order-top">
                    <div>
                      <div className="profile-order-id">#{order._id?.slice(-10).toUpperCase()}</div>
                      <div className="profile-order-date">
                        {order.createdAt ? formatDate(order.createdAt) : '—'}
                      </div>
                    </div>
                    <span className={`profile-order-status-badge ${statusCfg.cls}`}>
                      {statusCfg.icon} {statusCfg.label}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="profile-order-items-list">
                    {order.items?.map((item, idx) => {
                      const prod = typeof item.productId === 'object' ? item.productId : null;
                      const prodId = prod?._id || (typeof item.productId === 'string' ? item.productId : '');
                      const prodName = prod?.name || `Product #${idx + 1}`;
                      const prodImg = prod?.imageUrl || 'https://placehold.co/400x300?text=No+Image';

                      return (
                        <div key={item._id || idx} className="profile-order-item-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {prodId ? (
                              <Link to={`/product/${prodId}`} tabIndex={-1} style={{ display: 'flex', flexShrink: 0 }}>
                                <img
                                  src={prodImg}
                                  alt={prodName}
                                  style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}
                                  loading="lazy"
                                />
                              </Link>
                            ) : (
                              <img
                                src={prodImg}
                                alt={prodName}
                                style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}
                                loading="lazy"
                              />
                            )}
                            <span className="profile-order-item-name">
                              <FaCircle style={{ fontSize: '0.4rem', color: 'var(--accent)', flexShrink: 0 }} />
                              {prodName}
                            </span>
                          </div>
                          <span style={{ whiteSpace: 'nowrap' }}>
                            ₹{Number(item.price).toLocaleString()} × {item.qty}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer: Total + Address */}
                  <div className="profile-order-footer">
                    <div className="profile-order-total">
                      Total: <span>₹{parseFloat(order.totalAmount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    </div>
                    {addrText && (
                      <div className="profile-order-address">
                        <FaMapMarkerAlt style={{ flexShrink: 0, marginTop: 2 }} />
                        {addrText}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
