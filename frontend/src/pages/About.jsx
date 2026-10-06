import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';

const About = () => {
  return (
    <div className="about-page">
      <style>{`
        .about-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 48px 20px 80px;
          color: #f4f4f5;
        }

        .about-hero {
          text-align: center;
          padding: 50px 24px;
          margin-bottom: 48px;
          background: radial-gradient(circle at center, rgba(139, 44, 191, 0.22) 0%, rgba(11, 4, 16, 0.95) 70%), var(--bg-surface, #130822);
          border: 1px solid var(--border, rgba(214, 160, 90, 0.18));
          border-radius: 16px;
        }

        .about-badge {
          display: inline-block;
          padding: 6px 14px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--accent-gold, #d6a05a);
          background: rgba(214, 160, 90, 0.12);
          border: 1px solid rgba(214, 160, 90, 0.28);
          border-radius: 9999px;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .about-hero h1 {
          font-family: var(--font-serif, 'Playfair Display', serif);
          font-size: clamp(2.2rem, 4vw, 3rem);
          font-weight: 800;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #ffffff 40%, var(--accent-gold-light, #ebd0a3) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .about-hero p {
          max-width: 650px;
          margin: 0 auto;
          color: #a1a1aa;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .about-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
        }

        .about-card {
          background: #18181b;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 28px;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }

        .about-card:hover {
          transform: translateY(-4px);
          border-color: rgba(249, 115, 22, 0.4);
        }

        .about-card-icon {
          font-size: 2rem;
          margin-bottom: 16px;
          display: inline-block;
        }

        .about-card h3 {
          font-size: 1.25rem;
          color: #ffffff;
          margin-bottom: 10px;
        }

        .about-card p {
          color: #a1a1aa;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .about-story {
          background: #121214;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 36px 32px;
          margin-bottom: 48px;
        }

        .about-story h2 {
          color: #ffffff;
          font-size: 1.75rem;
          margin-bottom: 16px;
        }

        .about-story p {
          color: #a1a1aa;
          font-size: 1rem;
          line-height: 1.8;
          margin-bottom: 16px;
        }

        /* Social Media Section */
        .about-social {
          text-align: center;
          background: #121214;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 36px 24px;
          margin-bottom: 48px;
        }

        .about-social h2 {
          color: #ffffff;
          font-size: 1.6rem;
          margin-bottom: 8px;
        }

        .about-social p {
          color: #a1a1aa;
          font-size: 0.95rem;
          margin-bottom: 24px;
        }

        .social-links {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .social-card {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.25s ease;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: #18181b;
        }

        .social-card .social-icon {
          font-size: 1.25rem;
        }

        /* Instagram */
        .social-card.instagram {
          color: #f43f5e;
        }
        .social-card.instagram:hover {
          background: rgba(244, 63, 94, 0.12);
          border-color: rgba(244, 63, 94, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(244, 63, 94, 0.25);
        }

        /* Facebook */
        .social-card.facebook {
          color: #3b82f6;
        }
        .social-card.facebook:hover {
          background: rgba(59, 130, 246, 0.12);
          border-color: rgba(59, 130, 246, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.25);
        }

        /* YouTube */
        .social-card.youtube {
          color: #ef4444;
        }
        .social-card.youtube:hover {
          background: rgba(239, 68, 68, 0.12);
          border-color: rgba(239, 68, 68, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(239, 68, 68, 0.25);
        }

        .about-cta {
          text-align: center;
          padding: 40px 20px;
        }

        .about-cta h2 {
          font-size: 1.8rem;
          color: #ffffff;
          margin-bottom: 12px;
        }

        .about-cta p {
          color: #a1a1aa;
          margin-bottom: 24px;
        }

        .about-btn {
          display: inline-block;
          padding: 12px 28px;
          background: var(--accent-gold-gradient, linear-gradient(135deg, #ebd0a3 0%, #d6a05a 50%, #aa7432 100%));
          color: #160800;
          font-weight: 700;
          border-radius: 10px;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(214, 160, 90, 0.4);
          transition: all 0.25s ease;
        }

        .about-btn:hover {
          background: linear-gradient(135deg, #f5dfbe 0%, #dfa863 50%, #ba813c 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 22px rgba(214, 160, 90, 0.55);
        }

        @media (max-width: 768px) {
          .about-page { padding: 24px 16px 50px; }
          .about-hero { padding: 32px 18px; margin-bottom: 28px; }
          .about-hero h1 { font-size: 1.6rem; }
          .about-hero p { font-size: 0.9rem; }
          .about-grid { grid-template-columns: 1fr; gap: 16px; margin-bottom: 28px; }
          .about-card { padding: 20px; }
          .about-story { padding: 22px 18px; margin-bottom: 28px; }
          .about-social { padding: 24px 18px; margin-bottom: 28px; }
        }

        @media (max-width: 480px) {
          .about-page { padding: 18px 12px 40px; }
          .about-hero { padding: 24px 14px; margin-bottom: 20px; }
          .about-hero h1 { font-size: 1.35rem; }
          .about-hero p { font-size: 0.82rem; }
          .about-card { padding: 16px; }
          .about-card h3 { font-size: 1.1rem; }
          .about-card p { font-size: 0.85rem; }
          .social-card { padding: 9px 16px; font-size: 0.82rem; }
          .about-cta { padding: 24px 10px; }
          .about-cta h2 { font-size: 1.3rem; }
          .about-btn { padding: 10px 22px; font-size: 0.85rem; }
        }
      `}</style>

      <section className="about-hero">
        <span className="about-badge">Our Story</span>
        <h1>About Prachi Wardrobe</h1>
        <p>
          Curating premium, timeless fashion designed to empower your individuality, confidence, and personal style.
        </p>
      </section>

      <div className="about-grid">
        <div className="about-card">
          <span className="about-card-icon">✨</span>
          <h3>Unmatched Quality</h3>
          <p>
            Every piece is carefully selected and crafted from premium fabrics to guarantee lasting comfort and sophistication.
          </p>
        </div>

        <div className="about-card">
          <span className="about-card-icon">🛍️</span>
          <h3>Curated Collections</h3>
          <p>
            From everyday casuals to statement festive attire, we bring the latest trends tailored to match every occasion.
          </p>
        </div>

        <div className="about-card">
          <span className="about-card-icon">🤝</span>
          <h3>Customer First</h3>
          <p>
            Your satisfaction is our obsession. We provide transparent pricing, rapid shipping, and dedicated support.
          </p>
        </div>
      </div>

      <section className="about-story">
        <h2>Who We Are</h2>
        <p>
          Founded with a passion for chic aesthetics and everyday elegance, Prachi Wardrobe started as a vision to make premium designer fashion accessible without compromising on craftsmanship.
        </p>
        <p>
          We believe what you wear is a reflection of your identity. Whether you're dressing for a keynote presentation, a casual brunch, or an evening gala, Prachi Wardrobe delivers pieces that make you feel distinct and radiant.
        </p>
      </section>

      {/* Social Media Links Section */}
      <section className="about-social">
        <h2>Connect With Us</h2>
        <p>Follow our journey, get daily styling inspiration, and be the first to know about new arrivals.</p>
        <div className="social-links">
          <a 
            href="https://www.instagram.com/prach_iwardrobe/?hl=en" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-card instagram"
          >
            <FaInstagram className="social-icon" />
            <span>Instagram</span>
          </a>

          <a 
            href="https://www.facebook.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-card facebook"
          >
            <FaFacebook className="social-icon" />
            <span>Facebook</span>
          </a>

          <a 
            href="https://www.youtube.com/@prachisahh/shorts" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-card youtube"
          >
            <FaYoutube className="social-icon" />
            <span>YouTube</span>
          </a>
        </div>
      </section>

      <div className="about-cta">
        <h2>Ready to upgrade your wardrobe?</h2>
        <p>Explore our hand-picked collection of newly arrived trends.</p>
        <Link to="/shop" className="about-btn">Explore Collection</Link>
      </div>
    </div>
  );
};

export default About;
