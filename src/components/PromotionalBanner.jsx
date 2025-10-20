import React from "react";
import { Link } from "react-router-dom";

// Hero background
const BANNER_IMAGE =
  "https://res.cloudinary.com/dpd5xwjqp/image/upload/v1760955660/MM_Fashion_world_-_a_buy_and_sell_platform_for_reselling_and_retails_customers_reg_krhqef.png";

// Reseller focused quick links
const quickLinks = [
  { name: "Customer Products", icon: "🛍️", path: "/shop" },
  { name: "Reseller Products", icon: "📦", path: "/shop" },
  { name: "Dropship & Bulk", icon: "🚛", path: "/shop" },
  { name: "Support & Training", icon: "🎓", path: "#" },
];

// Benefit badges
const benefits = [
  { icon: "💰", text: "কমিশন আপ-টু 40%" },
  { icon: "📦", text: "স্টক ছাড়াই বিক্রি করুন" },
  { icon: "🚚", text: "সারা বাংলাদেশে COD" },
  { icon: "⚡", text: "সেইম-ডে ডিসপ্যাচ" },
  { icon: "🤝", text: "ড্রপশিপ + বাল্ক ডিল" },
];

const CTA_WHATSAPP =
  "https://wa.me/8801749889595?text=" +
  encodeURIComponent("Hi! I want to join as a Reseller with MM Fashion World.");

