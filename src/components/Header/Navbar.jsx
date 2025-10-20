import { useState, useEffect, useRef } from "react";
import { FaList, FaWhatsapp } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import api from "../../Api/api";

const Navbar = ({ categories }) => {
  const [categoryShow, setCategoryShow] = useState(false);

  // Mega menu hover/click states
  const [hoverCatId, setHoverCatId] = useState("");
  const [hoverSubId, setHoverSubId] = useState("");

  // Mobile panel level: 0 = cats, 1 = subs, 2 = childs
  const [mobileLevel, setMobileLevel] = useState(0);

  // Cache maps
  const [subMap, setSubMap] = useState({});     // { [catId]: subCategories[] }
  const [childMap, setChildMap] = useState({}); // { [subId]: childCategories[] }
  const [loadingSub, setLoadingSub] = useState(false);
  const [loadingChild, setLoadingChild] = useState(false);

  // Search states
  const [selCatId, setSelCatId] = useState("");
  const [selSubId, setSelSubId] = useState("");
  const [selChildId, setSelChildId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  // Detect mobile (md breakpoint: 768px)
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close on outside click/touch (desktop only)
  useEffect(() => {
    if (!categoryShow || isMobile) return;
    const h = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCategoryShow(false);
      }
    };
    document.addEventListener("mousedown", h);
    document.addEventListener("touchstart", h);
    return () => {
      document.removeEventListener("mousedown", h);
      document.removeEventListener("touchstart", h);
    };
  }, [categoryShow, isMobile]);

  // Load sub-categories for a category
  const loadSubs = async (catId) => {
    if (!catId || subMap[catId]) return;
    try {
      setLoadingSub(true);
      const { data } = await api.get(`/sub-category-get?categoryId=${catId}`, { withCredentials: true });
      setSubMap((prev) => ({ ...prev, [catId]: data?.subCategories || [] }));
    } catch (e) {
      // fail silently
    } finally {
      setLoadingSub(false);
    }
  };

  // Load child-categories for a sub-category
  const loadChilds = async (subId) => {
    if (!subId || childMap[subId]) return;
    try {
      setLoadingChild(true);
      const { data } = await api.get(`/child-category-get?subcategoryId=${subId}`, { withCredentials: true });
      setChildMap((prev) => ({ ...prev, [subId]: data?.childCategories || [] }));
    } catch (e) {
      // fail silently
    } finally {
      setLoadingChild(false);
    }
  };

  // For search selects: load subs when category changes
  useEffect(() => {
    setSelSubId("");
    setSelChildId("");
    if (selCatId) loadSubs(selCatId);
  }, [selCatId]);

  // For search selects: load childs when sub changes
  useEffect(() => {
    setSelChildId("");
    if (selSubId) loadChilds(selSubId);
  }, [selSubId]);

  const getCatName = (id) => categories?.find((c) => c._id === id)?.name || "";
  const getSubName = (catId, subId) => (subMap[catId] || []).find((s) => s._id === subId)?.name || "";
  const getChildName = (subId, childId) => (childMap[subId] || []).find((c) => c._id === childId)?.name || "";

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();

    if (selCatId) params.set("category", getCatName(selCatId));
    if (selSubId) params.set("sub", getSubName(selCatId, selSubId));
    if (selChildId) params.set("child", getChildName(selSubId, selChildId));

    const v = searchValue.trim();
    if (v) {
      params.set("q", v);
      params.set("search", v);
      params.set("value", v);
    }

    const qs = params.toString();
    navigate(`/shop${qs ? `?${qs}` : ""}`);
    setCategoryShow(false);
  };

  // Mobile menu helpers
  const openMobile = () => {
    setMobileLevel(0);
    setHoverCatId("");
    setHoverSubId("");
    setCategoryShow(true);
  };
  const closeMobile = () => {
    setCategoryShow(false);
    setMobileLevel(0);
    setHoverCatId("");
    setHoverSubId("");
  };

  const selectMobileCat = (catId) => {
    setHoverCatId(catId);
    setHoverSubId("");
    loadSubs(catId);
    setMobileLevel(1);
  };

  const selectMobileSub = (subId) => {
    setHoverSubId(subId);
    loadChilds(subId);
    setMobileLevel(2);
  };

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-800 py-1.5">
      <div className="w-full md:w-[95%] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {/* Category Dropdown trigger */}
          <div className="w-full md:w-auto relative z-[9990]" ref={dropdownRef}>
            <button
              onClick={() => {
                if (isMobile) {
                  if (categoryShow) closeMobile();
                  else openMobile();
                } else {
                  setCategoryShow(!categoryShow);
                }
              }}
              className="w-full md:w-64 flex items-center justify-between bg-brand-dark hover:bg-brand px-3 md:px-5 py-2 md:py-3 rounded-lg font-semibold text-sm transition-all shadow-md cursor-pointer hover:bg-gray-100"
              aria-expanded={categoryShow}
            >
              <div className="flex items-center gap-2">
                <FaList size={18} />
                <span>All Category</span>
              </div>
              <IoIosArrowDown
                className={`transition-transform duration-300 ${categoryShow ? "rotate-180" : ""}`}
              />
            </button>

            {/* Desktop Mega Dropdown (unchanged, desktop only) */}
            <div
              className={`hidden md:block absolute top-full left-0 w-full md:w-[720px] mt-2 bg-white dark:bg-gray-700 rounded-lg shadow-xl overflow-hidden transition-all duration-200 ${
                categoryShow ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Column 1: Categories */}
                <div className="max-h-[320px] overflow-auto border-r dark:border-gray-600">
                  <ul className="py-2">
                    {categories?.map((cat) => (
                      <li
                        key={cat._id}
                        className={`flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer ${
                          hoverCatId === cat._id ? "bg-gray-100 dark:bg-gray-600" : ""
                        }`}
                        onMouseEnter={() => {
                          setHoverCatId(cat._id);
                          setHoverSubId("");
                          loadSubs(cat._id);
                        }}
                      >
                        <img src={cat?.image} alt={cat?.name} className="w-6 h-6 rounded" />
                        <Link
                          to={`/shop?category=${encodeURIComponent(cat?.name)}`}
                          onClick={() => setCategoryShow(false)}
                          className="flex-1"
                        >
                          {cat?.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2: Sub Categories */}
                <div className="max-h-[320px] overflow-auto border-r dark:border-gray-600">
                  <h4 className="px-4 pt-3 text-xs uppercase tracking-wider text-gray-500">
                    Sub Categories
                  </h4>
                  <ul className="py-2">
                    {loadingSub && !subMap[hoverCatId] ? (
                      <li className="px-4 py-2 text-sm text-gray-400">Loading...</li>
                    ) : (subMap[hoverCatId] || []).length ? (
                      (subMap[hoverCatId] || []).map((sub) => (
                        <li
                          key={sub._id}
                          className={`px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer ${
                            hoverSubId === sub._id ? "bg-gray-100 dark:bg-gray-600" : ""
                          }`}
                          onMouseEnter={() => {
                            setHoverSubId(sub._id);
                            loadChilds(sub._id);
                          }}
                        >
                          <Link
                            to={`/shop?category=${encodeURIComponent(
                              getCatName(hoverCatId)
                            )}&sub=${encodeURIComponent(sub.name)}`}
                            onClick={() => setCategoryShow(false)}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-sm text-gray-400">Select a category</li>
                    )}
                  </ul>
                </div>

                {/* Column 3: Child Categories */}
                <div className="max-h-[320px] overflow-auto">
                  <h4 className="px-4 pt-3 text-xs uppercase tracking-wider text-gray-500">
                    Child Categories
                  </h4>
                  <ul className="py-2">
                    {loadingChild && !childMap[hoverSubId] ? (
                      <li className="px-4 py-2 text-sm text-gray-400">Loading...</li>
                    ) : (childMap[hoverSubId] || []).length ? (
                      (childMap[hoverSubId] || []).map((child) => (
                        <li
                          key={child._id}
                          className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          <Link
                            to={`/shop?category=${encodeURIComponent(
                              getCatName(hoverCatId)
                            )}&sub=${encodeURIComponent(
                              getSubName(hoverCatId, hoverSubId)
                            )}&child=${encodeURIComponent(child.name)}`}
                            onClick={() => setCategoryShow(false)}
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-sm text-gray-400">Select a sub category</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Mobile Fullscreen Left-to-Right Panels */}
            {isMobile && categoryShow && (
              <div className="fixed inset-0 z-[9995] bg-white dark:bg-gray-800 flex flex-col">
                {/* Top bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    {mobileLevel > 0 ? (
                      <button
                        onClick={() => setMobileLevel((l) => Math.max(0, l - 1))}
                        className="p-2 -ml-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="Back"
                      >
                        <IoChevronBack size={20} />
                      </button>
                    ) : null}
                    <span className="font-semibold">
                      {mobileLevel === 0
                        ? "All Categories"
                        : mobileLevel === 1
                        ? getCatName(hoverCatId) || "Sub Categories"
                        : getSubName(hoverCatId, hoverSubId) || "Child Categories"}
                    </span>
                  </div>
                  <button
                    onClick={closeMobile}
                    className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Close"
                  >
                    Close
                  </button>
                </div>

                {/* Panels slider */}
                <div className="flex-1 overflow-hidden">
                  <div
                    className="h-full w-[300%] flex transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${mobileLevel * 100}%)` }}
                  >
                    {/* Panel 0: Categories */}
                    <div className="w-full h-full overflow-y-auto">
                      <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                        {categories?.map((cat) => (
                          <li key={cat._id}>
                            <button
                              onClick={() => selectMobileCat(cat._id)}
                              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <div className="flex items-center gap-3">
                                <img src={cat?.image} alt={cat?.name} className="w-7 h-7 rounded" />
                                <span className="text-sm">{cat?.name}</span>
                              </div>
                              <IoChevronForward className="text-gray-400" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Panel 1: Sub Categories */}
                    <div className="w-full h-full overflow-y-auto">
                      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <Link
                          to={`/shop?category=${encodeURIComponent(getCatName(hoverCatId))}`}
                          onClick={closeMobile}
                          className="inline-flex items-center text-xs px-2.5 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          Shop all in {getCatName(hoverCatId) || "Category"}
                        </Link>
                      </div>
                      <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                        {loadingSub && !subMap[hoverCatId] ? (
                          <li className="px-4 py-3 text-sm text-gray-400">Loading...</li>
                        ) : (subMap[hoverCatId] || []).length ? (
                          (subMap[hoverCatId] || []).map((sub) => (
                            <li key={sub._id}>
                              <button
                                onClick={() => selectMobileSub(sub._id)}
                                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                <span className="text-sm">{sub.name}</span>
                                <IoChevronForward className="text-gray-400" />
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-3 text-sm text-gray-400">No sub categories</li>
                        )}
                      </ul>
                    </div>

                    {/* Panel 2: Child Categories */}
                    <div className="w-full h-full overflow-y-auto">
                      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <Link
                          to={`/shop?category=${encodeURIComponent(
                            getCatName(hoverCatId)
                          )}&sub=${encodeURIComponent(getSubName(hoverCatId, hoverSubId))}`}
                          onClick={closeMobile}
                          className="inline-flex items-center text-xs px-2.5 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          Shop all in {getSubName(hoverCatId, hoverSubId) || "Sub"}
                        </Link>
                      </div>
                      <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                        {loadingChild && !childMap[hoverSubId] ? (
                          <li className="px-4 py-3 text-sm text-gray-400">Loading...</li>
                        ) : (childMap[hoverSubId] || []).length ? (
                          (childMap[hoverSubId] || []).map((child) => (
                            <li key={child._id}>
                              <Link
                                to={`/shop?category=${encodeURIComponent(
                                  getCatName(hoverCatId)
                                )}&sub=${encodeURIComponent(
                                  getSubName(hoverCatId, hoverSubId)
                                )}&child=${encodeURIComponent(child.name)}`}
                                onClick={closeMobile}
                                className="block px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                {child.name}
                              </Link>
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-3 text-sm text-gray-400">No child categories</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar with 3-level selects (responsive) */}
          <div className="flex-1 w-full">
            <form
              onSubmit={handleSearch}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded md:rounded-full shadow-sm overflow-hidden p-2 md:p-0"
            >
              <div className="flex flex-col md:flex-row items-stretch gap-2 md:gap-0">
                {/* Category select (always visible) */}
                <select
                  id="category"
                  name="category"
                  onChange={(e) => setSelCatId(e.target.value)}
                  value={selCatId}
                  className="w-full md:w-auto px-3 py-2 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 md:border-r border-gray-300 dark:border-gray-600 cursor-pointer"
                >
                  <option value="">Category</option>
                  {categories?.map((cat) => (
                    <option value={cat?._id} key={cat?._id}>
                      {cat?.name}
                    </option>
                  ))}
                </select>

                {/* Sub select: mobile-এ hidden যদি category সিলেক্ট না করা থাকে */}
                <select
                  id="sub_category"
                  name="sub_category"
                  onChange={(e) => setSelSubId(e.target.value)}
                  value={selSubId}
                  disabled={!selCatId}
                  className={`${selCatId ? "block" : "hidden"} md:block w-full md:w-auto px-3 py-2 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 md:border-r border-gray-300 dark:border-gray-600 cursor-pointer ${!selCatId ? "md:opacity-60" : ""}`}
                  aria-hidden={!selCatId}
                >
                  <option value="">{selCatId ? "Sub Category" : "Select Category"}</option>
                  {(subMap[selCatId] || []).map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                {/* Child select: mobile-এ hidden যদি subcategory সিলেক্ট না করা থাকে */}
                <select
                  id="child_category"
                  name="child_category"
                  onChange={(e) => setSelChildId(e.target.value)}
                  value={selChildId}
                  disabled={!selSubId}
                  className={`${selSubId ? "block" : "hidden"} md:block w-full md:w-auto px-3 py-2 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 md:border-r border-gray-300 dark:border-gray-600 cursor-pointer ${!selSubId ? "md:opacity-60" : ""}`}
                  aria-hidden={!selSubId}
                >
                  <option value="">{selSubId ? "Child Category" : "Select Sub"}</option>
                  {(childMap[selSubId] || []).map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {/* Search input + button */}
                <div className="flex w-full md:flex-1">
                  <input
                    id="search_field"
                    name="search_field"
                    onChange={(e) => setSearchValue(e.target.value)}
                    value={searchValue}
                    type="text"
                    placeholder="What do you need?"
                    className="flex-1 px-3 py-2 outline-none bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    className="w-full md:w-auto bg-brand-dark hover:bg-brand md:px-6 py-2 font-semibold transition-all cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Contact */}
          <div className="hidden lg:flex items-center gap-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
            <FaWhatsapp className="text-brand-dark text-xl" />
            <a
              href="https://wa.me/8801749889595"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-green-700"
            >
              <p className="text-xs font-medium">Hotline</p>
              <p className="text-sm font-bold">+880 1749-889595</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;