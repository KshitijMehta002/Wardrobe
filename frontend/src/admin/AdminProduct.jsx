import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminNav from './AdminNav';
import '../styles/admin.css';
import { 
  FaBoxes, 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrashAlt, 
  FaExternalLinkAlt, 
  FaExclamationTriangle,
  FaRedo
} from 'react-icons/fa';

const AdminProduct = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');

  // Delete modal state
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/products');
      if (!res.ok) {
        throw new Error('Failed to load products');
      }
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/products/${productToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete product');
      }

      // Optimistically remove from list
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
      setProductToDelete(null);
    } catch (err) {
      alert(err.message || 'Error deleting product');
    } finally {
      setIsDeleting(false);
    }
  };

  // Derive unique categories
  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

  // Filtering logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      selectedCategory === 'All' || p.category === selectedCategory;

    let matchesStock = true;
    if (stockFilter === 'instock') matchesStock = Number(p.stock) > 5;
    else if (stockFilter === 'lowstock') matchesStock = Number(p.stock) > 0 && Number(p.stock) <= 5;
    else if (stockFilter === 'outofstock') matchesStock = Number(p.stock) === 0;

    return matchesSearch && matchesCategory && matchesStock;
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
            <h1><FaBoxes style={{ color: 'var(--accent)' }} /> Product Inventory</h1>
            <p>Manage, edit, monitor stock levels, and organize your store's catalog.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={fetchProducts} 
              className="admin-btn admin-btn-secondary" 
              title="Refresh inventory"
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

        {/* Toolbar */}
        <div className="admin-toolbar">
          <div className="admin-search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search products by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="admin-filter-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>Category: {cat}</option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="admin-filter-select"
            >
              <option value="All">Stock: All Statuses</option>
              <option value="instock">In Stock (&gt;5)</option>
              <option value="lowstock">Low Stock (1-5)</option>
              <option value="outofstock">Out of Stock (0)</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="admin-panel" style={{ padding: 0 }}>
          {loading ? (
            <div className="admin-empty-state">
              <div className="admin-spinner" style={{ width: '32px', height: '32px' }}></div>
              <p style={{ marginTop: '12px' }}>Loading catalog inventory...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="admin-empty-state">
              <FaBoxes />
              <h3>No Products Match Your Filters</h3>
              <p>Try clearing your search filters or add a new product to the catalog.</p>
              <button 
                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setStockFilter('All'); }} 
                className="admin-btn admin-btn-secondary"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="admin-table-wrapper" style={{ border: 'none' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Created</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const stockNum = Number(product.stock || 0);
                    const stockBadge = 
                      stockNum > 5 ? 'badge-instock' :
                      stockNum > 0 ? 'badge-lowstock' : 'badge-outofstock';

                    const stockLabel = 
                      stockNum > 5 ? `${stockNum} in stock` :
                      stockNum > 0 ? `${stockNum} left (low)` : 'Out of stock';

                    return (
                      <tr key={product._id}>
                        <td>
                          <div className="admin-product-cell">
                            <img
                              src={product.imageUrl || 'https://placehold.co/100x100?text=No+Img'}
                              alt={product.name}
                              className="admin-product-thumb"
                              loading="lazy"
                            />
                            <div>
                              <div className="admin-product-title">{product.name}</div>
                              <div className="admin-product-cat">ID: #{product._id?.slice(-8).toUpperCase()}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-user">{product.category || 'General'}</span>
                        </td>
                        <td>
                          <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${stockBadge}`}>
                            {stockLabel}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            }) : '—'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                            <Link
                              to={`/product/${product._id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              title="View in Storefront"
                            >
                              <FaExternalLinkAlt />
                            </Link>
                            <Link
                              to={`/admin/product/${product._id}`}
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              title="Edit Details"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              onClick={() => setProductToDelete(product)}
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              title="Delete Product"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
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

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="admin-modal-backdrop" onClick={() => !isDeleting && setProductToDelete(null)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-title">Delete Product</div>
            <div className="admin-modal-desc">
              Are you sure you want to permanently delete <strong>"{productToDelete.name}"</strong>? This action cannot be undone.
            </div>
            <div className="admin-modal-actions">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setProductToDelete(null)}
                className="admin-btn admin-btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="admin-btn admin-btn-danger"
              >
                {isDeleting ? <span className="admin-spinner"></span> : <FaTrashAlt />} Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminProducts = AdminProduct;
export default AdminProduct;
