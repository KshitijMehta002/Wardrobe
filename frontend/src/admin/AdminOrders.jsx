import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminNav from './AdminNav';
import '../styles/admin.css';
import { 
  FaShoppingBag, 
  FaSearch, 
  FaClock, 
  FaTruck, 
  FaCheckCircle, 
  FaMapMarkerAlt, 
  FaRupeeSign, 
  FaExclamationTriangle,
  FaRedo,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

const STATUS_OPTIONS = ['pending', 'shipped', 'delivered'];

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch orders from server');
      }

      const data = await res.json();
      const sorted = Array.isArray(data) 
        ? [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];
      setOrders(sorted);
    } catch (err) {
      setError(err.message || 'Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchOrders();
    }
  }, [user]);

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update order status');
      }

      // Optimistic state update
      setOrders((prev) =>
        prev.map((ord) => (ord._id === orderId ? { ...ord, status: newStatus } : ord))
      );
    } catch (err) {
      alert(err.message || 'Error updating order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Metrics summary
  const totalCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const shippedCount = orders.filter((o) => o.status === 'shipped').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

    const term = searchTerm.toLowerCase();
    const orderIdMatch = order._id?.toLowerCase().includes(term);
    const customerNameMatch = 
      (order.user?.name || order.address?.fullname || '').toLowerCase().includes(term);
    const customerEmailMatch = (order.user?.email || '').toLowerCase().includes(term);
    const cityMatch = (order.address?.city || '').toLowerCase().includes(term);

    return matchesStatus && (orderIdMatch || customerNameMatch || customerEmailMatch || cityMatch);
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-layout">
        <div className="admin-container">
          <div className="admin-empty-state">
            <FaExclamationTriangle style={{ color: '#ef4444' }} />
            <h3>Admin Access Required</h3>
            <p>You need administrator permissions to view this page.</p>
            <Link to="/login" className="admin-btn admin-btn-primary">Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminNav />

      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1><FaShoppingBag style={{ color: 'var(--accent)' }} /> Customer Orders</h1>
            <p>Process, monitor fulfillment progress, and update shipping statuses.</p>
          </div>
          <button 
            onClick={fetchOrders} 
            className="admin-btn admin-btn-secondary"
            title="Refresh orders list"
          >
            <FaRedo /> Refresh Orders
          </button>
        </div>

        {error && (
          <div className="admin-alert admin-alert-error">
            <FaExclamationTriangle /> {error}
          </div>
        )}

        {/* Quick Filter Status Chips / Stats */}
        <div className="admin-stats-grid" style={{ marginBottom: '24px' }}>
          <div 
            className="admin-stat-card" 
            style={{ cursor: 'pointer', borderColor: statusFilter === 'All' ? 'var(--accent)' : '' }}
            onClick={() => setStatusFilter('All')}
          >
            <div className="admin-stat-top">
              <span className="admin-stat-label">All Orders</span>
              <div className="admin-stat-icon-box" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}>
                <FaShoppingBag />
              </div>
            </div>
            <div className="admin-stat-value">{totalCount}</div>
            <div className="admin-stat-meta">₹{totalRevenue.toLocaleString('en-IN')} total volume</div>
          </div>

          <div 
            className="admin-stat-card" 
            style={{ cursor: 'pointer', borderColor: statusFilter === 'pending' ? '#eab308' : '' }}
            onClick={() => setStatusFilter('pending')}
          >
            <div className="admin-stat-top">
              <span className="admin-stat-label">Pending</span>
              <div className="admin-stat-icon-box" style={{ background: 'rgba(234, 179, 8, 0.12)', color: '#eab308' }}>
                <FaClock />
              </div>
            </div>
            <div className="admin-stat-value">{pendingCount}</div>
            <div className="admin-stat-meta">Awaiting fulfillment</div>
          </div>

          <div 
            className="admin-stat-card" 
            style={{ cursor: 'pointer', borderColor: statusFilter === 'shipped' ? '#3b82f6' : '' }}
            onClick={() => setStatusFilter('shipped')}
          >
            <div className="admin-stat-top">
              <span className="admin-stat-label">Shipped</span>
              <div className="admin-stat-icon-box" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
                <FaTruck />
              </div>
            </div>
            <div className="admin-stat-value">{shippedCount}</div>
            <div className="admin-stat-meta">In transit with courier</div>
          </div>

          <div 
            className="admin-stat-card" 
            style={{ cursor: 'pointer', borderColor: statusFilter === 'delivered' ? '#10b981' : '' }}
            onClick={() => setStatusFilter('delivered')}
          >
            <div className="admin-stat-top">
              <span className="admin-stat-label">Delivered</span>
              <div className="admin-stat-icon-box" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                <FaCheckCircle />
              </div>
            </div>
            <div className="admin-stat-value">{deliveredCount}</div>
            <div className="admin-stat-meta">Completed orders</div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="admin-toolbar">
          <div className="admin-search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by Order ID, customer, email, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-filter-select"
            >
              <option value="All">Filter: All Statuses</option>
              <option value="pending">Status: Pending</option>
              <option value="shipped">Status: Shipped</option>
              <option value="delivered">Status: Delivered</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="admin-empty-state">
            <div className="admin-spinner" style={{ width: '36px', height: '36px' }}></div>
            <p style={{ marginTop: '12px' }}>Loading orders from database...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="admin-panel">
            <div className="admin-empty-state">
              <FaShoppingBag />
              <h3>No Orders Found</h3>
              <p>No customer orders match the selected filter criteria.</p>
              {searchTerm && (
                <button 
                  onClick={() => { setSearchTerm(''); setStatusFilter('All'); }} 
                  className="admin-btn admin-btn-secondary"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredOrders.map((order) => {
              const isExpanded = !!expandedOrders[order._id];
              const addr = order.address || {};
              const addrStr = [addr.fullname, addr.street, addr.city, addr.postalCode, addr.country]
                .filter(Boolean)
                .join(', ');

              const statusClass = 
                order.status === 'delivered' ? 'badge-delivered' :
                order.status === 'shipped' ? 'badge-shipped' : 'badge-pending';

              return (
                <div key={order._id} className="admin-panel" style={{ margin: 0, padding: '20px' }}>
                  {/* Order Card Top Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                      <span style={{ 
                        fontFamily: 'monospace', 
                        fontWeight: '700', 
                        fontSize: '0.95rem',
                        color: 'var(--accent)',
                        background: 'rgba(249, 115, 22, 0.1)',
                        border: '1px solid rgba(249, 115, 22, 0.25)',
                        padding: '4px 12px',
                        borderRadius: '6px'
                      }}>
                        #{order._id?.slice(-10).toUpperCase()}
                      </span>

                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '—'}
                      </div>
                    </div>

                    {/* Status Select & Total */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status:</span>
                        <select
                          value={order.status}
                          disabled={updatingOrderId === order._id}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`badge ${statusClass}`}
                          style={{ cursor: 'pointer', outline: 'none', border: '1px solid currentColor', background: 'transparent' }}
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st} style={{ background: '#18181b', color: '#fff' }}>
                              {st.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                        ₹{parseFloat(order.totalAmount || 0).toLocaleString('en-IN')}
                      </div>

                      <button
                        onClick={() => toggleExpand(order._id)}
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        style={{ padding: '6px 10px' }}
                        title="Toggle order details"
                      >
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>
                  </div>

                  {/* Summary Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Customer: </strong> 
                      {order.user?.name || addr.fullname || 'Guest'} 
                      {order.user?.email && <span style={{ color: 'var(--text-muted)' }}> ({order.user.email})</span>}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Items: </strong>
                      {order.items?.length || 0} product(s)
                    </div>
                  </div>

                  {/* Expandable Order Breakdown */}
                  {isExpanded && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      {/* Shipping Address & Payment */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px' }}>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FaMapMarkerAlt /> Delivery Address
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                            {addrStr || 'No address provided'}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '4px' }}>
                            Payment Details
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                            ID: <span style={{ fontFamily: 'monospace' }}>{order.paymentId || 'Cash on Delivery / Direct'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Items List */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          Purchased Products
                        </div>
                        {order.items?.map((item, idx) => {
                          const prod = typeof item.productId === 'object' ? item.productId : null;
                          const prodId = prod?._id || (typeof item.productId === 'string' ? item.productId : '');
                          const prodName = prod?.name || `Product #${idx + 1}`;
                          const prodImg = prod?.imageUrl || 'https://placehold.co/80x80?text=Item';

                          return (
                            <div 
                              key={item._id || idx}
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between', 
                                gap: '12px',
                                padding: '10px 14px',
                                background: 'var(--bg-card)',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.05)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <img
                                  src={prodImg}
                                  alt={prodName}
                                  style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px' }}
                                />
                                <div>
                                  <div style={{ fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                                    {prodId ? (
                                      <Link to={`/product/${prodId}`} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
                                        {prodName}
                                      </Link>
                                    ) : (
                                      prodName
                                    )}
                                  </div>
                                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                    ₹{Number(item.price).toLocaleString('en-IN')} each
                                  </div>
                                </div>
                              </div>

                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                  ₹{(Number(item.price) * Number(item.qty)).toLocaleString('en-IN')}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                  Qty: {item.qty}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
