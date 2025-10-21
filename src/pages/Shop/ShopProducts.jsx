import { FaCartPlus, FaEye, FaRegHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Ratings from "../../components/Ratings/Ratings";
import toast from 'react-hot-toast';
import { add_to_card, add_to_wishlist, messageClear } from '../../store/Reducers/cardReducer';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";

const ShopProducts = ({ styles = "grid", products = [] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);
  const { successMessage, errorMessage } = useSelector(state => state.card);
  const isGrid = styles === "grid";

  // Helpers: বিভিন্ন সোর্স থেকে আসা product shape নিরাপদে হ্যান্ডল
  const getId = (p) => p?._id || p?.id || p?.productId || p?.product?._id || p?.product?.id;
  const getSlug = (p) => p?.slug || p?.seoSlug || p?.product?.slug;
  const getDetailsUrl = (p) => {
    const slug = getSlug(p);
    const id = getId(p);
    if (slug) return `/product/details/${slug}`;
    if (id)   return `/product/details/${id}`; // আপনার route যদি id-ও সাপোর্ট করে
    return '#';
  };
  const hasDetails = (p) => getDetailsUrl(p) !== '#';

  const getImage = (p) =>
    p?.images?.[0] ||
    p?.image ||
    p?.thumbnail ||
    p?.product?.images?.[0] ||
    "https://placehold.co/600x400?text=No+Image";

  const getName = (p) => p?.name || p?.title || p?.product?.name || "Product";
  const getPrice = (p) => p?.price ?? p?.sale_price ?? p?.product?.price ?? 0;
  const getOldPrice = (p) => p?.oldPrice ?? p?.regularPrice ?? p?.product?.oldPrice ?? 0;
  const getDiscount = (p) => p?.discount ?? p?.product?.discount ?? 0;
  const getRating = (p) => p?.rating ?? p?.ratings ?? p?.product?.rating ?? 0;
  const getCategoryName = (p) =>
    p?.category?.name || p?.categoryName || p?.category || p?.product?.category?.name || "";

  const add_card = (p) => {
    if (userInfo) {
      const pid = getId(p);
      if (!pid) return toast.error("Product ID missing");
      dispatch(add_to_card({ userId: userInfo.id, quantity: 1, productId: pid }));
    } else {
      navigate('/login');
    }
  };

  const add_wishlist = (p) => {
    if (!userInfo?.id) return navigate('/login');
    const pid = getId(p);
    if (!pid) return toast.error("Product ID missing");
    dispatch(add_to_wishlist({
      userId: userInfo.id,
      productId: pid,
      name: getName(p),
      price: getPrice(p),
      image: p?.images?.[0] || p?.image || p?.thumbnail || p?.product?.images?.[0],
      discount: getDiscount(p),
      rating: getRating(p),
      slug: getSlug(p) || ""
    }));
  };

  useEffect(() => {
    if (successMessage) { toast.success(successMessage); dispatch(messageClear()); }
    if (errorMessage)   { toast.error(errorMessage);   dispatch(messageClear()); }
  }, [dispatch, successMessage, errorMessage]);

  const cardClass = `group relative overflow-hidden rounded border border-zinc-100 bg-white shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isGrid ? "" : "flex"}`;
  const mediaClass = isGrid
    ? "relative overflow-hidden aspect-[4/3]"
    : "relative overflow-hidden w-5/12 md:w-2/5 h-44 md:h-56";
  const infoClass = isGrid ? "p-4" : "w-7/12 md:w-3/5 p-4 flex flex-col";

  return (
    <div className={`grid gap-5 ${isGrid ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
      {products?.map((product, i) => {
        const detailsUrl = getDetailsUrl(product);
        const pid = getId(product);
        const clickable = detailsUrl !== '#';

        return (
          <div key={getId(product) || product?.slug || i} className={cardClass}>
            {/* Media */}
            <div className={mediaClass}>
              <img
                src={getImage(product)}
                alt={getName(product)}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e) => { e.currentTarget.src = "https://placehold.co/600x400?text=No+Image"; }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {getCategoryName(product) ? (
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-zinc-700 backdrop-blur">
                  {getCategoryName(product)}
                </span>
              ) : null}

              {getDiscount(product) > 0 && (
                <span className="absolute right-3 top-3 rounded-full bg-red-700 px-2.5 py-1 text-xs font-bold text-white">
                  -{getDiscount(product)}%
                </span>
              )}

              {/* Hover actions */}
              <div className="absolute inset-x-0 bottom-2 flex translate-y-8 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <button
                  aria-label="Add to wishlist"
                  onClick={() => add_wishlist(product)}
                  className={`grid h-10 w-10 place-items-center rounded-full bg-white text-zinc-700 shadow-md ring-1 ring-black/5 transition hover:bg-[#7faf39] cursor-pointer hover:text-white ${pid ? "" : "opacity-60"}`}
                  disabled={!pid}
                >
                  <FaRegHeart />
                </button>

                <Link
                  to={detailsUrl}
                  onClick={(e) => {
                    if (!clickable) {
                      e.preventDefault();
                      toast.error("Product link not available");
                    }
                  }}
                  aria-label="Quick view"
                  className={`grid h-10 w-10 place-items-center rounded-full bg-white text-zinc-700 shadow-md ring-1 ring-black/5 transition hover:bg-[#7faf39] hover:text-white ${clickable ? "" : "opacity-60 cursor-not-allowed"}`}
                >
                  <FaEye />
                </Link>

                <button
                  aria-label="Add to cart"
                  onClick={() => add_card(product)}
                  className={`grid h-10 w-10 place-items-center rounded-full bg-white text-zinc-700 shadow-md ring-1 ring-black/5 transition hover:bg-[#7faf39] hover:text-white cursor-pointer ${pid ? "" : "opacity-60"}`}
                  disabled={!pid}
                >
                  <FaCartPlus />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className={infoClass}>
              <Link
                to={detailsUrl}
                onClick={(e) => {
                  if (!clickable) {
                    e.preventDefault();
                    toast.error("Product link not available");
                  }
                }}
                className={`truncate text-base font-semibold text-zinc-800 hover:text-[#7faf39] ${clickable ? "" : "cursor-not-allowed"}`}
                title={getName(product)}
              >
                {getName(product)}
              </Link>

              <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm md:text-md font-bold text-zinc-900">TK {getPrice(product)}</span>
                  {getOldPrice(product) > 0 && (
                    <span className="text-sm font-medium text-red-400 line-through">TK {getOldPrice(product)}</span>
                  )}
                </div>
              </div>

                {
              product?.rating > 0 && <div className="mt-2 flex items-center">
                <Ratings ratings={product?.rating} />
                <span className="ml-2 text-xs text-zinc-500">({product?.rating})</span>
              </div>
            }
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShopProducts;