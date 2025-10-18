
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowDropright } from "react-icons/io";
import { FiUser, FiMail, FiMapPin, FiPhone, FiLink } from "react-icons/fi";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Pagination from "../components/Pagination/Pagination";
import { query_products } from "../store/Reducers/homeReducer";
import Seo from "../components/SEO/Seo";
import api from "../Api/api";
import SellerProductCard from "./Shop/SellerProductCard";

const DEFAULT_BANNER = "https://res.cloudinary.com/dpd5xwjqp/image/upload/v1760438023/Shop_kfdc0y.png";
const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=random&name=Shop";

const SellerProducts = () => {
  const { sellerId } = useParams();
  const dispatch = useDispatch();
  const { products, totalProduct, perPage } = useSelector((s) => s.home);

  const [pageNumber, setPageNumber] = useState(1);
  const [styles, setStyles] = useState("grid");
  const [sortPrice, setSortPrice] = useState("");

  const [seller, setSeller] = useState(null);
  const [bannerUrl, setBannerUrl] = useState("");
  const [loadingSeller, setLoadingSeller] = useState(false);
  const [sellerError, setSellerError] = useState("");

  const shopName = useMemo(
    () => seller?.shopInfo?.shopName || seller?.shopName || products?.[0]?.shopName || "This Shop",
    [seller, products]
  );

  const shopLogo = useMemo(() => {
    return (
      seller?.shopInfo?.logo ||
      seller?.shopInfo?.shopImage ||
      seller?.image ||
      seller?.avatar ||
      seller?.photo ||
      DEFAULT_AVATAR
    );
  }, [seller]);

  const shop = useMemo(() => {
    const info = seller?.shopInfo || {};
    return {
      owner: seller?.name || "-",
      email: seller?.email || "-",
      status: seller?.status || "-",
      division: info?.division || "-",
      district: info?.district || "-",
      subDistrict: info?.subDistrict || info?.area || "-",
      address: info?.address || "-",
      whatsapp: info?.whatsapp || "-",
      businessPage: info?.businessPage || "",
      joined: seller?.createdAt ? new Date(seller.createdAt).toLocaleString() : "-"
    };
  }, [seller]);

  useEffect(() => {
    if (!sellerId) return;
    dispatch(query_products({ sellerId, pageNumber, sortPrice }));
  }, [sellerId, pageNumber, sortPrice, dispatch]);

  useEffect(() => {
    setPageNumber(1);
  }, [sellerId]);

  const normalizeSeller = (raw) => {
    if (!raw) return null;
    const s = raw.seller || raw.user || raw.userInfo || raw;
    if (!s) return null;
    const info = s.shopInfo || {};
    return {
      _id: s._id || s.id,
      name: s.name || "",
      email: s.email || "",
      status: s.status || "",
      image: s.image || s.avatar || s.photo || "",
      createdAt: s.createdAt || s.joinedAt || null,
      shopInfo: {
        shopName: info.shopName || s.shopName || "",
        banner:
          info.banner ||
          info.cover ||
          info.coverImage ||
          info.headerImage ||
          s.coverImage ||
          s.shopBanner ||
          s.shopImage ||
          "",
        logo: info.logo || info.shopImage || s.image || s.avatar || "",
        businessPage: info.businessPage || "",
        whatsapp: info.whatsapp || "",
        division: info.division || "",
        district: info.district || "",
        subDistrict: info.subDistrict || info.area || "",
        address: info.address || ""
      }
    };
  };

  useEffect(() => {
    if (!sellerId) return;
    let mounted = true;

    const tryUrls = [
      `/profile/${sellerId}`,                  // correct for app.use('/api', sellerRoute)
      `/admin/seller/profile/${sellerId}`,     // fallbacks if needed
      `/dashboard/seller/profile/${sellerId}`
    ];

    const fetchProfile = async () => {
      setLoadingSeller(true);
      setSellerError("");
      for (const u of tryUrls) {
        try {
          const { data } = await api.get(u, { withCredentials: false });
          const ns = normalizeSeller(data);
          if (ns) {
            if (!mounted) return;
            setSeller(ns);
            setBannerUrl(ns.shopInfo.banner || "");
            setLoadingSeller(false);
            return;
          }
        } catch {
          // try next
        }
      }
      if (mounted) {
        setSeller(null);
        setBannerUrl("");
        setSellerError("Failed to load seller profile");
        setLoadingSeller(false);
      }
    };

    fetchProfile();
    return () => {
      mounted = false;
    };
  }, [sellerId]);

  return (
    <div>
      <Seo
        title={`${shopName} - All Products`}
        description={`All products from ${shopName}`}
        type="website"
      />
      <Header />

      {/* Hero / Banner */}
      <section
        className="relative w-full bg-cover bg-center md:h-[320px] h-[260px]"
        style={{ backgroundImage: `url("${bannerUrl || DEFAULT_BANNER}")` }}
      >
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />

        {/* content */}
        <div className="relative z-10 w-full md:w-[95%] mx-auto h-full flex items-end">
          <div className="w-full px-3 md:px-0 pb-4 md:pb-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Left: Logo + Title + Crumbs + Badges */}
              <div className="md:col-span-7">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="relative">
                    <img
                      src={shopLogo}
                      alt={shopName}
                      className="w-14 h-14 md:w-20 md:h-20 rounded-full object-cover ring-2 ring-white/60 shadow-md bg-white/30"
                      onError={(e) => { e.currentTarget.src = DEFAULT_AVATAR; }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-white text-2xl md:text-3xl font-extrabold leading-tight drop-shadow">
                      {shopName} <span className="opacity-90">— All Products</span>
                    </h1>
                    <div className="flex items-center gap-2 text-white/90 text-sm mt-1">
                      <Link to="/" className="hover:underline">Home</Link>
                      <IoIosArrowDropright />
                      <Link to="/shop" className="hover:underline">Shop</Link>
                      <IoIosArrowDropright />
                      <span className="truncate">{shopName}</span>
                    </div>

                    {/* badges */}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/40 text-xs">
                        Status: <b className="capitalize">{shop.status}</b>
                      </span>
                      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-400/40 text-xs">
                        Products: <b>{totalProduct || 0}</b>
                      </span>
                      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-slate-500/20 text-slate-200 ring-1 ring-slate-400/40 text-xs">
                        Joined: <b>{shop.joined}</b>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Details (Glass card) */}
              <div className="md:col-span-5">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl">
                  <div className="p-4 md:p-5">
                    {loadingSeller ? (
                      <div className="space-y-2">
                        <div className="h-4 w-2/3 bg-white/20 rounded animate-pulse" />
                        <div className="h-4 w-1/2 bg-white/20 rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-white/20 rounded animate-pulse" />
                      </div>
                    ) : sellerError ? (
                      <div className="text-sm text-rose-200">{sellerError}</div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 gap-2 text-sm text-white">
                          <InfoRow icon={<FiUser />} label="Owner" value={shop.owner} />
                          <InfoRow icon={<FiMail />} label="Email" value={shop.email} mono />
                          <InfoRow icon={<FiMapPin />} label="Division" value={shop.division} />
                          <InfoRow icon={<FiMapPin />} label="District" value={shop.district} />
                          <InfoRow icon={<FiMapPin />} label="Area" value={shop.subDistrict} />
                          <InfoRow icon={<FiPhone />} label="WhatsApp" value={shop.whatsapp} />
                          <InfoRow icon={<FiMapPin />} label="Address" value={shop.address} wrap />
                        </div>

                        {shop.businessPage ? (
                          <div className="mt-3">
                            <a
                              href={shop.businessPage}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white shadow-md transition"
                            >
                              <FiLink /> Visit Business Page
                            </a>
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-6 md:py-10">
        <div className="w-full md:w-[95%] mx-auto">
          <div className="bg-white mb-6 px-3 py-2 rounded-md flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-slate-200 shadow-sm">
            <h2 className="text-sm font-medium text-slate-600">
              {products?.length} of {totalProduct} Products
            </h2>
            <div className="flex items-center gap-3">
              <select
                onChange={(e) => setSortPrice(e.target.value)}
                value={sortPrice}
                className="p-2 border rounded-md outline-none text-slate-700 bg-white hover:border-slate-400"
                id="sort-price"
                name="sortPrice"
              >
                <option value="">Sort by</option>
                <option value="low-to-high">Low to High Price</option>
                <option value="high-to-low">High to Low Price</option>
              </select>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStyles("grid")}
                  className={`px-3 py-1.5 rounded-md border text-sm ${styles === "grid" ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-300 hover:border-slate-400"
                    }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setStyles("list")}
                  className={`px-3 py-1.5 rounded-md border text-sm ${styles === "list" ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-300 hover:border-slate-400"
                    }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          <SellerProductCard styles={styles} products={products} />

          {totalProduct > perPage && (
            <div className="mt-6">
              <Pagination
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                totalItem={totalProduct}
                perPage={perPage}
                showItem={Math.floor(totalProduct / perPage)}
              />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Small presentational component for rows inside glass card
const InfoRow = ({ icon, label, value, mono = false, wrap = false }) => (
  <div className="grid grid-cols-[120px_1fr] gap-3 items-start">
    <span className="inline-flex items-center gap-2 text-white/80">
      <span className="text-white/90">{icon}</span>
      <span className="text-white/80">{label}</span>
    </span>
    <span
      className={`font-medium ${mono ? 'break-all' : ''} ${wrap ? 'break-words' : 'truncate'}`}
      title={typeof value === 'string' ? value : ''}
    >
      {value || '-'}
    </span>
  </div>
);

export default SellerProducts;