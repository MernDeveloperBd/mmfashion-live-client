import { useState, useEffect, useRef } from "react";
import { FaList, FaWhatsapp } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import api from "../../Api/api";

const toKey = (x) => (x !== undefined && x !== null ? String(x) : "");

const Navbar = ({ categories }) => {
  const [categoryShow, setCategoryShow] = useState(false);

  // Mega menu hover/click states
  const [hoverCatId, setHoverCatId] = useState("");
  const [hoverSubId, setHoverSubId] = useState("");

  // Cache maps
  const [subMap, setSubMap] = useState({});     // { [catId: string]: subCategories[] }
  const [childMap, setChildMap] = useState({}); // { [subId: string]: childCategories[] }
  const [loadingSub, setLoadingSub] = useState(false);
  const [loadingChild, setLoadingChild] = useState(false);

  // Search states
  const [selCatId, setSelCatId] = useState("");
  const [selSubId, setSelSubId] = useState("");
  const [selChildId, setSelChildId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  // Close on outside click/touch
  useEffect(() => {
    const h = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCategoryShow(false);
      }
    };
    if (categoryShow) {
      document.addEventListener("mousedown", h);
      document.addEventListener("touchstart", h);
    }
    return () => {
      document.removeEventListener("mousedown", h);
      document.removeEventListener("touchstart", h);
    };
  }, [categoryShow]);

  // Load sub-categories for a category
  const loadSubs = async (catIdRaw) => {
    const catId = toKey(catIdRaw);
    if (!catId || subMap[catId]) return;
    try {
      setLoadingSub(true);
      const { data } = await api.get(`/sub-category-get?categoryId=${encodeURIComponent(catId)}`, { withCredentials: true });
      const list = data?.subCategories || data?.subCategory || data?.data || [];
      setSubMap((prev) => ({ ...prev, [catId]: list }));
    } catch (e) {
      // optionally console.error(e);
    } finally {
      setLoadingSub(false);
    }
  };

  // Load child-categories for a sub-category
  const loadChilds = async (subIdRaw) => {
    const subId = toKey(subIdRaw);
    if (!subId || childMap[subId]) return;
    try {
      setLoadingChild(true);
      const { data } = await api.get(`/child-category-get?subcategoryId=${encodeURIComponent(subId)}`, { withCredentials: true });
      const list = data?.childCategories || data?.childCategory || data?.data || [];
      setChildMap((prev) => ({ ...prev, [subId]: list }));
    } catch (e) {
      // optionally console.error(e);
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

  const getCatName = (id) =>
    categories?.find((c) => toKey(c._id) === toKey(id))?.name || "";

  const getSubName = (catId, subId) =>
    (subMap[toKey(catId)] || []).find((s) => toKey(s._id) === toKey(subId))?.name || "";

  const getChildName = (subId, childId) =>
    (childMap[toKey(subId)] || []).find((c) => toKey(c._id) === toKey(childId))?.name || "";

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (selCatId) params.set("category", getCatName(selCatId));
    if (selSubId) params.set("sub", getSubName(selCatId, selSubId));
    if (selChildId) params.set("child", getChildName(selSubId, selChildId));
    const v = searchValue.trim();
    if (v) params.set("value", v);

    const qs = params.toString();
    navigate(`/shop${qs ? `?${qs}` : ""}`);
    setCategoryShow(false);
  };

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-800 py-1.5">
      <div className="w-full md:w-[95%] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {/* Category Dropdown (Mega menu) */}
          <div className="w-full md:w-auto relative z-[9990]" ref={dropdownRef}>
            <button
              onClick={() => setCategoryShow(!categoryShow)}
              className="w-full md:w-64 flex items-center justify-between bg-brand-dark hover:bg-brand px-3 md:px-5 py-2 md:py-3 rounded-lg font-semibold text-sm transition-all shadow-md cursor-pointer hover:bg-gray-100"
              aria-expanded={categoryShow}
            >
              <div className="flex items-center gap-2">
                <FaList size={18} />
                <span>All Category</span>
              </div>
              <IoIosArrowDown className={`transition-transform duration-300 ${categoryShow ? "rotate-180" : ""}`} />
            </button>

            {/* Mega Dropdown */}
            <div className={`absolute top-full left-0 w-full md:w-[720px] mt-2 bg-white dark:bg-gray-700 rounded-lg shadow-xl overflow-hidden transition-all duration-200 ${categoryShow ? "opacity-100 visible" : "opacity-0 invisible"}`}>
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Column 1: Categories */}
                <div className="max-h-[320px] overflow-auto border-r dark:border-gray-600">
                  <ul className="py-2">
                    {categories?.map((cat) => {
                      const id = toKey(cat?._id);
                      return (
                        <li
                          key={id}
                          className={`flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer ${hoverCatId === id ? "bg-gray-100 dark:bg-gray-600" : ""}`}
                          onMouseEnter={() => { setHoverCatId(id); setHoverSubId(""); loadSubs(id); }}
                          onClick={() => { setHoverCatId(id); setHoverSubId(""); loadSubs(id); }}
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
                      );
                    })}
                  </ul>
                </div>

                {/* Column 2: Sub Categories */}
                <div className="max-h-[320px] overflow-auto border-r dark:border-gray-600">
                  <h4 className="px-4 pt-3 text-xs uppercase tracking-wider text-gray-500">Sub Categories</h4>
                  <ul className="py-2">
                    {loadingSub && !subMap[hoverCatId] ? (
                      <li className="px-4 py-2 text-sm text-gray-400">Loading...</li>
                    ) : (subMap[hoverCatId] || []).length ? (
                      (subMap[hoverCatId] || []).map((sub) => {
                        const sid = toKey(sub._id);
                        return (
                          <li
                            key={sid}
                            className={`px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer ${hoverSubId === sid ? "bg-gray-100 dark:bg-gray-600" : ""}`}
                            onMouseEnter={() => { setHoverSubId(sid); loadChilds(sid); }}
                            onClick={() => { setHoverSubId(sid); loadChilds(sid); }}
                          >
                            <Link
                              to={`/shop?category=${encodeURIComponent(getCatName(hoverCatId))}&sub=${encodeURIComponent(sub.name)}`}
                              onClick={() => setCategoryShow(false)}
                            >
                              {sub.name}
                            </Link>
                          </li>
                        );
                      })
                    ) : (
                      <li className="px-4 py-2 text-sm text-gray-400">Select a category</li>
                    )}
                  </ul>
                </div>

                {/* Column 3: Child Categories */}
                <div className="max-h-[320px] overflow-auto">
                  <h4 className="px-4 pt-3 text-xs uppercase tracking-wider text-gray-500">Child Categories</h4>
                  <ul className="py-2">
                    {loadingChild && !childMap[hoverSubId] ? (
                      <li className="px-4 py-2 text-sm text-gray-400">Loading...</li>
                    ) : (childMap[hoverSubId] || []).length ? (
                      (childMap[hoverSubId] || []).map((child) => {
                        const cid = toKey(child._id);
                        return (
                          <li key={cid} className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                            <Link
                              to={`/shop?category=${encodeURIComponent(getCatName(hoverCatId))}&sub=${encodeURIComponent(getSubName(hoverCatId, hoverSubId))}&child=${encodeURIComponent(child.name)}`}
                              onClick={() => setCategoryShow(false)}
                            >
                              {child.name}
                            </Link>
                          </li>
                        );
                      })
                    ) : (
                      <li className="px-4 py-2 text-sm text-gray-400">Select a sub category</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar with 3-level selects (responsive) */}
          <div className="flex-1 w-full">
            <form onSubmit={handleSearch} className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded md:rounded-full shadow-sm overflow-hidden p-2 md:p-0">
              <div className="flex flex-col md:flex-row items-stretch gap-2 md:gap-0">
                {/* Category select */}
                <select
                  id="category"
                  name="category"
                  onChange={(e) => {
                    const v = toKey(e.target.value);
                    setSelCatId(v);
                    setSelSubId("");
                    setSelChildId("");
                    loadSubs(v); // immediate fetch
                  }}
                  value={toKey(selCatId)}
                  className="w-full md:w-auto px-3 py-2 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 md:border-r border-gray-300 dark:border-gray-600 cursor-pointer"
                >
                  <option value="">Category</option>
                  {categories?.map((cat) => (
                    <option value={toKey(cat?._id)} key={toKey(cat?._id)}>
                      {cat?.name}
                    </option>
                  ))}
                </select>

                {/* Sub select */}
                <select
                  id="sub_category"
                  name="sub_category"
                  onChange={(e) => {
                    const v = toKey(e.target.value);
                    setSelSubId(v);
                    setSelChildId("");
                    loadChilds(v); // immediate fetch
                  }}
                  value={toKey(selSubId)}
                  disabled={!selCatId}
                  className="w-full md:w-auto px-3 py-2 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 md:border-r border-gray-300 dark:border-gray-600 cursor-pointer disabled:opacity-60"
                >
                  <option value="">{selCatId ? (loadingSub && !(subMap[selCatId]?.length) ? "Loading..." : "Sub Category") : "Select Category"}</option>
                  {(subMap[toKey(selCatId)] || []).map((s) => (
                    <option key={toKey(s._id)} value={toKey(s._id)}>
                      {s.name}
                    </option>
                  ))}
                </select>

                {/* Child select */}
                <select
                  id="child_category"
                  name="child_category"
                  onChange={(e) => setSelChildId(toKey(e.target.value))}
                  value={toKey(selChildId)}
                  disabled={!selSubId}
                  className="w-full md:w-auto px-3 py-2 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 md:border-r border-gray-300 dark:border-gray-600 cursor-pointer disabled:opacity-60"
                >
                  <option value="">{selSubId ? (loadingChild && !(childMap[selSubId]?.length) ? "Loading..." : "Child Category") : "Select Sub"}</option>
                  {(childMap[toKey(selSubId)] || []).map((c) => (
                    <option key={toKey(c._id)} value={toKey(c._id)}>
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
                  <button type="submit" className="w-full md:w-auto bg-brand-dark hover:bg-brand md:px-6 py-2 font-semibold transition-all cursor-pointer">
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