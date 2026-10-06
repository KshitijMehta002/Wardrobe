import React, { useState, useEffect, useMemo } from 'react';
import Product from '../components/ProductCard';
import { FaSearch, FaTimes, FaUndo, FaShoppingBag } from 'react-icons/fa';
import '../styles/product.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to load products. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Extract unique categories dynamically from fetched products
  const categories = useMemo(() => {
    const unique = new Set(
      products
        .map((p) => p.category)
        .filter((cat) => Boolean(cat) && typeof cat === 'string')
    );
    return ['All', ...Array.from(unique)];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // 2. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    // 3. Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating-desc':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name-asc':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      default:
        // Default keeps order
        break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('default');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'All';

  return (
    <div className="shop-container">
      {/* Header Banner */}
      <div className="shop-header">
        <span className="shop-badge">Curated Collection</span>
        <h1>Explore Our Shop</h1>
        <p>
          Discover handcrafted artisanal ethnic wear, elegant dresses, and premium contemporary fashion tailored to perfection.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="shop-controls">
        <div className="shop-controls-top">
          {/* Search Box */}
          <div className="shop-search-box">
            <FaSearch className="shop-search-icon" />
            <input
              type="text"
              placeholder="Search by name, fabric, style, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="shop-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#a1a1aa',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
                title="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="shop-sort-box">
            <label htmlFor="shop-sort" className="shop-sort-label">
              Sort By:
            </label>
            <select
              id="shop-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="shop-sort-select"
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="name-asc">Alphabetical (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        {categories.length > 1 && (
          <div className="shop-category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="shop-meta-bar">
        <span>
          Showing <strong>{filteredProducts.length}</strong> of{' '}
          <strong>{products.length}</strong> products
          {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
        </span>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="btn-clear-filter"
          >
            <FaUndo size={12} /> Reset Filters
          </button>
        )}
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="detail-status-container">
          <div className="detail-spinner" />
          <h3>Loading Wardrobe Collection...</h3>
          <p style={{ color: '#a1a1aa', marginTop: '6px' }}>
            Fetching the latest available styles and collections.
          </p>
        </div>
      ) : error ? (
        <div className="shop-empty-container">
          <div style={{ fontSize: '2.5rem', marginBottom: '14px' }}>⚠️</div>
          <h3 style={{ marginBottom: '10px' }}>Unable to Load Products</h3>
          <p style={{ color: '#a1a1aa', marginBottom: '20px' }}>{error}</p>
          <button
            type="button"
            onClick={fetchProducts}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="shop-empty-container">
          <FaShoppingBag className="shop-empty-icon" />
          <h3 style={{ marginBottom: '10px' }}>No Products Found</h3>
          <p style={{ color: '#a1a1aa', marginBottom: '24px' }}>
            {hasActiveFilters
              ? "We couldn't find any products matching your current filters. Try changing keywords or resetting filters."
              : 'No products are currently available in the store.'}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="btn btn-primary"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;