import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaShoppingBag,
  FaCheck,
  FaEye,
} from 'react-icons/fa';
import '../styles/product.css';

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  if (!product) {
    return null;
  }

  const {
    _id,
    name = 'Unnamed Product',
    price = 0,
    category,
    imageUrl,
    stock = 0,
    rating = 4.5,
    numReviews = 0,
  } = product;

  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;
  const originalPrice = price ? (price * 1.25).toFixed(2) : null;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    dispatch(
      addToCart({
        _id,
        productId: _id,
        name,
        price,
        imageUrl,
        stock,
        category,
        qty: 1,
      })
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const renderStars = (score = 0) => {
    const stars = [];
    const fullStars = Math.floor(score);
    const hasHalf = score % 1 >= 0.4 && score % 1 <= 0.8;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<FaStarHalfAlt key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    return stars;
  };

  return (
    <div className="product-card">
      {/* Product Image & Badges */}
      <div className="product-card-image-wrap">
        <Link to={`/product/${_id}`} tabIndex={-1}>
          <img
            src={imageUrl || 'https://placehold.co/400x300?text=No+Image'}
            alt={name}
            className="product-image"
            loading="lazy"
          />
        </Link>

        {category && (
          <span className="card-category-badge">{category}</span>
        )}

        {isOutOfStock ? (
          <span className="card-stock-badge out">Sold Out</span>
        ) : isLowStock ? (
          <span className="card-stock-badge low">Only {stock} Left</span>
        ) : null}
      </div>

      {/* Product Info */}
      <div className="product-info">
        {/* Star Rating */}
        <div className="card-rating">
          {renderStars(rating)}
          <span className="card-rating-num">
            {Number(rating).toFixed(1)}
          </span>
          <span className="card-reviews-count">
            ({numReviews || 0})
          </span>
        </div>

        {/* Product Name */}
        <h3 className="product-name" title={name}>
          <Link to={`/product/${_id}`} style={{ color: 'inherit' }}>
            {name}
          </Link>
        </h3>

        {/* Pricing Row */}
        <div className="card-price-row">
          <span className="card-price">₹{Number(price).toFixed(2)}</span>
          {originalPrice && (
            <span className="card-original-price">₹{originalPrice}</span>
          )}
        </div>

        {/* Actions Row */}
        <div className="card-actions-row">
          <Link to={`/product/${_id}`} className="btn-card-details">
            <FaEye /> View
          </Link>

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`btn-card-cart ${added ? 'added' : ''}`}
            title={isOutOfStock ? 'Sold Out' : 'Quick Add to Cart'}
            aria-label={`Add ${name} to cart`}
          >
            {added ? (
              <>
                <FaCheck /> Added
              </>
            ) : (
              <>
                <FaShoppingBag /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;