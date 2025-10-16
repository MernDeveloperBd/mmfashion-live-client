import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import toast from "react-hot-toast";
import { IoIosArrowDropright } from "react-icons/io";
import Footer from "../../components/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import {
  delete_card_product,
  get_card_products,
  messageClear,
  quantity_dec,
  quantity_inc,
} from "../../store/Reducers/cardReducer";
import { useEffect } from "react";

const FALLBACK_IMG = "https://placehold.co/160x160?text=No+Image";

const Card = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    card_products,
    successMessage,
    price,
    buy_product_item,
    shipping_fee,
    outofstock_products,
  } = useSelector((state) => state.card);

  const redirect = () => {
    navigate("/shipping", {
      state: {
        products: card_products,
        price,
        shipping_fee,
        items: buy_product_item,
      },
    });
  };

  useEffect(() => {
    if (userInfo?.id) {
      dispatch(get_card_products(userInfo.id));
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      if (userInfo?.id) dispatch(get_card_products(userInfo.id));
    }
  }, [dispatch, userInfo, successMessage]);

  const inc = (quantity, stock, card_id) => {
    const temp = quantity + 1;
    if (temp <= stock) dispatch(quantity_inc(card_id));
  };
  const dec = (quantity, card_id) => {
    const temp = quantity - 1;
    if (temp !== 0) dispatch(quantity_dec(card_id));
  };

  const hasItems = (card_products?.length || 0) > 0 || (outofstock_products?.length || 0) > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero / Breadcrumb */}
      <section className='bg-[url("https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759381526/profile/uutlizbmkivizmulakng.jpg")] h-[200px] md:h-[220px] w-full bg-cover bg-no-repeat bg-center relative'>
        <div className="absolute inset-0 bg-black/40">
          <div className="max-w-7xl mx-auto h-full px-4 flex flex-col items-center justify-center text-white">
            <h2 className="text-2xl font-bold">Shop by</h2>
            <div className="flex items-center gap-2 text-sm mt-1">
              <Link to="/">Home</Link>
              <IoIosArrowDropright />
              <span>Cart</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {hasItems ? (
            <div className="flex flex-col md:flex-row gap-6">
              {/* LEFT: Items */}
              <div className="w-full md:w-[67%]">
                <div className="flex flex-col gap-4">
                  {/* In-stock */}
                  {card_products?.length > 0 && (
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-200">
                        <h2 className="text-sm font-semibold text-emerald-600">
                          In Stock • {card_products.length}
                        </h2>
                      </div>

                      <div className="divide-y divide-slate-100">
                        {card_products.map((group, gi) => (
                          <div key={gi} className="p-4">
                            {/* Seller header */}
                            <div className="mb-3">
                              <h3 className="text-sm font-semibold text-slate-800">
                                {group?.shopName || "Shop"}
                              </h3>
                            </div>

                            <div className="flex flex-col gap-4">
                              {group?.products?.map((pp, i) => (
                                <div key={i} className="flex flex-col md:flex-row items-start md:items-stretch gap-4">
                                  {/* Left: image + info */}
                                  <div className="flex flex-1 gap-3">
                                    <div className="w-[90px] h-[90px] rounded border border-slate-200 overflow-hidden bg-white shrink-0">
                                      <img
                                        className="w-full h-full object-cover"
                                        src={pp?.productInfo?.images?.[0] || FALLBACK_IMG}
                                        alt={pp?.productInfo?.name || "product"}
                                        onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                                      />
                                    </div>
                                    <div className="pr-2 text-slate-700">
                                      <h4 className="text-sm font-medium">
                                        {pp?.productInfo?.name || "Product"}
                                      </h4>
                                      {pp?.productInfo?.brand && (
                                        <div className="text-xs text-slate-500">
                                          Brand: {pp?.productInfo?.brand}
                                        </div>
                                      )}
                                      {/* NEW: Variant chips */}
                                      {(pp?.color || pp?.size) && (
                                        <div className="mt-1 flex flex-wrap gap-2">
                                          {pp?.color && (
                                            <span className="px-2 py-0.5 text-xs rounded bg-slate-100 border border-slate-200">
                                              Color: {pp.color}
                                            </span>
                                          )}
                                          {pp?.size && (
                                            <span className="px-2 py-0.5 text-xs rounded bg-slate-100 border border-slate-200">
                                              Size: {pp.size}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Right: price + qty + delete */}
                                  <div className="flex flex-1 items-center justify-between gap-4">
                                    <div className="pl-0 md:pl-2">
                                      <div className="text-orange-500 font-semibold">
                                        TK {pp?.productInfo?.price ?? 0}
                                      </div>
                                      {Number(pp?.productInfo?.oldPrice || 0) > 0 && (
                                        <div className="text-xs line-through text-slate-400">
                                          TK {pp?.productInfo?.oldPrice}
                                        </div>
                                      )}
                                      {Number(pp?.productInfo?.discount || 0) > 0 && (
                                        <div className="text-xs text-rose-500">
                                          -{pp?.productInfo?.discount}%
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                      {/* quantity controls */}
                                      <div className="flex items-center bg-slate-100 border border-slate-200 rounded h-9">
                                        <button
                                          onClick={() => dec(pp.quantity, pp._id)}
                                          className="px-3 text-lg hover:bg-slate-200 cursor-pointer"
                                          type="button"
                                          aria-label="decrease"
                                        >
                                          -
                                        </button>
                                        <div className="min-w-[36px] text-center">{pp.quantity}</div>
                                        <button
                                          onClick={() => inc(pp.quantity, pp?.productInfo?.stock, pp._id)}
                                          className="px-3 text-lg hover:bg-slate-200 cursor-pointer"
                                          type="button"
                                          aria-label="increase"
                                        >
                                          +
                                        </button>
                                      </div>

                                      <button
                                        onClick={() => dispatch(delete_card_product(pp._id))}
                                        className="px-4 py-1.5 text-xs rounded bg-rose-500 hover:bg-rose-600 text-white cursor-pointer"
                                        type="button"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Out-of-stock */}
                  {outofstock_products?.length > 0 && (
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-200">
                        <h2 className="text-sm font-semibold text-rose-600">
                          Out of Stock • {outofstock_products.length}
                        </h2>
                      </div>

                      <div className="p-4 space-y-4">
                        {outofstock_products.map((p, i) => {
                          const prod = p?.products?.[0] || {};
                          return (
                            <div key={i} className="flex flex-col md:flex-row items-start md:items-stretch gap-4">
                              {/* Left: image + info */}
                              <div className="flex flex-1 gap-3">
                                <div className="w-[90px] h-[90px] rounded border border-slate-200 overflow-hidden bg-white shrink-0">
                                  <img
                                    className="w-full h-full object-cover"
                                    src={prod?.images?.[0] || FALLBACK_IMG}
                                    alt={prod?.name || "product"}
                                    onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                                  />
                                </div>
                                <div className="pr-2 text-slate-700">
                                  <h4 className="text-sm font-medium">{prod?.name || "Product"}</h4>
                                  {prod?.brand && (
                                    <div className="text-xs text-slate-500">Brand: {prod?.brand}</div>
                                  )}
                                  <div className="text-xs text-rose-600 font-semibold mt-1">Out of stock</div>
                                </div>
                              </div>

                              {/* Right: price + qty (disabled) + delete */}
                              <div className="flex flex-1 items-center justify-between gap-4">
                                <div className="pl-0 md:pl-2">
                                  <div className="text-orange-500 font-semibold">TK {prod?.price ?? 0}</div>
                                  {Number(prod?.oldPrice || 0) > 0 && (
                                    <div className="text-xs line-through text-slate-400">TK {prod?.oldPrice}</div>
                                  )}
                                  {Number(prod?.discount || 0) > 0 && (
                                    <div className="text-xs text-rose-500">-{prod?.discount}%</div>
                                  )}
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                  <div className="flex items-center bg-slate-100 border border-slate-200 rounded h-9 opacity-60 pointer-events-none">
                                    <button className="px-3 text-lg" type="button">-</button>
                                    <div className="min-w-[36px] text-center">{p?.quantity ?? 0}</div>
                                    <button className="px-3 text-lg" type="button">+</button>
                                  </div>

                                  <button
                                    onClick={() => dispatch(delete_card_product(p._id))}
                                    className="px-4 py-1.5 text-xs rounded bg-rose-500 hover:bg-rose-600 text-white"
                                    type="button"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Summary */}
              <div className="w-full md:w-[33%]">
                <div className="md:sticky md:top-6">
                  {(card_products?.length || 0) > 0 ? (
                    <div className="bg-white border border-slate-200 rounded-lg p-4 text-slate-700 flex flex-col gap-4">
                      <h2 className="text-lg font-semibold text-slate-800">Order Summary</h2>

                      <div className="flex items-center justify-between text-sm">
                        <span>{buy_product_item} {buy_product_item > 1 ? "Items" : "Item"}</span>
                        <span>TK {price}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span>Shipping fee</span>
                        <span>TK {shipping_fee}</span>
                      </div>

                      <div className="flex gap-2">
                        <input className="w-full px-3 py-2 border border-slate-200 outline-none rounded-sm focus:border-emerald-500" type="text" placeholder="Input Voucher Coupon" />
                        <button className="px-4 py-2 text-xs rounded-sm bg-blue-500 hover:bg-blue-600 text-white" type="button">Apply</button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">Total</span>
                        <span className="text-lg text-orange-500 font-semibold">TK {price + shipping_fee}</span>
                      </div>

                      <button onClick={redirect} className="w-full px-4 py-3 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white text-sm uppercase cursor-pointer" type="button">
                        Proceed to checkout
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-lg p-4 text-slate-700">
                      <div className="text-sm">No in-stock items to checkout.</div>
                      <Link to="/shop" className="inline-block mt-3 px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-sm">
                        Shop Now
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-6 text-center">
              <div className="text-slate-700 mb-3">Your cart is empty</div>
              <Link to="/shop" className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded">Shop Now</Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Card;