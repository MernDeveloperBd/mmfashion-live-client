import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowDropright } from "react-icons/io";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Pagination from "../components/Pagination/Pagination";
import { query_products } from "../store/Reducers/homeReducer";
import Seo from "../components/SEO/Seo";
import api from "../Api/api"; // আপনার প্রজেক্টে Api path যদি আলাদা হয়, সেটি দিন
import SellerProductCard from "./Shop/SellerProductCard";

const DEFAULT_BANNER = "https://res.cloudinary.com/dpd5xwjqp/image/upload/v1760438023/Shop_kfdc0y.png";

const SellerProducts = () => {
  const { sellerId } = useParams();
  const dispatch = useDispatch();
  const { products, totalProduct, perPage } = useSelector(s => s.home);

  const [pageNumber, setPageNumber] = useState(1);
  const [styles, setStyles] = useState("grid");
  const [sortPrice, setSortPrice] = useState("");

  // Seller profile state (for banner + shop name)
  const [seller, setSeller] = useState(null);
  const [bannerUrl, setBannerUrl] = useState("");

  // Shop name: first preference seller profile, fallback products
  const shopName = useMemo(
    () => seller?.shopName || products?.[0]?.shopName || "This Shop",
    [seller, products]
  );

  // Load products by seller
  useEffect(() => {
    if (!sellerId) return;
    dispatch(query_products({ sellerId, pageNumber, sortPrice }));
  }, [sellerId, pageNumber, sortPrice, dispatch]);

  // Reset page when sellerId changes
  useEffect(() => {
    setPageNumber(1);
  }, [sellerId]);

  // Fetch seller profile → use banner from profile (coverImage → shopBanner → shopImage → avatar/photo)
  useEffect(() => {
    if (!sellerId) return;
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get(`/seller/profile/${sellerId}`, { withCredentials: false });
        const s = data?.seller || data || null;
        if (!mounted) return;
        setSeller(s);
        const url =
          s?.coverImage ||
          s?.shopBanner ||
          s?.shopImage ||
          s?.avatar ||
          s?.photo ||
          "";
        setBannerUrl(url || "");
      } catch (e) {
        if (mounted) {
          setSeller(null);
          setBannerUrl("");
        }
      }
    })();
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

      {/* Banner / Breadcrumb */}
      <section
        className="h-[160px] md:h-[240px] w-full bg-cover bg-no-repeat relative"
        style={{ backgroundImage: `url("${bannerUrl || DEFAULT_BANNER}")` }}
      >
        <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">{shopName} - All Products</h2>
            <div className="flex items-center gap-2 justify-center">
              <Link to="/">Home</Link>
              <IoIosArrowDropright />
              <Link to="/shop">Shop</Link>
              <IoIosArrowDropright />
              <span>{shopName}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-6 md:py-12">
        <div className="w-full md:w-[95%] mx-auto">
          <div className="bg-white mb-6 px-2 py-2 rounded-md flex justify-between items-center border border-slate-200">
            <h2 className="text-sm font-medium text-slate-600">
              {products?.length} of {totalProduct} Products
            </h2>
            <div className="flex items-center gap-2">
              <select
                onChange={(e) => setSortPrice(e.target.value)}
                value={sortPrice}
                className="p-1 border outline-0 text-slate-600 font-semibold"
              >
                <option value="">Sort by</option>
                <option value="low-to-high">Low to High Price</option>
                <option value="high-to-low">High to Low Price</option>
              </select>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStyles("grid")}
                  className={`px-2 py-1 rounded ${styles === "grid" ? "bg-slate-200" : ""}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setStyles("list")}
                  className={`px-2 py-1 rounded ${styles === "list" ? "bg-slate-200" : ""}`}
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

export default SellerProducts;