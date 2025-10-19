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
import DOMPurify from 'dompurify';
import Seo from '../../components/SEO/Seo';

const FALLBACK_IMG = 'https://placehold.co/800x600?text=Image';
const FALLBACK_HERO = 'https://placehold.co/1600x220?text=Shop+Header';

// --------- Helpers ---------
// normalize any format (array/JSON-string/CSV/nested) → array[string]
const parseMaybeJson = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch { return val; }
  }
  return val;
};
const collectOptions = (input, acc = []) => {
  const v = parseMaybeJson(input);
  if (Array.isArray(v)) {
    v.forEach(it => collectOptions(it, acc));
  } else if (typeof v === 'string') {
    const s = v.trim();
    if (!s) return acc;
    if ((s.startsWith('[') && s.endsWith(']')) || s.startsWith('["') || s.startsWith("['")) {
      try { collectOptions(JSON.parse(s), acc); return acc; } catch { }
    }
    if (s.includes(',')) {
      s.split(',').map(t => t.trim()).filter(Boolean).forEach(t => collectOptions(t, acc));
    } else {
      acc.push(s);
    }
  } else if (v != null) {
    acc.push(String(v));
  }
  return acc;
};
const normalizeOptions = (val) => Array.from(new Set(collectOptions(val, [])));

