import { AiFillHeart, AiOutlineShoppingCart } from 'react-icons/ai';
import { FaEye } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Ratings from '../../components/Ratings/Ratings';
import { useSelector, useDispatch } from 'react-redux';
import {
  get_wishlist_products,
  messageClear,
  remove_wishlist,
  add_to_card, // NEW
} from '../../store/Reducers/cardReducer';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const FALLBACK_IMG = 'https://placehold.co/400x500?text=No+Image';
const BRAND = '#0d6b54';

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { wishlist, successMessage, errorMessage } = useSelector((state) => state.card);

  useEffect(() => {
    if (userInfo?.id) dispatch(get_wishlist_products(userInfo.id));
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  const onImgError = (e) => {
    e.currentTarget.src = FALLBACK_IMG;
  };

  const onAddToCart = (item) => {
    if (!userInfo?.id) {
      navigate('/login');
      return;
    }
    // wishlist এ productId না থাকলে বা variant নেই — details এ নিন
    if (!item?.productId || item?.productId === 'undefined') {
      navigate(`/product/details/${item?.slug || item?.name || ''}`);
      return;
    }
    // variant দরকার হলে item.color/size না থাকলে details এ যান
    const needVariant = (item?.needVariant === true); // optional flag (না থাকলে নিচের চেকই যথেষ্ট)
    const missingVariant =
      needVariant ||
      (item?.hasVariant && (!item?.color && !item?.size)) ||
      (item?.colorRequired && !item?.color) ||
      (item?.sizeRequired && !item?.size);

    if (missingVariant) {
      navigate(`/product/details/${item?.slug || item?.name || ''}`);
      return;
    }

    dispatch(
      add_to_card({
        userId: userInfo.id,
        productId: item.productId,
        quantity: 1,
        color: item?.color || '',
        size: item?.size || '',
      })
    );
  };

  const itemsCount = wishlist?.length || 0;

  if (!itemsCount) {
    return (
      <div className="w-full bg-white border border-slate-200 rounded-xl p-8 text-center">
        <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center">
          <AiFillHeart size={22} />
        </div>
        <h3 className="text-slate-800 text-lg font-semibold">Your wishlist is empty</h3>
        <p className="text-slate-500 text-sm mt-1">Browse the shop and add items you love.</p>
        <Link
          to="/shop"
          className="inline-block mt-4 px-4 py-2 rounded-md"
          style={{ background: BRAND, color: '#fff' }}
        >
          Explore products
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-slate-800 text-lg md:text-xl font-semibold">My Wishlist</h2>
          <p className="text-slate-500 text-sm">{itemsCount} item{itemsCount > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {wishlist?.map((p, i) => (
          <div
            key={p?._id || i}
            className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Image area */}
            <div className="relative bg-white aspect-[4/5]">
              {Number(p?.discount || 0) > 0 && (
                <div
                  className="absolute left-2 top-2 text-white text-xs font-semibold rounded-full h-[38px] w-[38px] grid place-items-center shadow"
                  style={{ background: '#ef4444' }}
                  title={`-${p.discount}%`}
                >
                  {p.discount}%
                </div>
              )}

              <img
                className="w-full h-full object-cover"
                src={p?.image || FALLBACK_IMG}
                alt={p?.name || 'product'}
                onError={onImgError}
                loading="lazy"
              />

              {/* Hover actions */}
              <div className="absolute left-0 right-0 -bottom-10 opacity-0 group-hover:opacity-100 group-hover:bottom-3 transition-all duration-300">
                <ul className="flex items-center justify-center gap-2">
                  {/* Remove */}
                  <li
                    onClick={() => dispatch(remove_wishlist(p?._id))}
                    className="w-[38px] h-[38px] bg-white text-slate-700 flex justify-center items-center rounded-full hover:shadow hover:scale-[1.05] transition cursor-pointer"
                    title="Remove from wishlist"
                    aria-label="Remove"
                    style={{ border: '1px solid #e5e7eb' }}
                  >
                    <AiFillHeart className="text-rose-500" />
                  </li>

                  {/* View details */}
                  <Link
                    to={`/product/details/${p?.slug || p?.name}`}
                    className="w-[38px] h-[38px] bg-white text-slate-700 flex justify-center items-center rounded-full hover:shadow hover:scale-[1.05] transition"
                    title="View details"
                    aria-label="View"
                    style={{ border: '1px solid #e5e7eb' }}
                  >
                    <FaEye />
                  </Link>

                  {/* Add to cart */}
                  <li
                    onClick={() => onAddToCart(p)}
                    className="w-[38px] h-[38px] bg-white text-slate-700 flex justify-center items-center rounded-full hover:shadow hover:scale-[1.05] transition cursor-pointer"
                    title="Add to cart"
                    aria-label="Add to cart"
                    style={{ border: '1px solid #e5e7eb' }}
                  >
                    <AiOutlineShoppingCart />
                  </li>
                </ul>
              </div>
            </div>

            {/* Info */}
            <div className="p-3 text-slate-700">
              <h3 className="text-sm md:text-[15px] font-medium text-slate-800 line-clamp-2 min-h-[36px]">
                {p?.name || 'Product'}
              </h3>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-[15px] md:text-base font-semibold" style={{ color: BRAND }}>
                  TK {p?.price ?? 0}
                </span>
                <div className="flex">
                  <Ratings ratings={p?.rating || 0} />
                </div>
              </div>

              {/* Variant tags (if saved in wishlist) */}
              {(p?.color || p?.size) && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {p?.color && (
                    <span className="px-2 py-0.5 text-xs rounded bg-slate-100 border border-slate-200">
                      Color: {p.color}
                    </span>
                  )}
                  {p?.size && (
                    <span className="px-2 py-0.5 text-xs rounded bg-slate-100 border border-slate-200">
                      Size: {p.size}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;