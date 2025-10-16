import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMdMail, IoMdArrowDropdown, IoMdClose } from "react-icons/io";
import { FaFacebook, FaHeart, FaInstagram, FaLock, FaShoppingCart, FaUser, FaHome, FaList, FaPhone, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { BsShop } from "react-icons/bs";
import flag from '../../assets/flag.png';
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { BsChat } from "react-icons/bs";
import { get_card_products, get_wishlist_products } from "../../store/Reducers/cardReducer";
import BecomeSellerBtn from "../BecomeSellerBtn";

// Badge
const Badge = ({ count, children }) => {
  if (!count || count === 0) return children;
  return (
    <div className="relative">
      {children}
      <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full dark:bg-red-600">
        {count > 99 ? '99+' : count}
      </span>
    </div>
  );
};

const Header = () => {
  const dispatch = useDispatch();
  const { card_product_count, wishlist_count } = useSelector(state => state.card);
  const { categories } = useSelector(state => state.home); // top-level categories
  const { userInfo } = useSelector(state => state.auth);
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);
  const navigate = useNavigate();

  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = 100;

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current <= scrollThreshold) setShowHeader(true);
      else if (current > lastScrollY.current) setShowHeader(false);
      else setShowHeader(true);
      lastScrollY.current = current;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showSidebar ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showSidebar]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setIsLangDropdownOpen(false);
      }
    };
    if (isLangDropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLangDropdownOpen]);

  const redirect_card_page = () => navigate(userInfo ? "/card" : "/login");
  const redirect_wishlist_page = () => navigate(userInfo ? "/dashboard/my-wishlist" : "/login");

  useEffect(() => {
    if (userInfo) {
      dispatch(get_card_products(userInfo.id));
      dispatch(get_wishlist_products(userInfo.id));
    }
  }, [dispatch, userInfo]);

  return (
    <>
      <div className={`sticky -top-10 z-40 transition-transform duration-300 ease-in-out ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        {/* Desktop Header */}
        <header className="hidden md:block w-full bg-white dark:bg-gray-900 shadow-sm">
          <div className="w-[95%] mx-auto">
            <div className="flex justify-between items-center h-[40px] text-sm text-gray-600 dark:text-gray-300 border-b dark:border-gray-800">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2"><IoMdMail className="text-brand" />marifamisam@gmail.com</span>
                <span className="text-xs">|</span>
                <span className="font-medium">Multivendor E-commerce</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <a href="https://www.facebook.com/mmfashionworldonline" target="_blank" className="hover:text-brand"><FaFacebook /></a>
                  <a href="#" className="hover:text-brand"><FaInstagram /></a>
                </div>
                <div className="relative group">
                  <button className="flex items-center gap-1 text-sm font-medium hover:text-brand">
                    <img src={flag} alt="flag" className="h-5 rounded" />
                    <IoMdArrowDropdown size={20} />
                  </button>
                  <ul className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 top-8 right-0 bg-white dark:bg-gray-700 shadow-lg rounded-md w-[100px] z-50">
                    <li><button className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">English</button></li>
                    <li><button className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">বাংলা</button></li>
                  </ul>
                </div>
                {userInfo ? (
                  <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium hover:text-brand"><span><FaUser /></span><span>{userInfo?.name}</span></Link>
                ) : (
                  <Link to="/login" className="flex items-center gap-2 text-sm font-medium hover:text-brand"><FaLock /><span>Login</span></Link>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center h-[45px] pt-1.5">
              <Link to='/' className="font-bold text-[#0d6b54]"><h2>MM <span className="text-[#074d3c]">FASHION</span> WORLD</h2></Link>
              <nav className="flex items-center gap-6">
                <Link to='/' className={`px-3 py-2 text-sm font-medium ${location.pathname === '/' ? 'text-violet-600' : 'hover:text-brand'}`}>Home</Link>
                <Link to='/shop' className={`px-3 py-2 text-sm font-medium ${location.pathname === '/shop' ? 'text-violet-600' : 'hover:text-brand'}`}>Shop</Link>
                <Link to='/contact-us' className={`px-3 py-2 text-sm font-medium ${location.pathname === '/contact-us' ? 'text-violet-600' : 'hover:text-brand'}`}>Contact</Link>
              </nav>
              <div className="flex items-center gap-3">
                <button type="button" className=" text-[#0d6b54] hover:bg-gray-200 font-semibold text-sm">
                  <BecomeSellerBtn/>
                </button>
                <Badge count={wishlist_count || 0}>
                  <button onClick={redirect_wishlist_page} className="cartBtn"><FaHeart size={16} /></button>
                </Badge>
                <Badge count={card_product_count || 0}>
                  <button onClick={redirect_card_page} className="cartBtn"><FaShoppingCart size={16} /></button>
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="md-lg:hidden w-full bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between gap-4 p-1">
            <button onClick={() => setShowSidebar(true)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"><FaList size={22} /></button>
            <button type="button" className="text-[#0d6b54] text-sm px-3">
              <BecomeSellerBtn/>
            </button>
            <Link to='/' className="w-12 flex-shrink-0"><img src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1757668954/Misam_Marifa_Fashion_World_oo94yx.png" alt="logo" className="w-full h-auto" /></Link>
          </div>
        </header>

        <Navbar categories={categories} />
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md-lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t pt-1.5 dark:border-gray-700 z-[1000]">
        <ul className="flex justify-around items-center h-12">
          <li><Link to="/" className={`navBtn ${location.pathname === '/' ? 'text-violet-600' : 'text-gray-600 dark:text-gray-400'}`}><FaHome size={17} /><span className="text-[10px]">Home</span></Link></li>
          <li><Link to="/shop" className={`navBtn ${location.pathname === '/shop' ? 'text-violet-600' : 'text-gray-600 dark:text-gray-400'}`}><BsShop size={17} /><span className="text-[10px]">Shop</span></Link></li>
          <li><button onClick={redirect_wishlist_page} className="navBtn text-gray-600 dark:text-gray-400"><Badge count={wishlist_count || 0}><FaHeart size={17} /></Badge><span className="text-[10px]">Wishlist</span></button></li>
          <li><button onClick={redirect_card_page} className="navBtn text-gray-600 dark:text-gray-400"><Badge count={card_product_count || 0}><FaShoppingCart size={17} /></Badge><span className="text-[10px]">Cart</span></button></li>
          <li>{userInfo ? <Link to="/dashboard" className={`navBtn ${location.pathname.startsWith('/dashboard') ? 'text-brand' : 'text-gray-600 dark:text-gray-400'}`}><FaUser size={17} /><span className="text-[10px]">Profile</span></Link> : <Link to="/login" className="navBtn text-gray-600 dark:text-gray-400"><FaLock size={17} /><span className="text-[10px]">Login</span></Link>}</li>
        </ul>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-[80%] max-w-xs bg-white dark:bg-gray-900 shadow-2xl flex flex-col transition-transform duration-300 z-[9999] ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-2 flex justify-between items-center border-b dark:border-gray-700">
          <h2 className="text-sm font-bold">MM Fashion World</h2>
          <button onClick={() => setShowSidebar(false)} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"><IoMdClose size={24} /></button>
        </div>
        <nav className="p-4 flex-1 overflow-y-auto">
          <Link onClick={() => setShowSidebar(false)} to='/' className={`navBtn1 transition-colors ${location.pathname === '/' ? 'text-brand bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>Home</Link>
          <Link onClick={() => setShowSidebar(false)} to='/shop' className={`navBtn1 transition-colors ${location.pathname === '/shop' ? 'text-brand bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>Shop</Link>
          <Link onClick={() => setShowSidebar(false)} to='/contact-us' className={`navBtn1 transition-colors ${location.pathname === '/contact-us' ? 'text-brand bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>Contact Us</Link>
          <Link onClick={() => setShowSidebar(false)} to='/dashboard/chat' className="flex items-center gap-2 px-3 py-2 rounded-md text-[14px] font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"><BsChat />Chat</Link>
          <Link onClick={() => setShowSidebar(false)} to='/about' className="navBtn1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">About Us</Link>
          {userInfo ? <Link onClick={() => setShowSidebar(false)} to="/dashboard" className="navBtn1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"><FaUser /> <span>Dashboard</span></Link> : <Link onClick={() => setShowSidebar(false)} to="/login" className="navBtn1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"><FaLock /> <span>Login / Register</span></Link>}
          <button type="button" className="text-[#0d6b54] text-sm px-3 font-bold bg-gray-100 hover:bg-gray-200 py-1 rounded">
           <BecomeSellerBtn/>
          </button>
        </nav>

        <div className="p-4 border-t dark:border-gray-700">
          <div className="flex flex-col gap-4">
            <div>
              <a href="tel:+8801749889595" className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:text-brand"><FaPhone /><span>+880 1749 88 9595</span></a>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Follow Us</h3>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/mmfashionworldonline" target="_blank" className="socialBtn"><FaFacebook size={20} /></a>
                <a href="#" className="socialBtn"><FaInstagram size={20} /></a>
                <a href="https://wa.me/8801749889595" target="_blank" rel="noopener noreferrer" className="socialBtn"><FaWhatsapp size={20} /></a>
              </div>
            </div>
            <div ref={langDropdownRef} className="relative">
              <button onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)} className="flex items-center justify-between w-full text-sm font-medium hover:text-brand">
                <span className="flex items-center gap-2"><img src={flag} alt="flag" className="h-5 rounded" />Language</span>
                <IoMdArrowDropdown size={20} />
              </button>
              <ul className={`absolute left-0 bottom-full mb-2 bg-white dark:bg-gray-700 shadow-lg rounded-md w-[120px] z-50 transition-all duration-200 ${isLangDropdownOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                <li><button className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">English</button></li>
                <li><button className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">বাংলা</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showSidebar && <div className="fixed inset-0 bg-black/50 z-40 md-lg:hidden" onClick={() => setShowSidebar(false)} />}
    </>
  );
};

export default Header;