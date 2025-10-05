import React from "react";
import { Link } from "react-router-dom";

const FALLBACK_IMG = "https://via.placeholder.com/600x450?text=Image";

const FeaturesProduct = ({ products = [] }) => {
  // Safe helpers
  const img0 = (p) => (Array.isArray(p?.images) && p.images[0]) || FALLBACK_IMG;
  const title = (s, max = 22) => {
    const t = s || "Product";
    return t.length > max ? t.slice(0, max - 1) + "…" : t;
  };
  const toProduct = (p) => {
    const idOrSlug = p?.slug || p?._id;
    return idOrSlug ? `/product/details/${encodeURIComponent(idOrSlug)}` : "#";
  };

  // Ensure n items (placeholders if less)
  const ensure = (arr, n) => {
    const out = [...(arr || [])].slice(0, n);
    while (out.length < n) {
      const i = out.length;
      out.push({ _id: `ph-${i}`, name: "Product", images: [FALLBACK_IMG], slug: "" });
    }
    return out;
  };

  // Split into 3 cards: 4+4+4 items
  const card1 = ensure(products.slice(0, 4), 4);
  const card2 = ensure(products.slice(4, 8), 4);
  const card3 = ensure(products.slice(8, 12), 4);

  // Reusable Card
  const Card = ({ heading, items, linkText = "See all deals", linkTo = "#" }) => (
    <div className="fp3-card bg-white border border-slate-200 p-4">
      <h3 className="fp3-title text-[20px] font-bold text-slate-900 mb-3">{heading}</h3>
      <div className="fp3-g2">
        {items.map((p, idx) => (
          <Link key={p?._id || p?.slug || `it-${idx}`} to={toProduct(p)} className="fp3-linkItem">
            <div className="fp3-img-2x2">
              <img
                src={img0(p)}
                alt={p?.name || "Product"}
                onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                className="fp3-img"
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="fp3-item-name">{title(p?.name)}</p>
          </Link>
        ))}
      </div>
      <Link to={linkTo} className="fp3-link"> {linkText} </Link>
    </div>
  );

  return (
    <section className="fp3-wrap">
      {/* Custom responsive CSS with your exact breakpoints */}
      <style>{`
        .fp3-wrap { width:95%; margin:0 auto; padding:16px 0; }
        .fp3-grid { display:grid; grid-template-columns:1fr; gap:16px; }

        .fp3-card { background:#fff; border:1px solid #e5e7eb; padding:16px; }
        .fp3-title { margin-bottom:12px; }
        .fp3-link { display:inline-block; margin-top:12px; color:#1d4ed8; font-weight:600; font-size:13px; text-decoration:none; }
        .fp3-link:hover { color:#ea580c; }

        .fp3-g2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .fp3-item-name { margin-top:6px; font-size:13px; color:#334155; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

        .fp3-img-2x2 { width:100%; height:130px; background:#f1f5f9; overflow:hidden; border-radius:6px; }
        .fp3-img { width:100%; height:100%; object-fit:cover; transition:opacity .2s ease; }
        .fp3-linkItem:hover .fp3-img { opacity:.95; }

        /* Breakpoints: 340, 480, 576, 768, 991, 1080, 1400 */
        @media (min-width:340px){ .fp3-img-2x2{ height:140px; } }
        @media (min-width:480px){ .fp3-img-2x2{ height:150px; } }
        @media (min-width:576px){ .fp3-img-2x2{ height:160px; } }
        @media (min-width:768px){
          .fp3-grid{ grid-template-columns: repeat(2, 1fr); gap:20px; }
          .fp3-img-2x2{ height:170px; }
        }
        @media (min-width:991px){ .fp3-img-2x2{ height:180px; } }
        @media (min-width:1080px){
          .fp3-grid{ grid-template-columns: repeat(3, 1fr); gap:24px; }
          .fp3-img-2x2{ height:185px; }
        }
        @media (min-width:1400px){ .fp3-img-2x2{ height:195px; } }
      `}</style>

      {/* Three cards side-by-side (responsive) */}
      <div className="fp3-grid">
        <Card
          heading="Shop Fashion for less"
          items={card1}
          linkText="See all deals"
          linkTo="/shop"
        />
        <Card
          heading="Shop for your Fashion"
          items={card2}
          linkText="Discover more"
          linkTo="shop"
        />
        <Card
          heading="Top categories"
          items={card3}
          linkText="Explore more products"
          linkTo="/shop"
        />
      </div>
    </section>
  );
};

export default FeaturesProduct;