const PromotionalBanner = () => {
  return (
    <section className="hero-banner-container">
      <style jsx="true">{`
        /* Design tokens */
        .hero-banner-container {
          --brand: #0d6b54;
          --brand-600: #0f6b5a;
          --accent: #ff4747;
          --accent-700: #e03e3e;
          --surface: #ffffff;
          --muted: #f8fafc;
          --line: #eef1f6;
          --text: #0f172a;
          --text-weak: #334155;
          --radius: 12px;
        }

        .hero-banner-container {
          width: 95%;
          margin: 20px auto;
          background-color: var(--surface);
          border-radius: var(--radius);
          box-shadow: 0 10px 30px rgba(2, 6, 23, 0.08);
          overflow: hidden;
          min-height: 420px;
          border: 1px solid var(--line);
        }

        .banner-content-wrapper {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 1px;
          position: relative;
        }

        /* Sidebar */
        .banner-sidebar {
          background-color: var(--muted);
          padding: 16px 0;
          border-right: 1px solid var(--line);
        }
        .sidebar-title {
          font-weight: 700;
          font-size: 13px;
          color: var(--brand);
          padding: 8px 16px 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          font-size: 14px;
          color: var(--text-weak);
          text-decoration: none;
          transition: background-color 0.2s ease, color 0.2s ease, border-left-color 0.2s;
          border-left: 3px solid transparent;
        }
        .sidebar-link:hover,
        .sidebar-link:focus-visible {
          background-color: #eefcf9;
          color: var(--brand);
          border-left-color: #10b981;
          outline: none;
        }

        /* Main banner */
        .main-banner-area {
          background-image: url(${BANNER_IMAGE});
          background-size: cover;
          background-position: center;
          position: relative;
          display: flex;
          align-items: center;
          min-height: 420px;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(2, 6, 23, 0.65) 0%,
            rgba(2, 6, 23, 0.45) 40%,
            rgba(2, 6, 23, 0.2) 100%
          );
          z-index: 1;
        }

        /* Content */
        .content-wrap {
          position: relative;
          z-index: 2;
          width: 100%;
          padding: 32px 40px;
          display: flex;
          align-items: center;
        }
        .content-card {
          color: #fff;
          max-width: 680px;
        }

        .kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.45);
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.4px;
          margin-bottom: 10px;
        }

        .banner-title {
          font-size: 40px;
          line-height: 1.15;
          font-weight: 900;
          margin: 6px 0 10px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
        }
        .banner-sub {
          font-size: 18px;
          opacity: 0.96;
          margin-bottom: 18px;
          font-weight: 500;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        /* Benefits */
        .benefit-list {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin: 14px 0 20px;
          padding: 0;
          list-style: none;
        }
        .benefit-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 10px;
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
        }

        /* CTAs */
        .cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 6px;
        }
        .btn {
          padding: 12px 22px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 800;
          font-size: 15px;
          letter-spacing: 0.2px;
          transition: transform 0.12s ease, box-shadow 0.2s ease, background 0.2s, color 0.2s;
          border: 1px solid rgba(255, 255, 255, 0.2);
          outline: none;
        }
        .btn:focus-visible {
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.35);
        }
        .btn-primary {
          background-color: var(--accent);
          color: #fff;
          box-shadow: 0 8px 0 #d63a3a;
        }
        .btn-primary:hover {
          background-color: var(--accent-700);
          transform: translateY(1px);
          box-shadow: 0 6px 0 #d63a3a;
        }
        .btn-ghost {
          background-color: rgba(255, 255, 255, 0.12);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.45);
        }
        .btn-ghost:hover {
          background-color: rgba(255, 255, 255, 0.22);
        }
        .btn-whatsapp {
          background-color: #10b981;
          color: #fff;
          box-shadow: 0 8px 0 #0e9f75;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        .btn-whatsapp:hover {
          background-color: #0ea371;
          transform: translateY(1px);
          box-shadow: 0 6px 0 #0e9f75;
        }

        /* Ribbon (subtle, standard) */
        .ribbon {
          position: absolute;
          z-index: 2;
          top: 12px;
          left: 12px;
          background: var(--brand);
          color: #fff;
          padding: 6px 10px;
          font-weight: 800;
          font-size: 12px;
          letter-spacing: 0.4px;
          border-radius: 6px;
          opacity: 0.95;
        }

        /* Trust strip */
        .trust-strip {
          position: absolute;
          z-index: 2;
          right: 16px;
          bottom: 14px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .trust-chip {
          background: rgba(255, 255, 255, 0.92);
          color: var(--text);
          border: 1px solid var(--line);
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .benefit-list {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 1024px) {
          .banner-content-wrapper {
            grid-template-columns: 1fr;
          }
          .banner-sidebar {
            display: none;
          }
          .main-banner-area {
            min-height: 380px;
          }
          .content-wrap {
            padding: 26px;
          }
          .banner-title {
            font-size: 34px;
          }
          .banner-sub {
            font-size: 16px;
          }
        }
        @media (max-width: 520px) {
          .banner-title {
            font-size: 28px;
          }
          .benefit-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="banner-content-wrapper">
        {/* Sidebar: Reseller quick links */}
        <aside className="banner-sidebar" aria-label="Reseller quick links">
          <div className="sidebar-title">Reseller Quick Links</div>
          {quickLinks.map((link) => (
            <Link key={link.name} to={link.path} className="sidebar-link">
              <span aria-hidden="true" style={{ fontSize: 16 }}>
                {link.icon}
              </span>
              <span>{link.name}</span>
            </Link>
          ))}
        </aside>

        {/* Main hero */}
        <div className="main-banner-area" role="img" aria-label="Reseller program banner">
          <div className="overlay" />
          <div className="ribbon">Reseller Program 2025 • Open</div>

          <div className="content-wrap">
            <div className="content-card">
              <div className="kicker">🔥 সীমিত সময়ের জন্য দ্রুত অনবোর্ডিং</div>
              <h1 className="banner-title">আপনার নিজের রিসেলিং বিজনেস শুরু করুন</h1>
              <p className="banner-sub">
                MM Fashion World-এর সাথে স্টক ছাড়াই বিক্রি করুন — কমিশন আপ-টু 40%, COD সার্ভিস,
                সেইম-ডে ডিসপ্যাচ এবং রেডিমেড কন্টেন্ট প্যাক!
              </p>

              <ul className="benefit-list">
                {benefits.map((b) => (
                  <li key={b.text} className="benefit-item">
                    <span aria-hidden="true" style={{ fontSize: 18 }}>
                      {b.icon}
                    </span>
                    <span>{b.text}</span>
                  </li>
                ))}
              </ul>

              <div className="cta-row">
                <Link
                  to={`${import.meta.env.VITE_DASHBOARD_URL}/login`}
                  className="btn btn-primary"
                  aria-label="Join as reseller"
                >
                  Join as Reseller
                </Link>

                <Link to="/shop" className="btn btn-ghost" aria-label="Get reseller products">
                  Get Reseller Products
                </Link>

                <a
                  href={CTA_WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  aria-label="Join reseller WhatsApp"
                >
                  Join WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="trust-strip flex md:flex-row flex-col justify-end" aria-label="Assurance">
            <div className="trust-chip">✔️ Verified Suppliers</div>
            <div className="trust-chip">💳 COD Support</div>
            <div className="trust-chip">📦 Drop‑ship Ready</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanner;