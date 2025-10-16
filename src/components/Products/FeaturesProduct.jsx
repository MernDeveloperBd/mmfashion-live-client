import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillHeart, AiOutlineShoppingCart } from 'react-icons/ai';
import { FaEye } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { add_to_card, add_to_wishlist, messageClear } from '../../store/Reducers/cardReducer';

const FeatureProducts = ({ products = [] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);
  const { successMessage, errorMessage } = useSelector(state => state.card);

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

  const fmtTk = (n) => `TK ${Number(n || 0).toLocaleString()}`;

  return (
    <div className="w-full">
      <div className="w-full flex justify-center">
        <div className="text-center flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Featured Products</h2>
          <div className="w-[100px] h-[3px] bg-emerald-500 mt-3 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 px-2 sm:px-3 md:px-4">
        {products?.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-x-4 gap-y-6">
            {products.slice(0, 10).map((p, i) => {
              const discount = Number(p?.discount) || 0;
              const price    = Number(p?.price) || 0;
              const original = discount > 0 && price > 0
                ? Math.round(price / (1 - discount / 100))
                : null;
              const img = p?.images?.[0];

              return (
                <div
                  key={p?._id || i}
                  className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-[2px] transition flex flex-col h-full"
                >
                  {/* Image wrapper (fixed height for alignment) */}
                  <div className="relative bg-white flex items-center justify-center h-42 sm:h-48 md:h-52 ">
                    {discount > 0 && (
                      <div className="absolute z-10 left-2 top-2 px-2 h-6 rounded bg-rose-600 text-white text-[11px] font-semibold shadow flex items-center">
                        {discount}% off
                      </div>
                    )}

                    <Link to={`/product/details/${p.slug}`} className=" w-full h-full flex items-center justify-center">
                      <img
                        src={img || 'https://via.placehold.co//320x320?text=No+Image'}
                        alt={p?.name || 'Product'}
                        loading="lazy"
                        className="max-h-full w-full object-cover"
                        width={320}
                        height={290}
                        onError={(e) => { e.currentTarget.src = 'https://via.placehold.co//320x320?text=No+Image'; }}
                      />
                    </Link>

                    {/* Quick actions (top-right) — now includes Add to Cart */}
                    <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition z-10">
                      <button
                        onClick={() => add_wishlist(p)}
                        title="Add to wishlist"
                        className="fCBtn"
                        aria-label="Add to wishlist"
                      >
                        <AiFillHeart />
                      </button>
                      <Link
                        to={`/product/details/${p.slug}`}
                        title="View details"
                        className="fCBtn"
                        aria-label="View details"
                      >
                        <FaEye />
                      </Link>
                      <button
                        onClick={() => add_card(p._id)}
                        title="Add to cart"
                        className="fCBtn"
                        aria-label="Add to cart"
                      >
                        <AiOutlineShoppingCart />
                      </button>
                    </div>
                  </div>

                  {/* Info block */}
                  <div className="p-3 flex flex-col flex-1">
                    <Link to={`/product/details/${p.slug}`}>
                      {/* Title fixed height for alignment */}
                      <h3 className="text-sm md:text-[15px] text-slate-900 font-medium leading-5 h-[38px] md:h-[44px] overflow-hidden">
                        {p?.name || 'Product'}
                      </h3>
                    </Link>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm md:text-base font-semibold text-slate-900">
                        {fmtTk(price)}
                      </span>
                      {original && (
                        <span className="text-xs md:text-sm text-gray-500 line-through">
                          {fmtTk(original)}
                        </span>
                      )}                      
                    </div>

                    {/* Spacer to keep equal height even without bottom button */}
                    <div className="flex-1" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-slate-500 py-10">No featured products to show</div>
        )}
      </div>
    </div>
  );
};

export default FeatureProducts;