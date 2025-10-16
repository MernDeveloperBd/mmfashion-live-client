import { IoIosArrowDropright } from "react-icons/io";
import { Link } from "react-router-dom";
import ShopProducts from './ShopProducts';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Range } from 'react-range';
import "react-range-slider-input/dist/style.css";
import { AiFillStar } from "react-icons/ai";
import { CiStar } from "react-icons/ci";
import { FaCamera } from "react-icons/fa";
import Products from "../../components/Products/Products";
import { BsFillGridFill, BsList } from "react-icons/bs";
import Pagination from "../../components/Pagination/Pagination";
import { useDispatch, useSelector } from 'react-redux';
import { price_range_product, query_products } from "../../store/Reducers/homeReducer.js";
import api from "../../Api/api.js";
import Seo from "../../components/SEO/Seo";

const Shop = () => {
  const dispatch = useDispatch();
  const { products, totalProduct, latest_product, categories: homeCategories, priceRange, perPage } = useSelector(state => state.home);

  // View, filter & pagination states
  const [pageNumber, setPageNumber] = useState(1);
  const [styles, setStyles] = useState('grid');
  const [filter, setFilter] = useState(false);
  const [rating, setRatingQ] = useState('');
  const [sortPrice, setSortPrice] = useState('');

  // NEW: text search
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Price range
  const [state, setState] = useState({ values: [0, 0] });
  const [rangeData, setRangeData] = useState(null);

  // Category/Sub/Child local lists (with _id)
  const [catList, setCatList] = useState([]);
  const [subList, setSubList] = useState([]);
  const [childList, setChildList] = useState([]);

  // Loading flags
  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [loadingChilds, setLoadingChilds] = useState(false);

  // Selected IDs and Names for filters
  const [selectedCatId, setSelectedCatId] = useState('');
  const [selectedCatName, setSelectedCatName] = useState('');
  const [selectedSubId, setSelectedSubId] = useState('');
  const [selectedSubName, setSelectedSubName] = useState('');
  const [selectedChildId, setSelectedChildId] = useState('');
  const [selectedChildName, setSelectedChildName] = useState('');

  // Image search local states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageMode, setImageMode] = useState(false);
  const [imgProducts, setImgProducts] = useState([]);
  const [imgTotal, setImgTotal] = useState(0);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState('');

  // SEO meta values (simple and safe)
  const metaDesc = useMemo(() => {
    const parts = [];
    if (selectedCatName) parts.push(`Category: ${selectedCatName}`);
    if (selectedSubName) parts.push(`Sub: ${selectedSubName}`);
    if (selectedChildName) parts.push(`Child: ${selectedChildName}`);
    parts.push(`Price: TK${Math.floor(state.values[0])} - TK${Math.floor(state.values[1])}`);
    if (debouncedSearch) parts.push(`Search: ${debouncedSearch}`);
    return `Browse products. ${parts.join(' | ')}`;
  }, [selectedCatName, selectedSubName, selectedChildName, state.values, debouncedSearch]);

  // Initial: load price range
  useEffect(() => {
    dispatch(price_range_product());
  }, [dispatch]);

  // Sync priceRange to slider state
  useEffect(() => {
    if (!priceRange) return;
    if (priceRange.low === priceRange.high) {
      setRangeData({ low: priceRange.low, high: priceRange.high + 100 });
    } else {
      setRangeData({ low: priceRange.low, high: priceRange.high });
    }
    setState({ values: [priceRange.low, priceRange.high] });
  }, [priceRange]);

  // Ensure categories with _id (fallback if needed)
  useEffect(() => {
    const hasId = homeCategories?.length && homeCategories?.[0]?._id;
    if (hasId) {
      setCatList(homeCategories);
      return;
    }
    (async () => {
      try {
        setLoadingCats(true);
        const { data } = await api.get('/category-get', { withCredentials: false });
        setCatList(data?.categories || []);
      } catch {
        setCatList([]);
      } finally {
        setLoadingCats(false);
      }
    })();
  }, [homeCategories]);

  // Load sub categories when category changes
  useEffect(() => {
    const loadSubs = async (catId) => {
      if (!catId) {
        setSubList([]); setSelectedSubId(''); setSelectedSubName('');
        setChildList([]); setSelectedChildId(''); setSelectedChildName('');
        return;
      }
      try {
        setLoadingSubs(true);
        const { data } = await api.get(`/sub-category-get?categoryId=${catId}`, { withCredentials: false });
        const subs = data?.subCategories || [];
        setSubList(subs);
        setSelectedSubId(''); setSelectedSubName('');
        setChildList([]); setSelectedChildId(''); setSelectedChildName('');
      } catch {
        setSubList([]);
      } finally {
        setLoadingSubs(false);
      }
    };
    loadSubs(selectedCatId);
    setPageNumber(1);
  }, [selectedCatId]);

  // Load child categories when sub changes
  useEffect(() => {
    const loadChilds = async (subId) => {
      if (!subId) {
        setChildList([]); setSelectedChildId(''); setSelectedChildName('');
        return;
      }
      try {
        setLoadingChilds(true);
        const { data } = await api.get(`/child-category-get?subcategoryId=${subId}`, { withCredentials: false });
        const childs = data?.childCategories || [];
        setChildList(childs);
        setSelectedChildId(''); setSelectedChildName('');
      } catch {
        setChildList([]);
      } finally {
        setLoadingChilds(false);
      }
    };
    loadChilds(selectedSubId);
    setPageNumber(1);
  }, [selectedSubId]);

  // NEW: debounce searchTerm -> debouncedSearch
  useEffect(() => {
    setPageNumber(1);
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Image search runner
  const runImageSearch = useCallback(async (fileArg, pageArg) => {
    const file = fileArg || imageFile;
    if (!file) return;
    try {
      setImgError('');
      setImgLoading(true);
      const fd = new FormData();
      fd.append('image', file);
      fd.append('page', String(pageArg || pageNumber || 1));
      fd.append('perPage', String(perPage || 12));

      // Scope by IDs
      if (selectedCatId) fd.append('categoryId', selectedCatId);
      if (selectedSubId) fd.append('subcategoryId', selectedSubId);
      if (selectedChildId) fd.append('childId', selectedChildId);

      // Optional: pass other filters (backend may ignore)
      fd.append('low', String(state.values?.[0] ?? ''));
      fd.append('high', String(state.values?.[1] ?? ''));
      if (rating) fd.append('rating', String(rating));
      if (sortPrice === 'low-to-high') fd.append('sort', 'priceAsc');
      if (sortPrice === 'high-to-low') fd.append('sort', 'priceDesc');

      // NEW: text search with image search too
      if (debouncedSearch) {
        fd.append('value', debouncedSearch);
        fd.append('search', debouncedSearch);
      }

      const { data } = await api.post('/product-image-search', fd, { withCredentials: false });
      setImgProducts(data?.products || []);
      setImgTotal(data?.totalProduct || 0);
    } catch (err) {
      setImgError(err?.response?.data?.error || err.message || 'Image search failed');
      setImgProducts([]);
      setImgTotal(0);
    } finally {
      setImgLoading(false);
    }
  }, [imageFile, pageNumber, perPage, selectedCatId, selectedSubId, selectedChildId, state.values, rating, sortPrice, debouncedSearch]);

  // Dispatch product query or run image search on filters/page change
  useEffect(() => {
    if (imageMode) {
      runImageSearch(null, pageNumber);
      return;
    }
    dispatch(
      query_products({
        low: state.values[0],
        high: state.values[1],
        // names (optional)
        category: selectedCatName || '',
        subcategory: selectedSubName || '',
        child: selectedChildName || '',
        // IDs (preferred)
        categoryId: selectedCatId || '',
        subcategoryId: selectedSubId || '',
        childId: selectedChildId || '',
        // NEW: text search
        value: debouncedSearch || '',
        search: debouncedSearch || '',
        rating,
        sortPrice,
        pageNumber
      })
    );
  }, [
    imageMode,
    pageNumber,
    state.values,
    selectedCatName,
    selectedSubName,
    selectedChildName,
    selectedCatId,
    selectedSubId,
    selectedChildId,
    rating,
    sortPrice,
    debouncedSearch,
    dispatch,
    runImageSearch
  ]);

  // Handlers
  const handleCategoryCheck = (checked, cat) => {
    if (checked) {
      setSelectedCatId(cat._id);
      setSelectedCatName(cat.name);
    } else {
      setSelectedCatId(''); setSelectedCatName('');
      setSubList([]); setSelectedSubId(''); setSelectedSubName('');
      setChildList([]); setSelectedChildId(''); setSelectedChildName('');
    }
    setPageNumber(1);
  };

  const handleSubCheck = (checked, sub) => {
    if (checked) {
      setSelectedSubId(sub._id);
      setSelectedSubName(sub.name);
    } else {
      setSelectedSubId(''); setSelectedSubName('');
      setChildList([]); setSelectedChildId(''); setSelectedChildName('');
    }
    setPageNumber(1);
  };

  const handleChildCheck = (checked, child) => {
    if (checked) {
      setSelectedChildId(child._id);
      setSelectedChildName(child.name);
    } else {
      setSelectedChildId(''); setSelectedChildName('');
    }
    setPageNumber(1);
  };

  const clearAllFilters = () => {
    setSelectedCatId(''); setSelectedCatName('');
    setSelectedSubId(''); setSelectedSubName('');
    setSelectedChildId(''); setSelectedChildName('');
    setSubList([]); setChildList([]);
    setRatingQ('');
    setSortPrice('');
    if (rangeData) setState({ values: [rangeData.low, rangeData.high] });
    setPageNumber(1);
    // NOTE: searchTerm ইচ্ছে করে Clear All-এ রিসেট করিনি (আগের আচরণ না পাল্টাতে)।
    // চাইলে নিচের লাইন আনকমেন্ট করতে পারেন:
    // setSearchTerm('');
  };

  // Image search handlers
  const onImagePick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (imagePreview) {
      try { URL.revokeObjectURL(imagePreview); } catch { }
    }
    const url = URL.createObjectURL(f);
    setImageFile(f);
    setImagePreview(url);
    setImageMode(true);
    setPageNumber(1);
    runImageSearch(f, 1);
  };

  const clearImage = () => {
    if (imagePreview) {
      try { URL.revokeObjectURL(imagePreview); } catch { }
    }
    setImageFile(null);
    setImagePreview(null);
    setImageMode(false);
    setImgProducts([]);
    setImgTotal(0);
    setImgError('');
    setPageNumber(1);
  };

  // Decide which list to show
  const showProducts = imageMode ? imgProducts : products;
  const showTotal = imageMode ? imgTotal : totalProduct;

  return (
    <div>
      <Seo title="Shop" description={metaDesc} type="website" />

      <Header />

      {/* Banner */}
      <section className='bg-[url("https://res.cloudinary.com/dpd5xwjqp/image/upload/v1760438023/Shop_kfdc0y.png")] h-[220px] w-full md:w-[95%] mx-auto md:mt-6 bg-cover bg-no-repeat relative bg-left'>
        <div className="absolute left-0 top-0 w-full md:w-[95%] mx-auto h-full text-white bg-black/40">
          <div className="flex flex-col justify-center gap-1 items-center h-full w-full text-white">
            <h2 className="text-2xl font-bold">Shop by</h2>
            <div className="commonFlex gap-2 text-xl w-full">
              <Link to="/">Home</Link>
              <span className="pt-1"><IoIosArrowDropright /></span>
              <span>Products</span>
            </div>
          </div>
        </div>
      </section>

      {/* Shop */}
      <section className="py-6 md:py-16 ">
        <div className="w-full md:w-[95%] mx-auto h-full">
          {/* Mobile Filter Toggle */}
          <div className={`md:hidden block ${filter ? "mb-6" : "mb-0"}`}>
            <button
              onClick={() => setFilter(!filter)}
              className="text-center w-full py-2 px-3 bg-[#0d6b54] font-bold text-white cursor-pointer rounded"
            >
              {filter ? "Hide Filters" : "Filter Products"}
            </button>
          </div>

          <div className="w-full flex flex-col md:flex-row gap-6 px-2">
            {/* Sidebar */}
            <div className={`w-full md:w-3/12 pr-8 transition-all duration-300 px-2 ${filter ? "block" : "hidden md:block"}`}>
              
              {/* NEW: Text Search (above Category) */}
            {/*   <div className="mb-4">
                <h2 className="text-2xl font-bold mb-3 text-slate-600">Search</h2>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products by name..."
                    className="w-full px-3 py-2 border border-slate-300 rounded outline-none focus:border-[#0d6b54] text-slate-700"
                  />
                  {searchTerm ? (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded"
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Type to search. Results update as you type.</p>
              </div> */}

              {/* Category Filter header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold mb-3 text-slate-600">Category</h2>
                <button onClick={clearAllFilters} className="text-xs font-semibold text-green-600  cursor-pointer bg-gray-200 px-2 py-1 rounded">Clear All</button>
              </div>

              {/* Category list */}
              <div className="py-2">
                {loadingCats ? (
                  <p className="text-sm text-slate-500">Loading categories...</p>
                ) : catList?.length ? (
                  catList.map((c) => (
                    <div className='flex justify-start items-center gap-2 py-1' key={c._id || c.slug || c.name}>
                      <input
                        type="checkbox"
                        id={`cat_${c._id}`}
                        checked={selectedCatId === c._id}
                        onChange={(e) => handleCategoryCheck(e.target.checked, c)}
                      />
                      <label className='text-slate-600 block cursor-pointer' htmlFor={`cat_${c._id}`}>{c.name}</label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No categories found</p>
                )}
              </div>

              {/* Sub Category Filter */}
              {selectedCatId ? (
                <div className="py-3">
                  <h3 className="text-xl font-bold mb-2 text-slate-600">Sub Category</h3>
                  {loadingSubs ? (
                    <p className="text-sm text-slate-500">Loading sub categories...</p>
                  ) : subList?.length ? (
                    subList.map((s) => (
                      <div className='flex justify-start items-center gap-2 py-1' key={s._id}>
                        <input
                          type="checkbox"
                          id={`sub_${s._id}`}
                          checked={selectedSubId === s._id}
                          onChange={(e) => handleSubCheck(e.target.checked, s)}
                        />
                        <label className='text-slate-600 block cursor-pointer' htmlFor={`sub_${s._id}`}>{s.name}</label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No sub categories</p>
                  )}
                </div>
              ) : null}

              {/* Child Category Filter */}
              {selectedSubId ? (
                <div className="py-3">
                  <h3 className="text-xl font-bold mb-2 text-slate-600">Child Category</h3>
                  {loadingChilds ? (
                    <p className="text-sm text-slate-500">Loading child categories...</p>
                  ) : childList?.length ? (
                    childList.map((ch) => (
                      <div className='flex justify-start items-center gap-2 py-1' key={ch._id}>
                        <input
                          type="checkbox"
                          id={`child_${ch._id}`}
                          checked={selectedChildId === ch._id}
                          onChange={(e) => handleChildCheck(e.target.checked, ch)}
                        />
                        <label className='text-slate-600 block cursor-pointer' htmlFor={`child_${ch._id}`}>{ch.name}</label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No child categories</p>
                  )}
                </div>
              ) : null}

              {/* Price Filter */}
              <div className="py-2 flex flex-col gap-5">
                <h3 className="text-2xl font-bold mb-3 text-slate-600">Price</h3>
                {rangeData && (
                  <Range
                    step={1}
                    min={rangeData?.low}
                    max={rangeData?.high}
                    values={state.values}
                    onChange={(values) => setState({ values })}
                    renderTrack={({ props, children }) => {
                      const { key, style, ...rest } = props;
                      return (
                        <div
                          key={key}
                          {...rest}
                          style={style}
                          className="w-full h-[6px] bg-slate-200 rounded-full cursor-default"
                        >
                          {children}
                        </div>
                      );
                    }}
                    renderThumb={({ props }) => {
                      const { key, style, ...rest } = props;
                      return (
                        <div
                          key={key}
                          {...rest}
                          style={style}
                          className="w-[15px] h-[15px] bg-blue-500 rounded-full"
                        />
                      );
                    }}
                  />
                )}
                <div>
                  <span className='text-red-500 font-bold text-sm'>
                    TK{Math.floor(state.values[0])} - TK{Math.floor(state.values[1])}
                  </span>
                </div>
              </div>

              {/* Ratings */}
              <div className="py-2 flex flex-col gap-5">
                <h3 className="text-2xl font-bold mb-3 text-slate-600">Rating</h3>
                <div className="flex flex-col gap-3">
                  <div onClick={() => { setRatingQ(5); setPageNumber(1); }} className="ratingStyle" title="Rating 5">
                    <span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span>
                  </div>
                  <div onClick={() => { setRatingQ(4); setPageNumber(1); }} className="ratingStyle" title="Rating 4">
                    <span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span><span><CiStar /></span>
                  </div>
                  <div onClick={() => { setRatingQ(3); setPageNumber(1); }} className="ratingStyle" title="Rating 3">
                    <span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span><span><CiStar /></span><span><CiStar /></span>
                  </div>
                  <div onClick={() => { setRatingQ(2); setPageNumber(1); }} className="ratingStyle" title="Rating 2">
                    <span><AiFillStar /></span><span><AiFillStar /></span><span><CiStar /></span><span><CiStar /></span><span><CiStar /></span>
                  </div>
                  <div onClick={() => { setRatingQ(1); setPageNumber(1); }} className="ratingStyle" title="Rating 1">
                    <span><AiFillStar /></span><span><CiStar /></span><span><CiStar /></span><span><CiStar /></span><span><CiStar /></span>
                  </div>
                  <div onClick={() => { setRatingQ(''); setPageNumber(1); }} className="ratingStyle" title="Reset">
                    <span><CiStar /></span><span><CiStar /></span><span><CiStar /></span><span><CiStar /></span><span><CiStar /></span>
                  </div>
                </div>
              </div>

              {/* Latest products */}
              <div className="py-5 hidden md:block"></div>
              <Products title="Latest Products" products={latest_product} />
            </div>

            {/* Products Grid */}
            <div className="w-full md:w-9/12 mt-4">
              <div className="pl-00 md:pl-4">
                <div className="py-2 bg-white mb-10 px-1.5 rounded-md flex justify-between items-center gap-1 border border-slate-200">
                  <h2 className="text-sm font-medium text-slate-600">
                    {showProducts?.length} of {showTotal} Products {imageMode ? '(image search)' : ''}
                  </h2>
                  {/* Search by Image */}
                  <div className="flex items-center gap-1">
                    <div className="py-0">
                    {!imagePreview ? (
                      <label className="block border border-dashed border-slate-300 rounded p-1.5 text-center cursor-pointer hover:bg-slate-50" title="Search by image">
                        <input type="file" accept="image/*" className="hidden" onChange={onImagePick} />
                        <span className="text-2xl text-teal-600 "> <FaCamera /></span>
                      </label>
                    ) : (
                      <div className="flex items-center gap-3">
                        <img src={imagePreview} alt="query" className="w-12 h-12 object-cover rounded border" />
                        <button onClick={clearImage} className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">
                          Clear
                        </button>
                      </div>
                    )}
                    {imgError ? <p className="text-xs text-red-500 mt-2">{imgError}</p> : null}
                    {imgLoading ? <p className="text-xs text-slate-500 mt-2">Searching...</p> : null}
                  </div>
                  <div className="commonFlex gap-3">
                    <select onChange={(e) => { setSortPrice(e.target.value); setPageNumber(1); }} value={sortPrice} className="p-1 border outline-0 text-slate-600 font-semibold" disabled={imgLoading}>
                      <option value="">Sort by</option>
                      <option value="low-to-high">Low to High Price</option>
                      <option value="high-to-low">High to Low Price</option>
                    </select>
                    <div className="flex justify-center items-start gap-1 md:gap-4">
                      <div onClick={() => setStyles('grid')} className={`p-2 ${styles === 'grid' && 'bg-slate-300'} text-slate-600 hover:bg-slate-300 cursor-pointer rounded-sm`}>
                        <BsFillGridFill />
                      </div>
                      <div onClick={() => setStyles('list')} className={`p-2 ${styles === 'list' && 'bg-slate-300'} text-slate-600 hover:bg-slate-300 cursor-pointer rounded-sm`}>
                        <BsList />
                      </div>
                    </div>
                  </div>
                  </div>
                </div>

                {/* products here */}
                <div className="pb-8">
                  <ShopProducts styles={styles} products={showProducts} />
                  {imgLoading && (
                    <div className="text-center text-sm text-slate-500 mt-2">Loading image matches...</div>
                  )}
                </div>

                {showTotal > perPage && (
                  <div>
                    <Pagination
                      pageNumber={pageNumber}
                      setPageNumber={setPageNumber}
                      totalItem={showTotal}
                      perPage={perPage}
                      showItem={Math.floor(showTotal / perPage)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;