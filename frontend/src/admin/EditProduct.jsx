import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminNav from './AdminNav';
import '../styles/admin.css';
import { 
  FaEdit, 
  FaCloudUploadAlt, 
  FaBoxes, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaArrowLeft,
  FaEye,
  FaSave
} from 'react-icons/fa';

const CATEGORIES = [
  'Ethnic Wear',
  'Western Wear',
  'Sarees',
  'Lehengas',
  'Kurtis & Sets',
  'Suits & Dresses',
  'Gowns',
  'Accessories'
];

const EditProduct = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Ethnic Wear',
    price: '',
    stock: '',
    description: '',
    imageUrl: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          throw new Error('Could not find requested product');
        }
        const data = await res.json();
        setFormData({
          name: data.name || '',
          category: data.category || 'Ethnic Wear',
          price: data.price || '',
          stock: data.stock !== undefined ? data.stock : '',
          description: data.description || '',
          imageUrl: data.imageUrl || '',
        });
        setImagePreview(data.imageUrl || '');
      } catch (err) {
        setError(err.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, imageUrl: url }));
    if (!imageFile) {
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('Please provide a valid price');
      return;
    }
    if (formData.stock === '' || Number(formData.stock) < 0) {
      setError('Please provide a valid stock quantity');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('category', formData.category);
      data.append('price', formData.price);
      data.append('stock', formData.stock);
      data.append('description', formData.description.trim());

      if (imageFile) {
        data.append('image', imageFile);
      }
      if (formData.imageUrl.trim()) {
        data.append('imageUrl', formData.imageUrl.trim());
      }

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
        body: data,
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || 'Failed to update product');
      }

      setSuccess(`Product "${resData.name}" has been updated successfully!`);
      setTimeout(() => {
        navigate('/admin/products');
      }, 1400);
    } catch (err) {
      setError(err.message || 'Error updating product');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-layout">
        <div className="admin-container">
          <div className="admin-empty-state">
            <FaExclamationTriangle style={{ color: '#ef4444' }} />
            <h3>Admin Access Required</h3>
            <p>You need administrator permissions to edit products.</p>
            <Link to="/login" className="admin-btn admin-btn-primary">Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminNav />
        <div className="admin-container">
          <div className="admin-empty-state">
            <div className="admin-spinner" style={{ width: '36px', height: '36px' }}></div>
            <p style={{ marginTop: '12px' }}>Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminNav />

      <div className="admin-container">
        <div className="admin-header">
          <div>
            <Link to="/admin/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
              <FaArrowLeft /> Back to Products
            </Link>
            <h1><FaEdit style={{ color: 'var(--accent)' }} /> Edit Product</h1>
            <p>Updating ID: #{id}</p>
          </div>
        </div>

        {error && (
          <div className="admin-alert admin-alert-error">
            <FaExclamationTriangle /> {error}
          </div>
        )}

        {success && (
          <div className="admin-alert admin-alert-success">
            <FaCheckCircle /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            {/* Main Fields */}
            <div className="admin-panel">
              <div className="admin-panel-title" style={{ marginBottom: '20px' }}>
                <FaBoxes /> Product Attributes
              </div>

              {/* Title */}
              <div className="admin-form-group">
                <label className="admin-form-label">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="admin-form-input"
                  required
                />
              </div>

              {/* Category, Price, Stock */}
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="admin-form-select"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    className="admin-form-input"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Stock Units *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    className="admin-form-input"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="admin-form-group">
                <label className="admin-form-label">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="admin-form-textarea"
                  required
                />
              </div>

              {/* Image Upload Area */}
              <div className="admin-form-group">
                <label className="admin-form-label">Replace Image File</label>
                <label className="admin-dropzone">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <FaCloudUploadAlt className="admin-dropzone-icon" />
                  <div className="admin-dropzone-text">
                    {imageFile ? (
                      <strong>Selected new: {imageFile.name}</strong>
                    ) : (
                      <>Click or drag & drop to upload replacement photo</>
                    )}
                  </div>
                  <div className="admin-dropzone-hint">Leave empty to keep the existing product photo</div>
                </label>
              </div>

              {/* Or Image URL */}
              <div className="admin-form-group">
                <label className="admin-form-label">Or Update Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleImageUrlChange}
                  placeholder="https://..."
                  className="admin-form-input"
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '14px', marginTop: '24px' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="admin-btn admin-btn-primary"
                  style={{ minWidth: '160px' }}
                >
                  {submitting ? (
                    <>
                      <span className="admin-spinner"></span> Saving Changes...
                    </>
                  ) : (
                    <>
                      <FaSave /> Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/products')}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Preview Box */}
            <div className="admin-preview-card">
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaEye /> Live Store Preview
              </div>

              <img
                src={imagePreview || 'https://placehold.co/400x500/18181b/a1a1aa?text=Product+Preview'}
                alt="Product preview"
                className="admin-preview-img"
              />

              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: '700', letterSpacing: '0.05em' }}>
                {formData.category || 'Category'}
              </div>

              <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: '4px 0 6px', color: 'var(--text-primary)' }}>
                {formData.name || 'Sample Product Title'}
              </h4>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  ₹{Number(formData.price || 0).toLocaleString('en-IN')}
                </span>
                <span className={`badge ${Number(formData.stock) > 5 ? 'badge-instock' : Number(formData.stock) > 0 ? 'badge-lowstock' : 'badge-outofstock'}`}>
                  {Number(formData.stock) > 0 ? `${formData.stock || 0} in stock` : 'Out of stock'}
                </span>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '10px', lineHeight: '1.4', maxHeight: '60px', overflow: 'hidden' }}>
                {formData.description || 'Product description preview...'}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
