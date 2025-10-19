import React from "react";
import { Link } from "react-router-dom";

// Placeholder Image (AliExpress/Amazon ধরনের ছবির জন্য একটি বড় ইমেজ ব্যবহার করা হয়েছে)
const BANNER_IMAGE = "https://res.cloudinary.com/dpd5xwjqp/image/upload/v1760552876/banners/uf3vdkwg0caphlqna6jn.jpg";

// দ্রুত অ্যাক্সেস আইটেম (সাইড মেনুর মতো)
const quickLinks = [
    { name: "Women Fashion", icon: "📱", path: "/shop?category=Women%20Fashion" },
    { name: "Men Fashion", icon: "👕", path: "/shop?category=Men%20Fashion" },
    { name: "Home Goods", icon: "🏡", path: "/shop?category=Home%20Decore" },
    { name: "Cosmetics", icon: "⚽", path: "/shop?category=Cosmetics" },
    { name: "Beauty & Health", icon: "💄", path: "/shop?category=Cosmetics" },
];


const PromotionalBanner = () => {
  return (
    <section className="hero-banner-container">
      <style jsx="true">{`
        .hero-banner-container {
          width: 95%;
          margin: 20px auto;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          min-height: 370px;
        }

        .banner-content-wrapper {
          display: grid;
          grid-template-columns: 280px 1fr; /* সাইডবার এবং মূল কন্টেন্টের জন্য */
          gap: 1px; /* গ্রিড লাইনের জন্য সামান্য গ্যাপ */
          position: relative;
        }

        /* --- সাইডবার স্টাইল (যেমন AliExpress ক্যাটাগরি) --- */
        .banner-sidebar {
          background-color: #f8f8f8;
          padding: 15px 0;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          padding: 8px 15px;
          font-size: 14px;
          color: #333;
          text-decoration: none;
          transition: background-color 0.2s;
        }

        .sidebar-link:hover {
          background-color: #eef;
          color: #0056b3;
        }
        
        .sidebar-link span:first-child {
            margin-right: 10px;
        }

        /* --- মূল ব্যানার স্টাইল (যেমন Amazon/AliExpress মূল স্লাইডার এরিয়া) --- */
        .main-banner-area {
          background-image: url(${BANNER_IMAGE });
          background-size: cover;
          background-position: center;
          padding: 50px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          position: relative;
        }

        /* ওভারলে যাতে টেক্সট ভালোভাবে দেখা যায় */
        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3); /* ডার্ক ওভারলে */
            z-index: 1;
        }

        .banner-text {
          z-index: 2;
          color: white;
          max-width: 500px;
        }

        .banner-text h1 {
          font-size: 48px;
          margin-bottom: 10px;
          line-height: 1.1;
          font-weight: 900;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
        }

        .banner-text p {
          font-size: 20px;
          margin-bottom: 25px;
          font-weight: 500;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
        }
        
        .cta-button {
          background-color: #ff4747; /* AliExpress/Amazon এর মতো উজ্জ্বল লাল */
          color: white;
          padding: 12px 25px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          font-size: 16px;
          transition: background-color 0.3s ease;
          box-shadow: 0 4px #d63a3a;
        }

        .cta-button:hover {
          background-color: #e03e3e;
          box-shadow: 0 2px #d63a3a;
          transform: translateY(2px);
        }

        /* --- মিডিয়া কোয়েরি (ছোট স্ক্রিনের জন্য) --- */
        @media (max-width: 1024px) {
            .banner-content-wrapper {
                grid-template-columns: 1fr; /* সাইডবার নিচে চলে যাবে */
            }
            .banner-sidebar {
                display: none; /* ছোট স্ক্রিনে সাইডবার লুকানো হলো */
            }
            .main-banner-area {
                min-height: 350px;
                padding: 40px 20px;
            }
             .banner-text h1 {
                font-size: 36px;
            }
        }
      `}</style>

      <div className="banner-content-wrapper">
        
        {/* বাম পাশের কুইক লিঙ্ক মেনু */}
        <div className="banner-sidebar">
            {quickLinks.map((link) => (
                <Link key={link.name} to={link.path} className="sidebar-link">
                    <span>{link.icon}</span>
                    {link.name}
                </Link>
            ))}
        </div>

        {/* মূল বিজ্ঞাপন এরিয়া */}
        <div className="main-banner-area">
            <div className="overlay"></div>
            <div className="banner-text">
                <h1>Huge Opportunity in here For Reseller!</h1>
                <p>Up to 40% OFF on top trending products. Limited stock available!</p>
                <Link to="/shop" className="cta-button">
                    Shop Now & Get Free Shipping
                </Link>
            </div>
            {/* এখানে আপনি ইমেজ স্লাইডার (Carousel) যুক্ত করতে পারেন */}
        </div>

      </div>
    </section>
  );
};

export default PromotionalBanner;