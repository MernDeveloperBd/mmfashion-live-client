
import { FaCartPlus, FaEye, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import Ratings from "../../components/Ratings/Ratings";

const ShopProducts = ({ styles = "grid" , products}) => {
  // const [wishlist, setWishlist] = useState(new Set());
  const isGrid = styles === "grid";

/*   const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }; */

  const cardClass = `group relative overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isGrid ? "" : "flex"}`;
  const mediaClass = isGrid
    ? "relative overflow-hidden aspect-[4/3]"
    : "relative overflow-hidden w-5/12 md:w-2/5 h-44 md:h-56";
  const infoClass = isGrid ? "p-4" : "w-7/12 md:w-3/5 p-4 flex flex-col";

 

  return (
    <div className={`grid gap-5 ${isGrid ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
      {products?.map((product, i) => (
        <div key={i} className={cardClass}>
          {/* Media */}
          <div className={mediaClass}>
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-zinc-700 backdrop-blur">
              {product.category}
            </span>

            {product.discount > 0 && (
              <span className="absolute right-3 top-3 rounded-full bg-[#7faf39] px-2.5 py-1 text-xs font-bold text-white">
                -{product?.discount}%
              </span>
            )}

            {/* Hover actions */}
            <div className="absolute inset-x-0 bottom-2 flex translate-y-8 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <button
                aria-label="Add to wishlist"
                onClick={() => (product?._id)}
                className={`grid h-10 w-10 place-items-center rounded-full bg-white text-zinc-700 shadow-md ring-1 ring-black/5 transition hover:bg-[#7faf39] hover:text-white ${product?._id ? "bg-[#7faf39] text-white" : ""}`}
              >
                <FaRegHeart />
              </button>
              <Link
                to={`/product/details/${product?.slug}`}
                aria-label="Quick view"
                className="grid h-10 w-10 place-items-center rounded-full bg-white text-zinc-700 shadow-md ring-1 ring-black/5 transition hover:bg-[#7faf39] hover:text-white"
              >
                <FaEye />
              </Link>
              <button
                aria-label="Add to cart"
                
                className="grid h-10 w-10 place-items-center rounded-full bg-white text-zinc-700 shadow-md ring-1 ring-black/5 transition hover:bg-[#7faf39] hover:text-white"
              >
                <FaCartPlus />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className={infoClass}>
            <Link
              to={`/product/details/${product?.slug}`}
              className="truncate text-base font-semibold text-zinc-800 hover:text-[#7faf39]"
              title={product.name}
            >
              {product.name}
            </Link>
            <div className="flex justify-between items-center">
              <div className="mt-2 flex items-center gap-2">
              <span className="text-lg font-bold text-zinc-900">TK{product.price}</span>
              <span className="text-sm font-medium text-red-400 line-through">{product?.oldPrice}</span>
            </div>
              <div className="mt-1 text-sm font-semibold bg-[#0d6b54] text-white px-1.5 py-0.5 "> 
              TK {(product?.resellingPrice)}
            </div>
            </div>
            

            {/* Reselling price */}
            

            <div className="mt-2 flex items-center">
              <Ratings ratings={product?.rating} />
              <span className="ml-2 text-xs text-zinc-500">{product?.rating}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShopProducts;