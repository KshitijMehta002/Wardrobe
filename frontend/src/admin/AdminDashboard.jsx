import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminNav from './AdminNav';
import '../styles/admin.css';
import { 
  FaChartPie, 
  FaRupeeSign, 
  FaShoppingBag, 
  FaBoxes, 
  FaUsers, 
  FaPlus, 
  FaArrowRight, 
  FaClock, 
  FaCheckCircle, 
  FaTruck, 
  FaExclamationTriangle,
  FaRedo
} from 'react-icons/fa';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProduct: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    if (!user || user.role !== 'admin') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const headers = {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      };

      // Fetch analytics stats and orders concurrently
      const [analyticsRes, ordersRes] = await Promise.all([
        fetch('/api/analytics', { headers }),
        fetch('/api/orders', { headers })
      ]);

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setStats({
          totalUsers: data.totalUsers || 0,
          totalOrders: data.totalOrders || 0,
          totalProduct: data.totalProduct || 0,
          totalRevenue: data.totalRevenue ?? data.toalRevenue ?? 0,
        });
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        const sorted = Array.isArray(ordersData) 
          ? [...ordersData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6) 
          : [];
        setRecentOrders(sorted);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Could not load dashboard statistics. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  if (!user) {
    return (
      <div className="admin-layout">
        <div className="admin-container">
          <div className="admin-empty-state">
            <FaExclamationTriangle style={{ color: '#ef4444' }} />
            <h3>Sign In Required</h3>
            <p>You must be signed in as an administrator to access the admin portal.</p>
            <Link to="/login" className="admin-btn admin-btn-primary">Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="admin-layout">
        <div className="admin-container">
          <div className="admin-empty-state">
            <FaExclamationTriangle style={{ color: '#ef4444' }} />
            <h3>Access Denied</h3>
            <p>Your account ({user.email}) does not have administrative privileges.</p>
            <Link to="/" className="admin-btn admin-btn-secondary">Return to Home</Link>
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
            <h1><FaChartPie style={{ color: 'var(--accent)' }} /> Admin Dashboard</h1>
            <p>Welcome back, {user.name}. Here is an overview of your store's performance.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={fetchDashboardData} 
              className="admin-btn admin-btn-secondary"
              title="Refresh stats"
            >
              <FaRedo /> Refresh
            </button>
            <Link to="/admin/add-product" className="admin-btn admin-btn-primary">
              <FaPlus /> Add Product
            </Link>
          </div>
        </div>

        {error && (
          <div className="admin-alert admin-alert-error">
            <FaExclamationTriangle /> {error}
          </div>
        )}

        {/* KPI Stats Row */}
        <div className="admin-stats-grid">
          {/* Revenue */}
          <div className="admin-stat-card" style={{ '--stat-accent': '#10b981' }}>
            <div className="admin-stat-top">
              <span className="admin-stat-label">Total Revenue</span>
              <div className="admin-stat-icon-box" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                <FaRupeeSign />
              </div>
            </div>
            <div className="admin-stat-value">
              ₹{Number(stats.totalRevenue).toLocaleString('en-IN')}
            </div>
            <div className="admin-stat-meta">Lifetime sales recorded</div>
          </div>

          {/* Orders */}
          <div className="admin-stat-card" style={{ '--stat-accent': '#3b82f6' }}>
            <div className="admin-stat-top">
              <span className="admin-stat-label">Total Orders</span>
              <div className="admin-stat-icon-box" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
                <FaShoppingBag />
              </div>
            </div>
            <div className="admin-stat-value">
              {stats.totalOrders}
            </div>
            <div className="admin-stat-meta">Processed customer orders</div>
          </div>

          {/* Products */}
          <div className="admin-stat-card" style={{ '--stat-accent': '#d4af37' }}>
            <div className="admin-stat-top">
              <span className="admin-stat-label">Products in Catalog</span>
              <div className="admin-stat-icon-box" style={{ background: 'rgba(212, 175, 55, 0.12)', color: '#d4af37' }}>
                <FaBoxes />
              </div>
            </div>
            <div className="admin-stat-value">
              {stats.totalProduct}
            </div>
            <div className="admin-stat-meta">Active catalog inventory</div>
          </div>

          {/* Users */}
          <div className="admin-stat-card" style={{ '--stat-accent': '#42083b' }}>
            <div className="admin-stat-top">
              <span className="admin-stat-label">Registered Users</span>
              <div className="admin-stat-icon-box" style={{ background: 'rgba(66, 8, 59, 0.12)', color: '#42083b' }}>
                <FaUsers />
              </div>
            </div>
            <div className="admin-stat-value">
              {stats.totalUsers}
            </div>
            <div className="admin-stat-meta">Customer accounts created</div>
          </div>
        </div>

        {/* Quick Actions Shortcuts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <Link to="/admin/products" className="admin-stat-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px' }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>Manage Products</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Edit prices, stock & details</div>
            </div>
            <FaArrowRight style={{ color: 'var(--accent)' }} />
          </Link>

          <Link to="/admin/orders" className="admin-stat-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px' }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>Fulfill Orders</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Update tracking & status</div>
            </div>
            <FaArrowRight style={{ color: 'var(--accent)' }} />
          </Link>

          <Link to="/admin/users" className="admin-stat-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px' }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>Customer Directory</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Inspect user accounts</div>
            </div>
            <FaArrowRight style={{ color: 'var(--accent)' }} />
          </Link>
        </div>

        {/* Recent Orders Table */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title">
              <FaClock /> Recent Customer Orders
            </div>
            <Link to="/admin/orders" className="admin-btn admin-btn-secondary admin-btn-sm">
              View All Orders <FaArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="admin-empty-state">
              <div className="admin-spinner" style={{ width: '32px', height: '32px' }}></div>
              <p style={{ marginTop: '12px' }}>Loading latest orders...</p>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="admin-empty-state">
              <FaShoppingBag />
              <h3>No Orders Found</h3>
              <p>When customers place orders, they will appear right here.</p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const statusClass = 
                      order.status === 'delivered' ? 'badge-delivered' :
                      order.status === 'shipped' ? 'badge-shipped' : 'badge-pending';

                    const statusIcon = 
                      order.status === 'delivered' ? <FaCheckCircle /> :
                      order.status === 'shipped' ? <FaTruck /> : <FaClock />;

                    return (
                      <tr key={order._id}>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--accent)' }}>
                            #{order._id?.slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: '600' }}>
                            {order.user?.name || order.address?.fullname || 'Customer'}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {order.user?.email || ''}
                          </div>
                        </td>
                        <td>
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : '—'}
                        </td>
                        <td>
                          <span style={{ fontWeight: '700' }}>
                            ₹{parseFloat(order.totalAmount || 0).toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${statusClass}`}>
                            {statusIcon} {order.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <Link 
                            to="/admin/orders" 
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
