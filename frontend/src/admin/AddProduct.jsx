import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminNav from './AdminNav';
import '../styles/admin.css';
import { 
  FaPlusCircle, 
  FaCloudUploadAlt, 
  FaBoxes, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaArrowLeft,
  FaEye,
  FaRupeeSign
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

const AddProduct = () => {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    if (!formData.description.trim()) {
      setError('Product description is required');
      return;
    }
    if (!imageFile && !formData.imageUrl.trim()) {
      setError('Please upload a product image or provide an image URL');
      return;
    }

    try {
      setLoading(true);
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

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
        body: data,
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || 'Failed to create product');
      }

      setSuccess(`Product "${resData.name}" has been published successfully!`);
      // Reset form
      setFormData({
        name: '',
        category: 'Ethnic Wear',
        price: '',
        stock: '',
        description: '',
        imageUrl: '',
      });
      setImageFile(null);
      setImagePreview('');

      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Something went wrong while publishing the product');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-layout">
        <div className="admin-container">
          <div className="admin-empty-state">
            <FaExclamationTriangle style={{ color: '#ef4444' }} />
            <h3>Admin Access Required</h3>
            <p>You need administrator permissions to add products.</p>
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
        <div className="admin-header">
          <div>
            <Link to="/admin/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
              <FaArrowLeft /> Back to Products
            </Link>
            <h1><FaPlusCircle style={{ color: 'var(--accent)' }} /> Add New Product</h1>
            <p>Publish a new item to your boutique collection.</p>
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
            {/* Left: Main Form Fields */}
            <div className="admin-panel">
              <div className="admin-panel-title" style={{ marginBottom: '20px' }}>
                <FaBoxes /> Product Details
              </div>

              {/* Title */}
              <div className="admin-form-group">
                <label className="admin-form-label">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Royal Embroidered Silk Anarkali"
                  className="admin-form-input"
                  required
                />
              </div>

              {/* Category & Price & Stock */}
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
                    placeholder="2999"
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
                    placeholder="25"
                    min="0"
                    className="admin-form-input"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="admin-form-group">
                <label className="admin-form-label">Product Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the fabric, fit, occasion, embroidery, and care instructions..."
                  className="admin-form-textarea"
                  required
                />
              </div>

              {/* Image Upload Area */}
              <div className="admin-form-group">
                <label className="admin-form-label">Product Image File</label>
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
                      <strong>Selected: {imageFile.name}</strong>
                    ) : (
                      <>Click or drag & drop to upload high-res photo</>
                    )}
                  </div>
                  <div className="admin-dropzone-hint">Supports JPG, PNG, WEBP up to 5MB</div>
                </label>
              </div>

              {/* Alternative Image URL */}
              <div className="admin-form-group">
                <label className="admin-form-label">Or Image URL (External Link)</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleImageUrlChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="admin-form-input"
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '14px', marginTop: '24px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="admin-btn admin-btn-primary"
                  style={{ minWidth: '160px' }}
                >
                  {loading ? (
                    <>
                      <span className="admin-spinner"></span> Publishing...
                    </>
                  ) : (
                    <>
                      <FaPlusCircle /> Publish Product
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

            {/* Right: Live Preview Box */}
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
                {formData.description || 'Product description will appear here as you type.'}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