// html → plain text lines (newline-preserving)
const htmlToLines = (html) => {
  if (typeof html !== 'string' || !html.trim()) return [];
  const clean = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  const withBreaks = clean
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/\s*p\s*>/gi, '\n')
    .replace(/<\/\s*li\s*>/gi, '\n')
    .replace(/<\/\s*div\s*>/gi, '\n')
    .replace(/<\/\s*h[1-6]\s*>/gi, '\n')
    .replace(/<\/\s*ul\s*>|<\/\s*ol\s*>/gi, '\n')
    .replace(/<[^>]+>/g, '');
  return withBreaks
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);
};
// ---------------------------

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
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadingOne, setDownloadingOne] = useState(false);

  // variant selection
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => { dispatch(get_product(slug)); }, [dispatch, slug]);

  // images
  const images = useMemo(
    () => (Array.isArray(product?.images) ? product.images.filter(Boolean) : []),
    [product]
  );
  useEffect(() => { setMainImg(images[0] || null); }, [images]);

  const safeSrc = (src) => (src && String(src).trim() !== '' ? src : null);

  // dynamic hero background
  const heroSrc = useMemo(() => {
    return (
      safeSrc(product?.banner) ||
      safeSrc(product?.bannerImage) ||
      safeSrc(product?.heroImage) ||
      safeSrc(images[0]) ||
      FALLBACK_HERO
    );
  }, [product, images]);

  // variants
  const colorOptions = useMemo(
    () => normalizeOptions(
      product?.colors ?? product?.color ?? product?.variants?.colors ?? product?.options?.colors ?? []
    ),
    [product]
  );
  const sizeOptions = useMemo(
    () => normalizeOptions(
      product?.sizes ?? product?.size ?? product?.variants?.sizes ?? product?.options?.sizes ?? []
    ),
    [product]
  );

  useEffect(() => {
    setSelectedColor(prev => (colorOptions.length === 1 ? colorOptions[0] : (colorOptions.includes(prev) ? prev : '')));
    setSelectedSize(prev => (sizeOptions.length === 1 ? sizeOptions[0] : (sizeOptions.includes(prev) ? prev : '')));
  }, [colorOptions, sizeOptions]);

  // toasts
  useEffect(() => {
    if (errorMessage) { toast.error(errorMessage); dispatch(messageClear()); }
    if (successMessage) { toast.success(successMessage); dispatch(messageClear()); }
  }, [dispatch, errorMessage, successMessage]);

  const stock = Number(product?.stock || 0);
  const discount = Number(product?.discount || 0);

  // qty
  const inc = () => { if (!product) return; if (quantity >= stock) toast.error('Out of stock'); else setQuantity((q) => q + 1); };
  const dec = () => { if (quantity > 1) setQuantity((q) => q - 1); };

  // variant guard
  const ensureVariantPicked = () => {
    if (colorOptions.length && !selectedColor) { toast.error('Please select a color'); return false; }
    if (sizeOptions.length && !selectedSize) { toast.error('Please select a size'); return false; }
    return true;
  };

  // cart/wishlist
  const add_card = () => {
    if (!product) return;
    if (!ensureVariantPicked()) return;
    if (userInfo) {
      dispatch(add_to_card({
        userId: userInfo.id,
        quantity,
        productId: product._id,
        color: selectedColor || null,
        size: selectedSize || null
      }));
    } else navigate('/login');
  };
  const add_wishlist = () => {
    if (!product) return;
    if (!ensureVariantPicked()) return;
    if (userInfo) {
      dispatch(add_to_wishlist({
        userId: userInfo.id,
        productId: product._id,
        name: product.name,
        price: product.price,
        image: images[0] || FALLBACK_IMG,
        discount: product.discount,
        rating: product.rating,
        slug: product.slug,
        color: selectedColor || null,
        size: selectedSize || null
      }));
    } else navigate('/login');
  };

  // buy
  const buy = () => {
    if (!product) return;
    if (!ensureVariantPicked()) return;
    const base = product.price;
    const productForOrder = { ...product, selectedColor: selectedColor || null, selectedSize: selectedSize || null };
    const obj = [{
      sellerId: product.sellerId,
      shopName: product.shopName,
      price: quantity * (base - Math.floor((base * 0.00001) / 100)),
      products: [{ quantity, productInfo: productForOrder }]
    }];
    navigate('/shipping', { state: { products: obj, price: base * quantity, shipping_fee: 130, items: 1 } });
  };

  // description → line-by-line
  const descLines = useMemo(() => htmlToLines(product?.description || ''), [product?.description]);
  const SHORT_LINES = 6;
  const shortDescLines = descLines.slice(0, SHORT_LINES);

  // SEO meta (for Seo component)
  const ogImage = images[0] || FALLBACK_IMG;
  const metaDesc = useMemo(() => {
    const text = (descLines.join(' ') || product?.short_desc || product?.name || 'Product details').trim();
    return text.length > 160 ? text.slice(0, 157) + '…' : text;
  }, [descLines, product?.short_desc, product?.name]);

  const productSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product?.name || 'Product',
    description: metaDesc,
    image: images.length ? images : [ogImage],
    sku: product?._id,
    ...(product?.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: Number(product?.price || 0),
      availability: (Number(product?.stock || 0) > 0) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: (typeof window !== 'undefined' ? window.location.href : '')
    }
  }), [product?._id, product?.name, product?.brand, product?.price, product?.stock, metaDesc, images, ogImage]);

  // bottom carousel config
  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 4 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 3 },
  };
  const previewItems = images.slice(0, 4);
  const extraCount = Math.max(images.length - 4, 0);

  // downloads
  const fetchAsBlob = async (url) => {
    const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
    if (!res.ok) throw new Error('Fetch failed');
    return await res.blob();
  };
  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };
  const handleDownloadCurrent = async () => {
    if (!mainImg) return;
    try {
      setDownloadingOne(true);
      const blob = await fetchAsBlob(mainImg);
      const ext = (blob.type && blob.type.split('/')[1]) || 'jpg';
      downloadBlob(blob, `${product?.slug || 'image'}.${ext}`);
    } catch { toast.error('Download failed'); }
    finally { setDownloadingOne(false); }
  };
  const handleDownloadAllZip = async () => {
    if (!images.length) return;
    try {
      setDownloadingZip(true);
      const JSZipMod = await import('jszip');
      const JSZip = JSZipMod.default || JSZipMod;
      const zip = new JSZip();

      for (let i = 0; i < images.length; i++) {
        try {
          const blob = await fetchAsBlob(images[i]);
          const ext = (blob.type && blob.type.split('/')[1]) || 'jpg';
          zip.file(`image-${i + 1}.${ext}`, blob);
        } catch { }
      }
      const content = await zip.generateAsync({ type: 'blob' });
      downloadBlob(content, `${product?.slug || 'images'}.zip`);
    } catch { toast.error('Zip download failed (install jszip)'); }
    finally { setDownloadingZip(false); }
  };

  const relatedLoop = (relatedProducts?.length || 0) > 4;

  const Chip = ({ active, children, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-sm border transition ${active ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
        }`}
    >
      {children}
    </button>
  );

  // seo


  return (
    <div className="min-h-screen bg-gray-50">
      <Seo
        title={product?.name || 'Product Details'}
        description={metaDesc}
        image={ogImage}
        type="product"
        schema={productSchema}
      />
      <Header />

      {/* Hero (dynamic background) */}
      <section
        className="relative h-[200px] md:h-[220px] w-full bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url("${heroSrc}")` }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-[1] container max-w-7xl mx-auto h-full flex items-center justify-center px-4">
          <h2 className="text-white text-2xl md:text-3xl font-semibold">
            {product?.category ? `Shop by ${product.category}` : 'Shop By'}
          </h2>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="container max-w-7xl mx-auto px-4">
        <div className="bg-white border border-slate-200 rounded-lg py-3 px-3 my-5">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link to="/" className="hover:underline">Home</Link>
            <MdOutlineKeyboardArrowRight />
            <Link to="/shop" className="hover:underline">{product?.category || 'Category'}</Link>
            <MdOutlineKeyboardArrowRight />
            <span className="text-slate-800">{product?.name || 'Product'}</span>
          </div>
        </div>
      </div>

      {/* Product details */}
      <section className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left */}
          <div>
            <div className="bg-white border border-slate-200 rounded p-2">
              {safeSrc(mainImg) ? (
                <img
                  className="w-full h-[260px] md:h-[440px] rounded object-cover"
                  src={mainImg}
                  alt={product?.name || 'product'}
                  onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                />
              ) : (
                <div className="w-full h-[260px] md:h-[440px] bg-slate-100 grid place-items-center text-slate-400 rounded-lg">No image</div>
              )}
            </div>

            {/* Bottom thumbnails */}
            {images.length > 0 && (
              <div className="py-3">
                <Carousel
                  key={`gal-${images.length}`}
                  autoPlay={false}
                  infinite={images.length > 5}
                  responsive={responsive}
                  transitionDuration={350}
                  ssr
                >
                  {images.map((img, i) => (
                    <div key={i} onClick={() => setMainImg(img)}>
                      <img
                        className="cursor-pointer aspect-square p-1 object-cover"
                        src={img}
                        alt={`thumb-${i}`}
                        onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="flex flex-col gap-5">
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">{product?.name || 'Product name'}</h1>

            {/* Rating + stock */}
            <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
              <div className="flex items-center text-xl"><Ratings ratings={product?.rating || 0} /></div>
              <span className="text-emerald-600 text-sm">({totalReview || 0} reviews)</span>
              <span className={`text-xs px-2 py-1 rounded border ${stock > 0 ? 'text-emerald-700 border-emerald-200 bg-emerald-50' : 'text-rose-700 border-rose-200 bg-rose-50'}`}>
                {stock > 0 ? `In Stock (${stock})` : 'Out of Stock'}
              </span>
            </div>

            {/* Preview + download */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {previewItems.map((src, i) => {
                  const isLast = i === 3 && extraCount > 0;
                  return (
                    <button
                      key={`pv-${i}`}
                      onClick={() => isLast ? setGalleryOpen(true) : setMainImg(src)}
                      className={`relative w-12 h-12 border rounded-md overflow-hidden ${mainImg === src ? 'border-emerald-500' : 'border-slate-200'}`}
                      title={isLast ? `View ${extraCount} more` : 'Preview'}
                      type="button"
                    >
                      <img src={src} alt={`pv-${i}`} onError={(e) => (e.currentTarget.src = FALLBACK_IMG)} className="w-full h-full object-cover" />
                      {isLast && (<div className="absolute inset-0 bg-black/50 text-white text-xs font-semibold grid place-items-center">+{extraCount}</div>)}
                    </button>
                  );
                })}
              </div>

              <button onClick={handleDownloadCurrent} disabled={!mainImg || downloadingOne} className="inline-flex items-center justify-center w-[116px] h-9 text-xs rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-60 cursor-pointer" title="Download current image" type="button">
                {downloadingOne ? 'Downloading…' : 'Download'}
              </button>
              <button onClick={() => setGalleryOpen(true)} className="inline-flex items-center justify-center w-[90px] h-9 text-xs rounded border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer" title="View all images" type="button">View all</button>
              <button onClick={handleDownloadAllZip} disabled={!images.length || downloadingZip} className="inline-flex items-center justify-center w-[142px] h-9 text-xs rounded bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-60 cursor-pointer" title="Download all" type="button">
                {downloadingZip ? 'Zipping…' : 'Download all'}
              </button>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 text-xl font-bold">
              {discount !== 0 ? (
                <>
                  <span className="text-slate-900">TK {product?.price}</span>
                  {product?.oldPrice > 0 ? <span className="line-through text-rose-500 text-lg">TK {product.oldPrice}</span> : null}
                  <span className="text-slate-700 text-base">(-{discount}%)</span>
                </>
              ) : (<span className="text-slate-900">TK {product?.price}</span>)}
            </div>

            {userInfo?.role === 'seller' && product?.resellingPrice != null && (
              <div className="text-slate-600">Reselling Price: <span className="font-medium text-slate-800">TK {product.resellingPrice}</span></div>
            )}
           
            {/* Variants */}
            {colorOptions.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-slate-700 font-medium">Color</span>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((c, idx) => (
                    <Chip key={`c-${idx}`} active={selectedColor === c} onClick={() => setSelectedColor(c)}>{c}</Chip>
                  ))}
                </div>
              </div>
            )}
            {sizeOptions.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-slate-700 font-medium ">Size</span>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((s, idx) => (
                    <Chip key={`s-${idx}`} active={selectedSize === s} onClick={() => setSelectedSize(s)}>{s}</Chip>
                  ))}
                </div>
              </div>
            )}

            {/* Short Description (line-by-line) */}
            <div className="text-slate-700 bg-white border border-slate-200 rounded-lg p-3">
              {shortDescLines.length ? (
                <ul className="space-y-1">
                  {shortDescLines.map((line, i) => (
                    <li key={`sd-${i}`} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500">No description</p>
              )}
              {descLines.length > shortDescLines.length && (
                <button
                  type="button"
                  onClick={() => {
                    setTab('description');
                    const el = document.getElementById('full-description');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="text-emerald-600 text-sm mt-2 hover:underline cursor-pointer"
                >
                  Read full description
                </button>
              )}
            </div>

            {/* qty + buttons */}
            <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-slate-200">
              {stock > 0 && (
                <>
                  <div className="flex bg-slate-100 h-[48px] items-center rounded overflow-hidden border border-slate-200">
                    <button onClick={dec} className="px-5 text-lg hover:bg-slate-200 cursor-pointer">-</button>
                    <div className="px-4 min-w-[46px] text-center">{quantity}</div>
                    <button onClick={inc} className="px-5 text-lg hover:bg-slate-200 cursor-pointer">+</button>
                  </div>
                  <button onClick={add_card} disabled={!product} className="px-6 md:px-8 h-[48px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-md shadow-sm cursor-pointer">
                    Add To Cart
                  </button>
                </>
              )}
              <button onClick={add_wishlist} className="h-[48px] w-[48px] flex justify-center items-center bg-white border border-slate-200 rounded-md hover:bg-emerald-50 text-emerald-600 cursor-pointer" aria-label="Add to wishlist" title="Add to wishlist">
                <AiFillHeart size={22}/>
              </button>
            </div>

            {/* availability + share */}
            <div className="flex gap-6">
              <div className="w-[140px] text-slate-900 font-semibold flex flex-col gap-4">                 
                <span>Availability</span>
                <span>Share on</span>
              </div>
              <div className="flex flex-col gap-4">
                <span className={stock > 0 ? 'text-emerald-600' : 'text-rose-600'}>{stock > 0 ? `In Stock (${stock})` : 'Out of Stock'}</span>
                <ul className="flex items-center gap-3">
                  <li><a className="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full grid place-items-center" href="#"><FaFacebookF /></a></li>
                  <li><a className="w-9 h-9 bg-sky-500 hover:bg-sky-600 text-white rounded-full grid place-items-center" href="#"><AiOutlineTwitter /></a></li>
                  <li><a className="w-9 h-9 bg-pink-600 hover:bg-pink-700 text-white rounded-full grid place-items-center" href="#"><BsInstagram /></a></li>
                </ul>
              </div>
            </div>
              <div className='py-2'>
                <p >FB page: <Link to={product?.fbProductLink} target='_blank' className="text-sky-600 text-md font-bold"> {product?.shopName}</Link></p>
              </div>
            {/* action row */}
            <div className="flex flex-wrap gap-3">
              {stock > 0 && (<button onClick={buy} className="px-8 h-[48px] bg-amber-500 hover:bg-amber-600 text-white rounded-md shadow-sm cursor-pointer">Buy Now</button>)}
              <Link to={product?.sellerId ? `/dashboard/chat/${product.sellerId}` : '#'} className="px-8 h-[48px] bg-teal-500 hover:bg-teal-600 text-white rounded-md shadow-sm inline-flex items-center">Chat Seller</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="container max-w-7xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-4">
            <div className="border-b border-slate-200">
              <div className="flex gap-2">
                <button onClick={() => setTab('reviews')} className={`px-4 py-2 text-sm rounded-t-md ${tab === 'reviews' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer'}`}>Reviews</button>
                <button onClick={() => setTab('description')} className={`px-4 py-2 text-sm rounded-t-md ${tab === 'description' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer'}`}>Description</button>
              </div>

            </div>
            <div className="bg-white border border-slate-200 rounded-b-md rounded-tr-md p-4">
              {tab === 'reviews' ? (
                <div className="py-2">{product ? <Reviews key={product._id} product={product} /> : <p className="text-slate-600">Loading…</p>}</div>
              ) : (
                <div id="full-description" className="py-2 text-slate-700">
                  {descLines.length ? (
                    <ul className="space-y-1">
                      {descLines.map((line, i) => (
                        <li key={`fd-${i}`} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No description</p>
                  )}
                  <p className='text-sm mt-4 text-gray-600'>Note: The courier charge must be paid in advance. It is <span className='font-bold'>80</span> Taka inside Dhaka and <span className='font-bold'>140 </span>Taka outside Dhaka. Thank you.</p>
                </div>
                
              )}
              
            </div>

          </div>

          {/* More from shop */}
          {/* More from shop */}
          <div className="md:col-span-1">
            <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
              <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 text-slate-700">
                From <span className="font-semibold">{product?.shopName || 'Shop'}</span>
              </div>
              <div className="p-3 grid grid-cols-2 md:grid-cols-1 gap-3">
                {(moreProducts || []).slice(0, 3).map((p, i) => (
                  <Link key={p?._id || i} to={`/product/details/${p?.slug || '#'}`} className="block">
                    <div className="relative">
                      <img className="w-full h-[160px] md:h-[140px] object-cover rounded-md border border-slate-200"
                        src={safeSrc(p?.images?.[0]) || FALLBACK_IMG}
                        alt={p?.name || 'product'}
                        onError={(e) => (e.currentTarget.src = FALLBACK_IMG)} />
                      {Number(p?.discount || 0) > 0 && (
                        <div className="absolute left-2 top-2 px-2 h-6 bg-rose-600 text-white text-[11px] rounded shadow flex items-center">{p.discount}%</div>
                      )}
                    </div>
                    <h3 className="text-slate-800 text-sm mt-2 line-clamp-2 min-h-[36px]">{p?.name || 'Product'}</h3>
                    <div className="text-slate-700 text-sm font-semibold mt-1">TK {p?.price ?? 0}</div>
                  </Link>
                ))}
              </div>
              {product?.sellerId && (
                <div className="px-3 py-3 border-t border-slate-200 bg-slate-50">
                  <Link
                    to={`/shop/seller/${product.sellerId}`}
                    className="w-full inline-flex items-center justify-center px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
                  >
                    এই শপের সকল প্রডাক্ট
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="container max-w-7xl mx-auto px-4">
        <h2 className="text-xl md:text-2xl py-6 text-slate-800 font-semibold">Related Products</h2>
        {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
          <>
            <Swiper
              slidesPerView={'auto'}
              breakpoints={{ 1280: { slidesPerView: 4 }, 565: { slidesPerView: 2 } }}
              spaceBetween={20}
              loop={relatedLoop}
              pagination={{ clickable: true, el: '.custom_bullet' }}
              modules={[SwiperPagination]}
              className="mySwiper"
            >
              {relatedProducts.map((p, i) => (
                <SwiperSlide key={p?._id || i} className="!w-[260px]">
                  <Link to={`/product/details/${p?.slug || '#'}`} className="block bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition">
                    <div className="relative h-[200px]">
                      <img className="w-full h-full object-cover"
                        src={safeSrc(p?.images?.[0]) || FALLBACK_IMG}
                        alt={p?.name || 'product'}
                        onError={(e) => (e.currentTarget.src = FALLBACK_IMG)} />
                      {Number(p?.discount || 0) > 0 && (
                        <div className="absolute left-2 top-2 px-2 h-6 bg-rose-600 text-white text-[11px] rounded shadow flex items-center">{p.discount}%</div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-slate-800 text-sm font-medium line-clamp-2 min-h-[36px]">{p?.name || 'Product'}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-emerald-600 text-sm font-semibold">TK {p?.price ?? 0}</span>
                        <div className="flex"><Ratings ratings={p?.rating || 0} /></div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="w-full flex justify-center py-8">
              <div className="custom_bullet !w-auto flex gap-2" />
            </div>
          </>
        )}
      </section>

      {/* Image Gallery Modal */}
      {galleryOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[85vh] overflow-hidden shadow-2xl ring-1 ring-slate-200">
            <div className="p-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-slate-800 font-semibold">Image gallery</h3>
              <div className="flex items-center gap-2">
                <button onClick={handleDownloadAllZip} disabled={downloadingZip} className="px-3 py-1.5 text-sm rounded bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-60 cursor-pointer">
                  {downloadingZip ? 'Zipping…' : 'Download all'}
                </button>
                <button onClick={() => setGalleryOpen(false)} className="px-3 py-1.5 text-sm rounded border border-slate-200 hover:bg-slate-50">Close</button>
              </div>
            </div>
            <div className="p-4 overflow-auto max-h-[70vh]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((src, i) => (<GalleryItem key={`g-${i}`} src={src} idx={i} />))}
                {images.length === 0 && (<div className="col-span-full text-center text-slate-500 py-10">No images</div>)}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

const GalleryItem = ({ src, idx }) => {
  const FALLBACK_IMG = 'https://placehold.co/800x600?text=Image';
  const fetchAsBlob = async (url) => {
    const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
    if (!res.ok) throw new Error('Fetch failed');
    return await res.blob();
  };
  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };
  const handleDownload = async () => {
    try {
      const blob = await fetchAsBlob(src);
      const ext = (blob.type && blob.type.split('/')[1]) || 'jpg';
      downloadBlob(blob, `image-${idx + 1}.${ext}`);
    } catch { toast.error('Download failed'); }
  };

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
      <img src={src} alt={`img-${idx}`} onError={(e) => (e.currentTarget.src = FALLBACK_IMG)} className="w-full h-[160px] object-cover" />
      <div className="p-2 flex items-center justify-between">
        <span className="text-xs text-slate-600">Image {idx + 1}</span>
        <button onClick={handleDownload} className="text-xs px-2 py-1 rounded bg-slate-800 text-white hover:bg-slate-700">Download</button>
      </div>
    </div>
  );
};

export default Details;