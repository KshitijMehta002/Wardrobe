import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-grid">
        {/* Brand Column */}
        <div className="footer-brand-col">
          <h3 className="footer-brand-title">
            Prachi Wardrobe
          </h3>
          <p className="footer-tagline">
            Style. Comfort. You.
          </p>
          <p className="footer-desc">
            Discover timeless elegance and contemporary ethnic wear crafted for your most precious moments.
          </p>
        </div>

        {/* Shop Column */}
        <div className="footer-col">
          <h4 className="footer-heading">
            Shop
          </h4>
          <ul className="footer-links">
            <li><Link to="/shop">All Products</Link></li>
            <li><Link to="/shop?category=Dresses">Dresses & Kurtis</Link></li>
            <li><Link to="/shop?category=Sarees">Sarees & Lehengas</Link></li>
            <li><Link to="/shop?sort=newest">New Arrivals</Link></li>
          </ul>
        </div>

        {/* Help Column */}
        <div className="footer-col">
          <h4 className="footer-heading">
            Help & Info
          </h4>
          <ul className="footer-links">
            <li><Link to="/return">Shipping & Returns</Link></li>
            <li><Link to="/disclaimer">Disclaimer</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/profile">My Account</Link></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="footer-col">
          <h4 className="footer-heading">
            Contact Us
          </h4>
          <ul className="footer-contact-list">
            <li>
              <FaPhoneAlt className="footer-contact-icon" /> +91 98765 43210
            </li>
            <li>
              <FaEnvelope className="footer-contact-icon" /> support@prachiwardrobe.com
            </li>
            <li>
              <FaMapMarkerAlt className="footer-contact-icon footer-map-icon" /> Fashion Street, Mumbai - 400001
            </li>
          </ul>
        </div>
      </div>

      {/* Decorative Golden Divider with Heart */}
      <div className="footer-divider">
        <div className="footer-divider-line" />
        <FaHeart className="footer-divider-heart" />
        <div className="footer-divider-line" />
      </div>

      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} Prachi Wardrobe. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;