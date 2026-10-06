import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaShoppingBag,
  FaBolt,
  FaCheck,
  FaTruck,
  FaShieldAlt,
  FaUndoAlt,
  FaArrowLeft,
  FaMinus,
  FaPlus,
} from 'react-icons/fa';
import '../styles/product.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          throw new Error(res.status === 404 ? 'Product not found' : 'Failed to fetch product details');
        }
        const data = await res.json();
        if (isMounted) {
          setProduct(data);
          setQty(1);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'An error occurred while loading the product.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchProduct();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleDecreaseQty = () => {
    setQty((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncreaseQty = () => {
    if (!product) return;
    setQty((prev) => (product.stock && prev < product.stock ? prev + 1 : prev));
  };

  const handleAddToCart = (goToCart = false) => {
    if (!product || product.stock <= 0) return;

    dispatch(
      addToCart({
        _id: product._id,
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
        category: product.category,
        qty: Number(qty),
      })
    );

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 4000);

    if (goToCart) {
      navigate('/cart');
    }
  };

  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.4 && rating % 1 <= 0.8;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="detail-status-container">
          <div className="detail-spinner" />
          <h3 style={{ marginBottom: '8px' }}>Loading Product Details...</h3>
          <p>Please wait while we retrieve the latest information for you.</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container">
        <div className="detail-status-container">
          <div style={{ fontSize: '3rem', color: '#ef4444', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ marginBottom: '12px', fontSize: '1.8rem' }}>Product Not Found</h2>
          <p style={{ marginBottom: '28px', color: '#a1a1aa' }}>
            {error || "The product you are looking for doesn't exist or has been removed."}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/shop" className="btn btn-primary">
              <FaShoppingBag /> Browse Shop
            </Link>
            <Link to="/" className="btn btn-secondary">
              <FaArrowLeft /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const originalPrice = product.price ? (product.price * 1.25).toFixed(2) : null;

  return (
    <div className="product-detail-container">
      {/* Breadcrumbs Navigation */}
      <nav className="breadcrumb-nav" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to="/shop" className="breadcrumb-link">Shop</Link>
        {product.category && (
          <>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-link" style={{ cursor: 'default' }}>{product.category}</span>
          </>
        )}
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current" title={product.name}>{product.name}</span>
      </nav>

      {/* Main Product Showcase Card */}
      <div className="product-detail-wrapper">
        {/* Left Column: Image Preview */}
        <div className="detail-image-section">
          <div className="detail-image-container">
            <img
              src={product.imageUrl || 'https://placehold.co/600x750?text=No+Image+Available'}
              alt={product.name}
              className="detail-image"
              loading="eager"
            />
            {isOutOfStock ? (
              <span className="detail-image-badge badge-out-of-stock">Out of Stock</span>
            ) : isLowStock ? (
              <span className="detail-image-badge badge-low-stock">Only {product.stock} Left</span>
            ) : (
              <span className="detail-image-badge badge-in-stock">In Stock</span>
            )}
          </div>
        </div>

        {/* Right Column: Product Information & Purchase Actions */}
        <div className="detail-info">
          {product.category && (
            <span className="detail-category-tag">{product.category}</span>
          )}

          <h1 className="detail-title">{product.name}</h1>

          {/* Rating & Review Summary */}
          <div className="detail-rating-row">
            <div className="star-rating">
              {renderStars(product.rating || 4.5)}
            </div>
            <span className="rating-text">
              {product.rating ? Number(product.rating).toFixed(1) : '4.5'}
            </span>
            <span className="rating-count">
              ({product.numReviews || 12} customer reviews)
            </span>
          </div>

          {/* Price Section */}
          <div className="detail-price-row">
            <span className="detail-price">₹{Number(product.price || 0).toFixed(2)}</span>
            {originalPrice && (
              <span className="detail-mrp">₹{originalPrice}</span>
            )}
            <span className="detail-discount-badge">Save 20%</span>
          </div>

          {/* Short Description */}
          <p className="detail-description">{product.description}</p>

          {/* Product Specifications / Meta Info */}
          <div className="detail-meta-list">
            <div className="meta-item">
              <span className="meta-label">Category:</span>
              <span className="meta-val">{product.category || 'Fashion & Apparel'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Availability:</span>
              <span className="meta-val" style={{ color: isOutOfStock ? '#ef4444' : isLowStock ? '#facc15' : '#4ade80' }}>
                {isOutOfStock ? 'Currently Unavailable' : `${product.stock} in stock`}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">SKU / Item ID:</span>
              <span className="meta-val" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                {product._id ? product._id.slice(-8).toUpperCase() : 'N/A'}
              </span>
            </div>
          </div>

          {/* Purchase Controls */}
          <div className="purchase-section">
            {!isOutOfStock && (
              <div className="quantity-control">
                <span className="quantity-label">Quantity:</span>
                <div className="quantity-stepper">
                  <button
                    type="button"
                    onClick={handleDecreaseQty}
                    disabled={qty <= 1}
                    className="stepper-btn"
                    aria-label="Decrease quantity"
                  >
                    <FaMinus />
                  </button>
                  <input
                    type="text"
                    readOnly
                    value={qty}
                    className="stepper-input"
                    aria-label="Current quantity"
                  />
                  <button
                    type="button"
                    onClick={handleIncreaseQty}
                    disabled={product.stock && qty >= product.stock}
                    className="stepper-btn"
                    aria-label="Increase quantity"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons-group">
              <button
                type="button"
                onClick={() => handleAddToCart(false)}
                disabled={isOutOfStock}
                className="btn-add-cart"
              >
                <FaShoppingBag />
                {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
              </button>

              <button
                type="button"
                onClick={() => handleAddToCart(true)}
                disabled={isOutOfStock}
                className="btn-buy-now"
              >
                <FaBolt />
                Buy Now
              </button>
            </div>

            {/* Added to Cart Feedback Banner */}
            {addedSuccess && (
              <div className="cart-alert-success" role="alert">
                <span>
                  <FaCheck style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Added {qty} item{qty > 1 ? 's' : ''} to your cart successfully!
                </span>
                <Link to="/cart" className="cart-alert-link">
                  View Cart &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* Value Propositions / Store Perks */}
          <div className="product-perks">
            <div className="perk-item">
              <FaTruck className="perk-icon" />
              <div className="perk-text">
                <h4>Free Shipping</h4>
                <p>On all qualifying orders over $50</p>
              </div>
            </div>
            <div className="perk-item">
              <FaUndoAlt className="perk-icon" />
              <div className="perk-text">
                <h4>7-Day Easy Returns</h4>
                <p>Simple return and exchange policy</p>
              </div>
            </div>
            <div className="perk-item">
              <FaShieldAlt className="perk-icon" />
              <div className="perk-text">
                <h4>100% Authentic</h4>
                <p>Handcrafted genuine artisan apparel</p>
              </div>
            </div>
            <div className="perk-item">
              <FaCheck className="perk-icon" />
              <div className="perk-text">
                <h4>Secure Checkout</h4>
                <p>Protected by 256-bit SSL encryption</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductDetail;