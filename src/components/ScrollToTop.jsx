// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollToTop({ smooth = false }) {
  const { pathname, hash } = useLocation();
  const action = useNavigationType(); // 'PUSH' | 'REPLACE' | 'POP'

  useEffect(() => {
    // যদি URL-এ #anchor থাকে, সেটা থাকলে ঐ এলিমেন্টে স্ক্রল
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
        return;
      }
    }

    // Back/Forward ('POP') বাদে বাকিতে টপে স্ক্রল
    if (action !== "POP") {
      window.scrollTo({ top: 0, left: 0, behavior: smooth ? "smooth" : "auto" });
    }
  }, [pathname, hash, action, smooth]);

  return null;
}