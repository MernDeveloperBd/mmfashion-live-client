
import { FaCartPlus, FaEye, FaRegHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Ratings from "../../components/Ratings/Ratings";
import toast from 'react-hot-toast';
import { add_to_card, add_to_wishlist, messageClear } from '../../store/Reducers/cardReducer';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";

const SellerProductCard = ({ styles = "grid" , products}) => {
  // const [wishlist, setWishlist] = useState(new Set());
    const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);
  const { successMessage, errorMessage } = useSelector(state => state.card);
  const isGrid = styles === "grid";

   const add_card = (id) => {
    if (userInfo) {
      dispatch(add_to_card({ userId: userInfo.id, quantity: 1, productId: id }));
    } else {
      navigate('/login');
    }
  };

    const add_wishlist = (pro) => {
    if (!userInfo?.id) return navigate('/login');
    dispatch(add_to_wishlist({
      userId: userInfo.id,
      productId: pro._id,
      name: pro.name,
      price: pro.price,
      image: pro.images?.[0],
      discount: pro.discount,
      rating: pro.rating,
      slug: pro.slug
    }));
  };

   useEffect(() => {
    if (successMessage) { toast.success(successMessage); dispatch(messageClear()); }
    if (errorMessage)   { toast.error(errorMessage);   dispatch(messageClear()); }
  }, [dispatch, successMessage, errorMessage]);


  const cardClass = `group relative overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isGrid ? "" : "flex"}`;
  const mediaClass = isGrid
    ? "relative overflow-hidden aspect-[4/3]"
    : "relative overflow-hidden w-5/12 md:w-2/5 h-44 md:h-56";
  const infoClass = isGrid ? "p-4" : "w-7/12 md:w-3/5 p-4 flex flex-col";

 

  return (
    <div className={`grid gap-5 ${isGrid ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-4" : "grid-cols-1"}`}>
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
              <span className="absolute right-3 top-3 rounded-full bg-red-700 px-2.5 py-1 text-xs font-bold text-white">
                -{product?.discount}%
              </span>
            )}

            {/* Hover actions */}
            <div className="absolute inset-x-0 bottom-2 flex translate-y-8 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <button
                aria-label="Add to wishlist"
                onClick={() => add_wishlist(product)}
                className={`grid h-10 w-10 place-items-center rounded-full bg-white text-zinc-700 shadow-md ring-1 ring-black/5 transition hover:bg-[#7faf39] cursor-pointer hover:text-white ${product?._id ? "bg-[#7faf39] text-white" : ""}`}
              >
                <FaRegHeart />
              </button>
              <Link
                to={`/product/details/${product.slug}`}
                aria-label="Quick view"
                className="grid h-10 w-10 place-items-center rounded-full bg-white text-zinc-700 shadow-md ring-1 ring-black/5 transition hover:bg-[#7faf39] hover:text-white"
              >
                <FaEye />
              </Link>
              <button
                aria-label="Add to cart"
                onClick={() => add_card(product._id)}
                className="grid h-10 w-10 place-items-center rounded-full bg-white text-zinc-700 shadow-md ring-1 ring-black/5 transition hover:bg-[#7faf39] hover:text-white cursor-pointer"
              >
                <FaCartPlus />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className={infoClass}>
            <Link
             to={`/product/details/${product.slug}`}
              className="truncate text-base font-semibold text-zinc-800 hover:text-[#7faf39]"
              title={product.name}
            >
              {product.name}
            </Link>
            <div className="flex flex-col md:flex-row  md:justify-between items-start md:items-center">
              <div className="mt-2 flex items-center gap-2">
              <span className="text-lg font-bold text-zinc-900">TK{product.price}</span>
              {
                product?.oldPrice && <span className="text-sm font-medium text-red-400 line-through">{product?.oldPrice}</span>
              }              
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

export default SellerProductCard;