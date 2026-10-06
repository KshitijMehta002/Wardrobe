import React from 'react';

const Disclaimer = () => {
  return (
    <div className="disclaimer-page">
      <style>{`
        .disclaimer-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 48px 20px 80px;
          color: #f4f4f5;
        }

        .disclaimer-header {
          text-align: center;
          padding: 40px 24px;
          margin-bottom: 40px;
          background: #121214;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
        }

        .disclaimer-badge {
          display: inline-block;
          padding: 5px 12px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--accent-gold, #d6a05a);
          background: rgba(214, 160, 90, 0.12);
          border: 1px solid rgba(214, 160, 90, 0.28);
          border-radius: 9999px;
          margin-bottom: 14px;
          text-transform: uppercase;
        }

        .disclaimer-header h1 {
          font-family: var(--font-serif, 'Playfair Display', serif);
          font-size: clamp(2rem, 4vw, 2.75rem);
          margin-bottom: 12px;
          background: linear-gradient(135deg, #ffffff 40%, var(--accent-gold-light, #ebd0a3) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .disclaimer-header p {
          color: var(--text-secondary, #c7b9d8);
          font-size: 0.95rem;
        }

        .disclaimer-card {
          background: var(--bg-surface, #130822);
          border: 1px solid var(--border, rgba(214, 160, 90, 0.16));
          border-radius: 14px;
          padding: 28px;
          margin-bottom: 24px;
        }

        .disclaimer-card h2 {
          font-size: 1.25rem;
          color: var(--accent-gold, #d6a05a);
          margin-bottom: 12px;
        }

        .disclaimer-card p {
          color: var(--text-secondary, #c7b9d8);
          font-size: 0.95rem;
          line-height: 1.7;
          margin-bottom: 12px;
        }

        .disclaimer-card p:last-child {
          margin-bottom: 0;
        }

        .disclaimer-note {
          background: rgba(214, 160, 90, 0.08);
          border-left: 3px solid var(--accent-gold, #d6a05a);
          padding: 16px 20px;
          border-radius: 6px;
          margin-top: 14px;
        }

        .disclaimer-note p {
          color: var(--accent-gold-light, #ebd0a3);
          font-size: 0.9rem;
          margin: 0;
        }

        @media (max-width: 768px) {
          .disclaimer-page { padding: 24px 16px 50px; }
          .disclaimer-header { padding: 28px 16px; margin-bottom: 24px; }
          .disclaimer-header h1 { font-size: 1.6rem; }
          .disclaimer-card { padding: 20px; margin-bottom: 18px; }
          .disclaimer-card h2 { font-size: 1.15rem; }
        }

        @media (max-width: 480px) {
          .disclaimer-page { padding: 18px 12px 40px; }
          .disclaimer-header { padding: 20px 12px; margin-bottom: 18px; }
          .disclaimer-header h1 { font-size: 1.35rem; }
          .disclaimer-card { padding: 16px; margin-bottom: 14px; }
          .disclaimer-card h2 { font-size: 1.05rem; }
          .disclaimer-card p { font-size: 0.85rem; }
          .disclaimer-note { padding: 12px 14px; }
        }
      `}</style>

      <div className="disclaimer-header">
        <span className="disclaimer-badge">Legal Information</span>
        <h1>Website & Product Disclaimer</h1>
        <p>Last updated: September 2026</p>
      </div>

      <div className="disclaimer-card">
        <h2>1. General Information</h2>
        <p>
          The information provided by Prachi Wardrobe on this website is for general informational and shopping purposes only. All information on the platform is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding accuracy, adequacy, or completeness.
        </p>
      </div>

      <div className="disclaimer-card">
        <h2>2. Product Visuals & Color Variations</h2>
        <p>
          We make every effort to display the colors, fabrics, and textures of our products as accurately as possible. However, the actual color you see depends on your monitor, device display settings, and ambient lighting conditions.
        </p>
        <div className="disclaimer-note">
          <p>
            <strong>Please Note:</strong> Slight variations in color shade or fabric weave are inherent characteristics of textiles and handmade embellishments, and should not be treated as manufacturing defects.
          </p>
        </div>
      </div>

      <div className="disclaimer-card">
        <h2>3. Pricing & Availability</h2>
        <p>
          Product prices, promotions, and availability are subject to change without prior notice. While we strive to avoid typographical errors, unintentional discrepancies in price or descriptions may occasionally occur. In such instances, Prachi Wardrobe reserves the right to correct the error and cancel or re-evaluate affected orders.
        </p>
      </div>

      <div className="disclaimer-card">
        <h2>4. Third-Party Links & Services</h2>
        <p>
          Our platform may contain links to external third-party services (e.g., payment gateways, logistics couriers). We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites.
        </p>
      </div>

      <div className="disclaimer-card">
        <h2>5. Limitation of Liability</h2>
        <p>
          In no event shall Prachi Wardrobe, its directors, or affiliates be liable for any indirect, punitive, incidental, or consequential damages arising out of your use of this site or purchase of our products beyond the actual purchase price paid.
        </p>
      </div>
    </div>
  );
};

export default Disclaimer;
