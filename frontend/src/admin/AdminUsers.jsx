import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminNav from './AdminNav';
import '../styles/admin.css';
import { 
  FaUsers, 
  FaUserShield, 
  FaUserCheck, 
  FaSearch, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaExclamationTriangle,
  FaRedo
} from 'react-icons/fa';

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to load user list');
      }

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error fetching user directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  // Metrics
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const customerCount = users.filter((u) => u.role !== 'admin').length;

  // Filter
  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = u.name?.toLowerCase().includes(term);
    const emailMatch = u.email?.toLowerCase().includes(term);

    const roleMatch = 
      roleFilter === 'All' || 
      (roleFilter === 'admin' && u.role === 'admin') ||
      (roleFilter === 'user' && u.role !== 'admin');

    return (nameMatch || emailMatch) && roleMatch;
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
            <h1><FaUsers style={{ color: 'var(--accent)' }} /> Registered Users</h1>
            <p>Manage customer accounts and monitor administrative privileges.</p>
          </div>
          <button 
            onClick={fetchUsers} 
            className="admin-btn admin-btn-secondary"
            title="Refresh user list"
          >
            <FaRedo /> Refresh Directory
          </button>
        </div>

        {error && (
          <div className="admin-alert admin-alert-error">
            <FaExclamationTriangle /> {error}
          </div>
        )}

        {/* Stats Row */}
        <div className="admin-stats-grid" style={{ marginBottom: '24px' }}>
          <div className="admin-stat-card" style={{ '--stat-accent': '#d4af37' }}>
            <div className="admin-stat-top">
              <span className="admin-stat-label">Total Accounts</span>
              <div className="admin-stat-icon-box">
                <FaUsers />
              </div>
            </div>
            <div className="admin-stat-value">{totalUsers}</div>
            <div className="admin-stat-meta">Active registered accounts</div>
          </div>

          <div className="admin-stat-card" style={{ '--stat-accent': '#42083b' }}>
            <div className="admin-stat-top">
              <span className="admin-stat-label">Administrators</span>
              <div className="admin-stat-icon-box" style={{ background: 'rgba(66, 8, 59, 0.12)', color: '#42083b' }}>
                <FaUserShield />
              </div>
            </div>
            <div className="admin-stat-value">{adminCount}</div>
            <div className="admin-stat-meta">Store management access</div>
          </div>

          <div className="admin-stat-card" style={{ '--stat-accent': '#3b82f6' }}>
            <div className="admin-stat-top">
              <span className="admin-stat-label">Customers</span>
              <div className="admin-stat-icon-box" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
                <FaUserCheck />
              </div>
            </div>
            <div className="admin-stat-value">{customerCount}</div>
            <div className="admin-stat-meta">Shoppers & buyers</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="admin-toolbar">
          <div className="admin-search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search user by name or email address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="admin-filter-select"
          >
            <option value="All">Role: All Accounts</option>
            <option value="admin">Admins Only</option>
            <option value="user">Customers Only</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="admin-panel" style={{ padding: 0 }}>
          {loading ? (
            <div className="admin-empty-state">
              <div className="admin-spinner" style={{ width: '32px', height: '32px' }}></div>
              <p style={{ marginTop: '12px' }}>Loading registered users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="admin-empty-state">
              <FaUsers />
              <h3>No Users Found</h3>
              <p>No user accounts matched your search terms.</p>
              {searchTerm && (
                <button 
                  onClick={() => { setSearchTerm(''); setRoleFilter('All'); }} 
                  className="admin-btn admin-btn-secondary"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="admin-table-wrapper" style={{ border: 'none' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Registered Date</th>
                    <th>Account ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const initials = u.name
                      ? u.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()
                      : 'U';

                    const isAdmin = u.role === 'admin';

                    return (
                      <tr key={u._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ 
                              width: '38px', 
                              height: '38px', 
                              borderRadius: '50%', 
                              background: isAdmin ? 'linear-gradient(135deg, #42083b, #42083b)' : 'linear-gradient(135deg, #ebd0a3, #d6a05a)',
                              color: isAdmin ? '#fff' : '#160800',
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              fontWeight: '700', 
                              fontSize: '0.85rem',
                              color: '#fff',
                              flexShrink: 0
                            }}>
                              {initials}
                            </div>
                            <div>
                              <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                                {u.name || 'Anonymous User'}
                              </div>
                              {u._id === user._id && (
                                <span style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: '700' }}>
                                  (Current Session)
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                            <FaEnvelope style={{ fontSize: '0.75rem', opacity: 0.6 }} /> {u.email}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-user'}`}>
                            {isAdmin ? <FaUserShield /> : <FaUserCheck />} {u.role || 'user'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            <FaCalendarAlt style={{ fontSize: '0.75rem', opacity: 0.6 }} />
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            }) : '—'}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {u._id}
                          </span>
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

export default AdminUsers;
