import React from 'react';
import { Link } from 'react-router-dom';

const ReturnPolicy = () => {
  return (
    <div className="policy-page">
      <style>{`
        .policy-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 48px 20px 80px;
          color: #f4f4f5;
        }

        .policy-header {
          text-align: center;
          padding: 40px 24px;
          margin-bottom: 40px;
          background: #121214;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
        }

        .policy-badge {
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

        .policy-header h1 {
          font-family: var(--font-serif, 'Playfair Display', serif);
          font-size: clamp(2rem, 4vw, 2.75rem);
          margin-bottom: 12px;
          background: linear-gradient(135deg, #ffffff 40%, var(--accent-gold-light, #ebd0a3) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .policy-header p {
          color: var(--text-secondary, #c7b9d8);
          font-size: 1rem;
        }

        .policy-section {
          background: var(--bg-surface, #130822);
          border: 1px solid var(--border, rgba(214, 160, 90, 0.16));
          border-radius: 14px;
          padding: 28px;
          margin-bottom: 24px;
        }

        .policy-section h2 {
          font-size: 1.3rem;
          color: var(--accent-gold, #d6a05a);
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .policy-section p {
          color: var(--text-secondary, #c7b9d8);
          font-size: 0.95rem;
          line-height: 1.7;
          margin-bottom: 12px;
        }

        .policy-list {
          list-style: none;
          padding: 0;
          margin: 16px 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .policy-list li {
          color: var(--text-primary, #fdfbf7);
          font-size: 0.95rem;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .policy-list li::before {
          content: '✓';
          color: var(--accent-gold, #d6a05a);
          font-weight: bold;
        }

        .process-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
          margin-top: 18px;
        }

        .step-box {
          background: var(--bg-card, #1a0c2e);
          border: 1px solid var(--border, rgba(214, 160, 90, 0.12));
          border-radius: 10px;
          padding: 20px;
          text-align: center;
        }

        .step-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(214, 160, 90, 0.15);
          color: var(--accent-gold, #d6a05a);
          border: 1px solid rgba(214, 160, 90, 0.35);
          font-weight: 700;
          margin-bottom: 10px;
        }

        .step-box h4 {
          color: #ffffff;
          margin-bottom: 6px;
        }

        .step-box p {
          font-size: 0.85rem;
          color: var(--text-muted, #8e7c9e);
          margin: 0;
        }

        .contact-box {
          text-align: center;
          padding: 30px;
          background: var(--bg-surface, #130822);
          border: 1px dashed rgba(214, 160, 90, 0.35);
          border-radius: 12px;
          margin-top: 32px;
        }

        .contact-box h3 {
          color: var(--accent-gold, #d6a05a);
          margin-bottom: 8px;
        }

        .contact-box p {
          color: var(--text-secondary, #c7b9d8);
          margin-bottom: 16px;
        }

        .contact-link {
          color: var(--accent-gold, #d6a05a);
          font-weight: 600;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .policy-page { padding: 24px 16px 50px; }
          .policy-header { padding: 28px 16px; margin-bottom: 24px; }
          .policy-header h1 { font-size: 1.6rem; }
          .policy-section { padding: 20px; margin-bottom: 18px; }
          .policy-section h2 { font-size: 1.2rem; }
          .process-steps { grid-template-columns: 1fr; gap: 14px; }
        }

        @media (max-width: 480px) {
          .policy-page { padding: 18px 12px 40px; }
          .policy-header { padding: 20px 12px; margin-bottom: 18px; }
          .policy-header h1 { font-size: 1.35rem; }
          .policy-section { padding: 16px; margin-bottom: 14px; }
          .policy-section h2 { font-size: 1.1rem; }
          .policy-section p { font-size: 0.85rem; }
          .policy-list li { font-size: 0.85rem; }
          .step-card { padding: 16px; }
          .contact-box { padding: 20px 14px; margin-top: 20px; }
        }
      `}</style>

      <div className="policy-header">
        <span className="policy-badge">Customer Assurance</span>
        <h1>Return & Refund Policy</h1>
        <p>Hassle-free 7-day returns on eligible items</p>
      </div>

      <div className="policy-section">
        <h2>7-Day Easy Returns</h2>
        <p>
          At Prachi Wardrobe, we want you to love what you wear. If your purchase doesn't fit or meet your expectations, you may initiate a return or exchange within <strong>7 days</strong> of delivery.
        </p>
        <ul className="policy-list">
          <li>Item must be unworn, unwashed, and in its original condition.</li>
          <li>All original price tags and brand labels must remain intact.</li>
          <li>Original packaging must be returned with the product.</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2>How the Return Process Works</h2>
        <div className="process-steps">
          <div className="step-box">
            <span className="step-number">1</span>
            <h4>Submit Request</h4>
            <p>Go to your Orders page and select the item you wish to return.</p>
          </div>
          <div className="step-box">
            <span className="step-number">2</span>
            <h4>Doorstep Pickup</h4>
            <p>Our courier partner will inspect and collect the item within 2-3 business days.</p>
          </div>
          <div className="step-box">
            <span className="step-number">3</span>
            <h4>Quick Refund</h4>
            <p>Once verified, your refund is credited within 5-7 business days.</p>
          </div>
        </div>
      </div>

      <div className="policy-section">
        <h2>Non-Returnable Items</h2>
        <p>For hygiene and safety standards, the following products cannot be returned:</p>
        <ul className="policy-list">
          <li>Custom-tailored or personalized garments.</li>
          <li>Innerwear, lingerie, and swimwear.</li>
          <li>Items marked as final clearance or flash sale.</li>
        </ul>
      </div>

      <div className="contact-box">
        <h3>Need Help With a Return?</h3>
        <p>Our support team is available Monday through Saturday to assist you.</p>
        <Link to="/contact" className="contact-link">Contact Support &rarr;</Link>
      </div>
    </div>
  );
};

export default ReturnPolicy;
