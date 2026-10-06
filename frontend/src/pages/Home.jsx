import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import heroBanner1 from '../assets/hero-banner1.png';
import heroBanner2 from '../assets/hero-banner2.png';
import {
  FaShippingFast,
  FaShieldAlt,
  FaUndoAlt,
  FaHeadset,
  FaHeart,
  FaChevronRight,
  FaTag
} from 'react-icons/fa';
import {
  GiDress,
  GiFemaleLegs,
  GiAmpleDress,
  GiClothes,
  GiShirt
} from 'react-icons/gi';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailSub, setEmailSub] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data.slice(0, 8) : []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailSub) {
      setSubSuccess(true);
      setEmailSub('');
      setTimeout(() => setSubSuccess(false), 4000);
    }
  };

  const categories = [
    { name: 'DRESSES', icon: <GiDress />, path: '/shop?category=Dresses', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80' },
    { name: 'KURTIS', icon: <GiClothes />, path: '/shop?category=Kurtis', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80' },
    { name: 'SAREES', icon: <GiAmpleDress />, path: '/shop?category=Sarees', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80' },
    { name: 'CO-ORD SETS', icon: <GiFemaleLegs />, path: '/shop?category=Co-ord', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80' },
    { name: 'LEHENGAS', icon: <GiAmpleDress />, path: '/shop?category=Lehengas', img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=300&q=80' },
    { name: 'TOPS', icon: <GiShirt />, path: '/shop?category=Tops', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
    { name: 'SALE', icon: <FaTag />, path: '/shop?sale=true', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&q=80', isSale: true },
  ];

  return (
    <div className="home-page-wrapper" style={{ minHeight: '100vh', background: 'var(--bg-main, #260027)' }}>
      {/* Hero section — layout & sizing controlled by global.css breakpoints */}
      <section
        className="home-hero-section"
        style={{
          '--hero-bg-desktop': `url(${heroBanner1})`,
          '--hero-bg-mobile': `url(${heroBanner2})`
        }}
      >
        <div className="home-hero-content">
          <div className="home-hero-text">

            {/* DEFINE YOUR */}
            <h1 className="hero-title">DEFINE YOUR</h1>

            {/* Cursive "Style" + heart */}
            <div className="hero-style-row">
              <span className="hero-style-word">Style</span>
              <svg width="30" height="30" viewBox="0 0 32 32" fill="none" className="hero-heart-svg">
                <path
                  d="M16 26 C13 22, 6 16, 6 10 C6 6.5, 9 4, 12.5 4 C14.5 4, 15.5 5, 16 6 C16.5 5, 17.5 4, 19.5 4 C23 4, 26 6.5, 26 10 C26 16, 19 22, 16 26 Z"
                  stroke="#E88BA8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Subtitle */}
            <p className="hero-subtitle">
              Elegant dresses<br />for every moment of you.
            </p>

            {/* SHOP NOW Button */}
            <Link to="/shop" className="hero-shop-btn">
              SHOP NOW <FaChevronRight className="hero-btn-icon" />
            </Link>

            {/* Gold heart divider */}
            <div className="hero-divider">
              <div className="hero-divider-line" />
              <FaHeart className="hero-divider-heart" />
              <div className="hero-divider-line" />
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          2. CIRCULAR CATEGORY SHOWCASE
          ========================================================= */}
      <section className="home-category-showcase">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'clamp(14px, 3.5vw, 36px)',
          flexWrap: 'wrap'
        }}>
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                gap: '10px',
                transition: 'transform 0.25s ease'
              }}
              className="cat-circle-item"
            >
              {/* Circular Thumbnail with Gold Ring */}
              <div
                style={{
                  position: 'relative',
                  width: 'clamp(72px, 8.5vw, 96px)',
                  height: 'clamp(72px, 8.5vw, 96px)',
                  borderRadius: '50%',
                  padding: '3px',
                  background: cat.isSale
                    ? 'linear-gradient(135deg, #e11d48, #d6a05a)'
                    : 'linear-gradient(135deg, #ebd0a3 0%, #d6a05a 50%, #aa7432 100%)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4), 0 0 15px rgba(214, 160, 90, 0.2)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    border: '2px solid #0b0410'
                  }}
                />
              </div>

              {/* Category Name & Golden Icon */}
              <div style={{ textAlign: 'center' }}>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: cat.isSale ? '#fda4af' : '#FAF7F2',
                    transition: 'color 0.2s ease'
                  }}
                >
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================
          3. NEW ARRIVALS SECTION
          ========================================================= */}
      <section className="home-new-arrivals">
        {/* Title Header with Gold Floral Divider & View All */}
        <div className="home-section-header">
          <h2 className="home-section-title">NEW ARRIVALS</h2>

          {/* Decorative Divider */}
          <div className="home-section-divider">
            <div className="home-divider-line" />
            <FaHeart className="home-divider-heart" />
            <div className="home-divider-line" />
          </div>

          <Link to="/shop?sort=newest" className="home-view-all-link">
            View All <FaChevronRight style={{ fontSize: '0.75rem' }} />
          </Link>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="loading" style={{ color: 'var(--accent-gold-light, #ebd0a3)' }}>
            Loading elegant collections...
          </div>
        ) : products.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#8e7c9e', padding: '40px 0' }}>
            No products available yet. Add products to the database or explore the shop.
          </p>
        ) : (
          <div className='product-grid'>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================
          4. TRUST & VALUE PROPOSITIONS BAR
          ========================================================= */}
      <section className="home-trust-section">
        <div className="home-trust-grid">
          <div className="home-trust-item">
            <div className="home-trust-icon">
              <FaShippingFast />
            </div>
            <div className="home-trust-text">
              <h4>Free Shipping</h4>
              <p>On Orders Above ₹999</p>
            </div>
          </div>

          <div className="home-trust-item">
            <div className="home-trust-icon">
              <FaShieldAlt />
            </div>
            <div className="home-trust-text">
              <h4>Secure Payment</h4>
              <p>100% Secure Payment</p>
            </div>
          </div>

          <div className="home-trust-item">
            <div className="home-trust-icon">
              <FaUndoAlt />
            </div>
            <div className="home-trust-text">
              <h4>Easy Returns</h4>
              <p>7 Days Return Policy</p>
            </div>
          </div>

          <div className="home-trust-item">
            <div className="home-trust-icon">
              <FaHeadset />
            </div>
            <div className="home-trust-text">
              <h4>Customer Support</h4>
              <p>24/7 Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          5. NEWSLETTER / DISCOUNT CTA
          ========================================================= */}
      <section className="home-newsletter-section">
        <div className="home-newsletter-container">
          <div className="home-newsletter-text">
            <h3 className="home-newsletter-title">
              GET 10% OFF ON YOUR FIRST ORDER
            </h3>
            <p className="home-newsletter-desc">
              Subscribe to receive exclusive offers, new arrivals and styling tips.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="home-newsletter-form">
            <input
              type="email"
              placeholder="Enter your email address"
              value={emailSub}
              onChange={(e) => setEmailSub(e.target.value)}
              required
              className="home-newsletter-input"
            />
            <button
              type="submit"
              className="home-newsletter-btn"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
        {subSuccess && (
          <p className="home-newsletter-success">
            Thank you for subscribing! Your 10% discount code will be sent to your inbox.
          </p>
        )}
      </section>
    </div>
  );
};

export default Home;