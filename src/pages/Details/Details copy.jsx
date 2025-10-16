import { Link, useNavigate, useParams } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { useEffect, useMemo, useState } from 'react';
import Ratings from '../../components/Ratings/Ratings';
import { AiFillHeart } from 'react-icons/ai';
import { FaFacebookF } from 'react-icons/fa';
import { AiOutlineTwitter } from 'react-icons/ai';
import { BsInstagram } from 'react-icons/bs';
import { Pagination as SwiperPagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { useDispatch, useSelector } from 'react-redux';
import { get_product, messageClear } from '../../store/Reducers/homeReducer';
import toast from 'react-hot-toast';
import { add_to_card, add_to_wishlist } from '../../store/Reducers/cardReducer';
import Reviews from '../../components/Products/Reviews';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

const FALLBACK_IMG = 'https://via.placeholder.com/800x600?text=Image';

const Details = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { product, relatedProducts = [], moreProducts = [], totalReview } = useSelector((s) => s.home);
  const { userInfo } = useSelector((s) => s.auth);
  const { errorMessage, successMessage } = useSelector((s) => s.card);

  const [mainImg, setMainImg] = useState(null);
  const [tab, setTab] = useState('reviews');
  const [quantity, setQuantity] = useState(1);

  // Safe images
  const images = useMemo(
    () => (Array.isArray(product?.images) ? product.images.filter(Boolean) : []),
    [product]
  );

  // Init main image when product changes
  useEffect(() => {
    setMainImg(images[0] || null);
  }, [images]);

  useEffect(() => {
    dispatch(get_product(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
  }, [dispatch, errorMessage, successMessage]);

  const stock = Number(product?.stock || 0);
  const discount = Number(product?.discount || 0);

  const inc = () => {
    if (!product) return;
    if (quantity >= stock) toast.error('Out of stock');
    else setQuantity((q) => q + 1);
  };

  const dec = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const add_card = () => {
    if (!product) return;
    if (userInfo) {
      dispatch(
        add_to_card({
          userId: userInfo.id,
          quantity,
          productId: product._id,
        })
      );
    } else {
      navigate('/login');
    }
  };

  const add_wishlist = () => {
    if (!product) return;
    if (userInfo) {
      dispatch(
        add_to_wishlist({
          userId: userInfo.id,
          productId: product._id,
          name: product.name,
          price: product.price,
          image: images[0] || FALLBACK_IMG,
          discount: product.discount,
          rating: product.rating,
          slug: product.slug,
        })
      );
    } else {
      navigate('/login');
    }
  };

  const buy = () => {
    if (!product) return;
    const base =
      product.discount !== 0
        ? product.price
        : product.price;

    const obj = [
      {
        sellerId: product.sellerId,
        shopName: product.shopName,
        price: quantity * (base - Math.floor((base * 0.00001) / 100)), 
        products: [
          {
            quantity,
            productInfo: product,
          },
        ],
      },
    ];
    navigate('/shipping', {
      state: {
        products: obj,
        price: base * quantity,
        shipping_fee: 130,
        items: 1,
      },
    });
  };

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 4 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 3 },
  };

  const maxItems = Math.max(...Object.values(responsive).map((r) => r.items));
  const canCarouselLoop = images.length > maxItems;

  const relatedLoop = (relatedProducts?.length || 0) > 4;

  const safeSrc = (src) => (src && String(src).trim() !== '' ? src : null);

  // Sanitize + parse description
  const sanitizedDesc = useMemo(() => {
    const html = product?.description;
    if (typeof html !== 'string' || !html.trim()) return '';
    return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  }, [product?.description]);

  return (
    <div>
      <Header />

      <section className='bg-[url("https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759381526/profile/uutlizbmkivizmulakng.jpg")] h-[220px] w-full md:w-[95%] mx-auto md:mt-6 bg-cover bg-no-repeat relative bg-left'>
        <div className="absolute left-0 top-0 w-full md:w-[95%] mx-auto h-full text-white bg-black/40">
          <div className="flex flex-col justify-center gap-1 items-center h-full w-full text-white">
            <h2 className="text-2xl font-bold">Shop By </h2>
          </div>
        </div>
      </section>

      <div className="mx-auto px-1 md:px-8">
        <div className="bg-slate-100 py-5 mb-5 px-3">
          <div className="flex justify-start items-center text-md text-slate-600 w-full">
            <Link to="/">Home</Link>
            <span className="pt-1">
              <MdOutlineKeyboardArrowRight />
            </span>
            <Link to="/">{product?.category || 'Category'}</Link>
            <span className="pt-1">
              <MdOutlineKeyboardArrowRight />
            </span>
            <span>{product?.name || 'Product'}</span>
          </div>
        </div>
      </div>

      <section>
        <div className="mx-auto px-1 md:px-8">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
            {/* Left images */}
            <div>
              <div className="md:p-5 border border-slate-200">
                {safeSrc(mainImg) ? (
                  <img
                    className="w-full h-[240px] md:h-[400px] object-cover"
                    src={mainImg}
                    alt={product?.name || 'product'}
                    onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                  />
                ) : (
                  <div className="w-full h-[240px] md:h-[400px] bg-slate-100 grid place-items-center text-slate-400">
                    No image
                  </div>
                )}
              </div>

              <div className="py-3">
                {images.length > 0 && (
                  <Carousel
                    key={`gal-${images.length}`}
                    autoPlay={false}
                    infinite={canCarouselLoop}
                    responsive={responsive}
                    transitionDuration={400}
                    ssr
                  >
                    {images.map((img, i) =>
                      safeSrc(img) ? (
                        <div key={i} onClick={() => setMainImg(img)}>
                          <img
                            className="cursor-pointer aspect-square p-1 object-cover"
                            src={img}
                            alt={`thumb-${i}`}
                            onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                          />
                        </div>
                      ) : null
                    )}
                  </Carousel>
                )}
              </div>
            </div>

            {/* Right details */}
            <div className="flex flex-col gap-5">
              <div className="text-3xl text-slate-600 font-bold">
                <h2>{product?.name || 'Product name'}</h2>
              </div>

              <div className="flex justify-start items-center gap-4">
                <div className="flex text-xl">
                  <Ratings ratings={product?.rating || 0} />
                </div>
                <span className="text-green-500">({totalReview || 0} reviews)</span>
              </div>

              <div className="text-xl font-bold flex gap-3 items-center">
                {discount !== 0 ? (
                  <>
                    <h2 className="text-black">TK {product?.price}</h2>
                    {product?.oldPrice ? (
                      <h2 className="line-through text-red-500">TK {product.oldPrice}</h2>
                    ) : null}
                    <h2 className="text-slate-700">(-{discount}%)</h2>
                  </>
                ) : (
                  <h2>Price: TK {product?.price}</h2>
                )}
              </div>

{
  userInfo?.role === 'seller' && <>
   {product?.resellingPrice != null && (
                <div className="text-slate-600">
                  <p>Reselling Price: TK {product.resellingPrice}</p>
                </div>
              )}
  </>
}
           

              {/* Description (rich) */}
              <div className="text-slate-600">
                {sanitizedDesc ? (
                  <div className="space-y-3 leading-relaxed text-slate-700">
                    {parse(sanitizedDesc)}
                  </div>
                ) : (
                  <p>No description</p>
                )}
              </div>

              {/* qty + buttons */}
              <div className="flex gap-3 pb-10 border-b">
                {stock > 0 && (
                  <>
                    <div className="flex bg-slate-200 h-[50px] justify-center items-center text-xl rounded">
                      <button onClick={dec} className="px-6 cursor-pointer">
                        -
                      </button>
                      <div className="px-5">{quantity}</div>
                      <button onClick={inc} className="px-6 cursor-pointer">
                        +
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={add_card}
                        disabled={!product}
                        className="px-6 md:px-8 py-3 h-[50px] cursor-pointer hover:shadow-lg hover:shadow-purple-500/40 bg-[#149777] text-white rounded"
                      >
                        Add To Cart
                      </button>
                    </div>
                  </>
                )}
                <div>
                  <button
                    onClick={add_wishlist}
                    className="h-[50px] w-[50px] flex justify-center items-center cursor-pointer hover:shadow-lg hover:shadow-cyan-500/40 bg-cyan-500 text-white rounded"
                    aria-label="Add to wishlist"
                  >
                    <AiFillHeart />
                  </button>
                </div>
              </div>

              {/* availability + share */}
              <div className="flex py-3 md:py-5 gap-5">
                <div className="w-[150px] text-black font-bold text-xl flex flex-col gap-3 md:gap-5">
                  <span>Availability</span>
                  <span>Share on</span>
                </div>
                <div className="flex flex-col gap-5">
                  <span className={stock > 0 ? 'text-green-500' : 'text-red-500'}>
                    {stock > 0 ? `In Stock (${stock})` : 'Out of Stock'}
                  </span>
                  <ul className="flex justify-start items-center gap-3">
                    <li>
                      <a className="w-[38px] h-[38px] hover:bg-[#7fad39] hover:text-white flex justify-center items-center bg-sky-500 rounded-full text-white" href="#">
                        <FaFacebookF />
                      </a>
                    </li>
                    <li>
                      <a className="w-[38px] h-[38px] hover:bg-[#7fad39] hover:text-white flex justify-center items-center bg-cyan-500 rounded-full text-white" href="#">
                        <AiOutlineTwitter />
                      </a>
                    </li>
                    <li>
                      <a className="w-[38px] h-[38px] hover:bg-[#7fad39] hover:text-white flex justify-center items-center bg-red-500 rounded-full text-white" href="#">
                        <BsInstagram />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* action row */}
              <div className="flex gap-3">
                {stock > 0 && (
                  <button
                    onClick={buy}
                    className="px-8 py-3 h-[50px] cursor-pointer hover:shadow-lg hover:shadow-emerald-500/40 bg-emerald-500 text-white rounded"
                  >
                    Buy Now
                  </button>
                )}
                <Link
                  to={product?.sellerId ? `/dashboard/chat/${product.sellerId}` : '#'}
                  className="px-8 py-3 h-[50px] cursor-pointer hover:shadow-lg hover:shadow-lime-500/40 bg-lime-500 text-white rounded inline-flex items-center"
                >
                  Chat Seller
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section>
        <div className="mx-auto px-1 md:px-8 mt-4">
          <div className="flex flex-wrap">
            <div className="md:w-[80%] w-full">
              <div className="md:pr-4 pr-0">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTab('reviews')}
                    className={`py-1 hover:text-white px-5 hover:bg-green-500 ${
                      tab === 'reviews' ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-700 cursor-pointer'
                    } rounded-sm`}
                  >
                    Reviews
                  </button>
                  <button
                    onClick={() => setTab('description')}
                    className={`py-1 px-5 hover:text-white hover:bg-green-500 ${
                      tab === 'description' ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-700 cursor-pointer'
                    } rounded-sm`}
                  >
                    Description
                  </button>
                </div>

                <div className="mt-4">
                  {tab === 'reviews' ? (
                    <div className="py-5">
                      {product ? <Reviews key={product._id} product={product} /> : <p className="text-slate-600">Loading…</p>}
                    </div>
                  ) : (
                    <div className="py-5 text-slate-600">
                      {sanitizedDesc ? (
                        <div className="space-y-3 leading-relaxed text-slate-700">
                          {parse(sanitizedDesc)}
                        </div>
                      ) : (
                        <p>No description</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* More from shop */}
            <div className="md:w-[20%] w-full">
              <div className="md:pl-4 pl-0">
                <div className="px-3 py-2 text-slate-600 bg-slate-200">
                  <h2>From <span className='font-semibold'>{product?.shopName || 'Shop'}</span></h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-5 mt-3 md:border border-slate-200 md:p-3">
                  {(moreProducts || []).slice(0, 3).map((p, i) => (
                    <Link key={p?._id || i} to={`/product/details/${p?.slug || '#'}`} className="block">
                      <div className="relative">
                        <img
                          className="w-full h-[200px] object-cover"
                          src={safeSrc(p?.images?.[0]) || FALLBACK_IMG}
                          alt={p?.name || 'product'}
                          onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                        />
                        {Number(p?.discount || 0) > 0 && (
                          <div className="flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2">
                            {p.discount}%
                          </div>
                        )}
                      </div>
                      <h2 className="text-slate-600 text-[16px] p-1">{p?.name?.slice(0, 40) || 'Product'}</h2>
                      <div className="flex gap-2 p-1">
                        <h2 className="text-slate-600 text-[14px]">Price:</h2>
                        <span className="text-sm font-bold">TK {p?.price ?? 0}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section>
        <div className="mx-auto px-1 md:px-8">
          <h2 className="text-2xl py-8 text-slate-600">Related Products</h2>
          {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
            <>
              <Swiper
                slidesPerView={'auto'}
                breakpoints={{
                  1280: { slidesPerView: 4 },
                  565: { slidesPerView: 2 },
                }}
                spaceBetween={25}
                loop={relatedLoop}
                pagination={{ clickable: true, el: '.custom_bullet' }}
                modules={[SwiperPagination]}
                className="mySwiper"
              >
                {relatedProducts.map((p, i) => (
                  <SwiperSlide key={p?._id || i}>
                    <Link to={`/product/details/${p?.slug || '#'}`} className="block">
                      <div className="relative h-[270px]">
                        <div className="w-full h-full">
                          <img
                            className="w-full h-full object-cover"
                            src={safeSrc(p?.images?.[0]) || FALLBACK_IMG}
                            alt={p?.name || 'product'}
                            onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                          />
                          <div className="absolute h-full w-full top-0 left-0 bg-black opacity-25 hover:opacity-50 transition-all duration-500" />
                        </div>
                        {Number(p?.discount || 0) > 0 && (
                          <div className="flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2">
                            {p.discount}%
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col gap-1">
                        <h2 className="text-slate-600 text-lg font-semibold">{p?.name || 'Product'}</h2>
                        <div className="flex justify-start items-center gap-3">
                          <h2 className="text-[#6699ff] text-md font-bold">TK {p?.price ?? 0}</h2>
                          <div className="flex">
                            <Ratings ratings={p?.rating || 0} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="w-full flex justify-center items-center py-10">
                <div className="custom_bullet justify-center gap-3 !w-auto" />
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Details;