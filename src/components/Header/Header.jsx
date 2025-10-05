import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoMdMail, IoMdArrowDropdown, IoMdSearch, IoMdClose } from "react-icons/io";
import { FaFacebook, FaHeart, FaInstagram, FaLock, FaShoppingCart, FaUser, FaHome, FaList, FaPhone, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { BsShop } from "react-icons/bs"; 
import flag from '../../assets/flag.png';
import Navbar from "./Navbar";
import { useSelector } from "react-redux";

// --- ব্যাজ কম্পোনেন্ট ---
const Badge = ({ count, children }) => {
    if (count === 0) return children;
    return (
        <div className="relative">
            {children}
            <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full dark:bg-red-600 animate-pulse">
                {count > 99 ? '99+' : count}
            </span>
        </div>
    );
};

const Header = () => {
    const { categories} = useSelector(state => state.home)
    const location = useLocation();
    const [showSidebar, setShowSidebar] = useState(false);
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
    const langDropdownRef = useRef(null);

    // হেডার দেখানো বা লুকানোর জন্য স্টেট এবং রেফ
    const [showHeader, setShowHeader] = useState(true);
    const lastScrollY = useRef(0);
    const scrollThreshold = 100;

    // মক ডেটা
    const [wishlistCount, setWishlistCount] = useState(3);
    const [cartCount, setCartCount] = useState(7);
    const user = true;

    // স্ক্রল ইভেন্ট হ্যান্ডেল করার জন্য useEffect
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY <= scrollThreshold) {
                setShowHeader(true);
            } else if (currentScrollY > lastScrollY.current) {
                setShowHeader(false);
            } else {
                setShowHeader(true);
            }
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // সাইডবার খোলা থাকলে বডি স্ক্রল লক
    useEffect(() => {
        if (showSidebar) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showSidebar]);

    // ড্রপডাউনের বাইরে ক্লিক করলে বন্ধ করার জন্য
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
                setIsLangDropdownOpen(false);
            }
        };
        if (isLangDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isLangDropdownOpen]);

    return (
        <>
            <div className={`sticky top-0 z-40 transition-transform duration-300 ease-in-out ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
                {/* --- ডেস্কটপ হেডার --- */}
                <header className="hidden md:block w-full bg-white dark:bg-gray-900 shadow-sm transition-colors duration-300">
                    <div className="w-[95%] mx-auto">
                        {/* টপ বার */}
                        <div className="flex justify-between items-center h-[40px] text-sm text-gray-600 dark:text-gray-300 border-b dark:border-gray-800">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-2"><IoMdMail className="text-brand" />marifamisam@gmail.com</span>
                                <span className="text-xs">|</span>
                                <span className="font-medium">Multivendor E-commerce</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <a href="#" className="hover:text-brand transition-colors"><FaFacebook /></a>
                                    <a href="#" className="hover:text-brand transition-colors"><FaInstagram /></a>
                                </div>
                                <div className="relative group">
                                    <button className="flex items-center gap-1 text-sm font-medium hover:text-brand transition-colors">
                                        <img src={flag} alt="flag" className="h-5 rounded" />
                                        <IoMdArrowDropdown size={20} />
                                    </button>
                                    <ul className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 top-8 right-0 bg-white dark:bg-gray-700 shadow-lg rounded-md w-[100px] z-50">
                                        <li><button className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">English</button></li>
                                        <li><button className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">বাংলা</button></li>
                                    </ul>
                                </div>
                                {user ? <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium hover:text-brand transition-colors"><FaUser /> <span>Marifa Akter</span></Link> : <Link to="/login" className="flex items-center gap-2 text-sm font-medium hover:text-brand transition-colors"><FaLock /> <span>Login</span></Link>}
                            </div>
                        </div>
                        {/* মেইন নেভিগেশন বার */}
                        <div className="flex justify-between items-center h-[45px] pt-1.5">
                            <Link to='/' className="w-[48px]"><img src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1757668954/Misam_Marifa_Fashion_World_oo94yx.png" alt="logo" className="w-full h-auto" /></Link>
                            <nav className="flex items-center gap-6">
                                <Link to='/' className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-brand dark:text-brand-light' : 'hover:text-brand'}`}>Home</Link>
                                <Link to='/shop' className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/shop' ? 'text-brand dark:text-brand-light' : 'hover:text-brand'}`}>Shop</Link>
                                <Link to='/contact' className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/contact' ? 'text-brand dark:text-brand-light' : 'hover:text-brand'}`}>Contact</Link>
                            </nav>
                            <div className="flex items-center gap-3">
                                <Badge count={wishlistCount}><button className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-brand hover:text-white transition-all duration-300"><FaHeart size={16} /></button></Badge>
                                <Badge count={cartCount}><button className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-brand hover:text-white transition-all duration-300"><FaShoppingCart size={16} /></button></Badge>
                            </div>
                        </div>
                    </div>
                </header>

                {/* --- মোবাইল হেডার --- */}
                <header className="md-lg:hidden w-full bg-white dark:bg-gray-900 shadow-sm transition-colors duration-300">
                    <div className="flex items-center justify-between gap-4 p-1">
                        <button onClick={() => setShowSidebar(true)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><FaList size={22} /></button>
                        <Link to='/' className="w-12 flex-shrink-0"><img src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1757668954/Misam_Marifa_Fashion_World_oo94yx.png" alt="logo" className="w-full h-auto" /></Link>
                        <div className="flex-1 relative max-w-xs">
                            <input type="text" placeholder="Search..." className="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-brand" />
                            <IoMdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div>
                </header>

                <Navbar categories={categories}/>
            </div>

            {/* --- মোবাইল বটম নেভিগেশন বার --- */}
            <nav className="md-lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t pt-1.5 dark:border-gray-700 z-[1000]">
                <ul className="flex justify-around items-center h-12">
                    <li><Link to="/" className={`flex flex-col items-center gap-1 p-2 ${location.pathname === '/' ? 'text-brand' : 'text-gray-600 dark:text-gray-400'}`}><FaHome size={17} /><span className="text-[10px]">Home</span></Link></li>
                    <li><Link to="/shop" className={`flex flex-col items-center gap-1 p-2 ${location.pathname === '/shop' ? 'text-brand' : 'text-gray-600 dark:text-gray-400'}`}><BsShop size={17} /><span className="text-[10px]">Shop</span></Link></li>
                    <li><button className="flex flex-col items-center gap-1 p-2 text-gray-600 dark:text-gray-400"><Badge count={wishlistCount}><FaHeart size={17} /></Badge><span className="text-[10px]">Wishlist</span></button></li>
                    <li><button className="flex flex-col items-center gap-1 p-2 text-gray-600 dark:text-gray-400"><Badge count={cartCount}><FaShoppingCart size={17} /></Badge><span className="text-[10px]">Cart</span></button></li>
                    <li>{user ? <Link to="/dashboard" className={`flex flex-col items-center gap-1 p-2 ${location.pathname.startsWith('/dashboard') ? 'text-brand' : 'text-gray-600 dark:text-gray-400'}`}><FaUser size={17} /><span className="text-[10px]">Profile</span></Link> : <Link to="/login" className="flex flex-col items-center gap-1 p-2 text-gray-600 dark:text-gray-400"><FaLock size={17} /><span className="text-[10px]">Login</span></Link>}</li>
                </ul>
            </nav>

            {/* --- মোবাইল সাইডবার --- */}
            <div className={`fixed top-0 left-0 h-full w-[80%] max-w-xs bg-white dark:bg-gray-900 shadow-2xl flex flex-col transition-transform duration-300 z-[9999] ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-2 flex justify-between items-center border-b dark:border-gray-700 flex-shrink-0">
                    <h2 className="text-sm font-bold">MM Fashion World</h2>
                    <button onClick={() => setShowSidebar(false)} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"><IoMdClose size={24} /></button>
                </div>
                {/* Main navigation links */}
                <nav className="p-4 flex-1 overflow-y-auto">
                    <Link onClick={() => setShowSidebar(false)} to='/contact' className={`flex items-center gap-3 px-3 py-2 rounded-md text-[14px] font-medium transition-colors ${location.pathname === '/contact' ? 'text-brand dark:text-brand-light bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>Contact Us</Link>
                    <Link onClick={() => setShowSidebar(false)} to='/about' className={`flex items-center gap-3 px-3 py-2 rounded-md text-[14px] font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800`}>About Us</Link>
                    {user ? <Link onClick={() => setShowSidebar(false)} to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md text-[14px] font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"><FaUser /> <span>Dashboard</span></Link> : <Link onClick={() => setShowSidebar(false)} to="/login" className="flex items-center gap-3 px-3 py-2 rounded-md text-[14px] font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"><FaLock /> <span>Login / Register</span></Link>}
                </nav>

                {/* --- পরিবর্তন ২: সাইডবারের নিচের অংশ আপডেট করা হয়েছে --- */}
                <div className="p-4 border-t dark:border-gray-700 flex-shrink-0">
                    <div className="flex flex-col gap-4">
                        {/* কন্টাক্ট ইনফো */}
                        <div>
                            <a href="tel:+8801234567890" className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light transition-colors">
                                <FaPhone />
                                <span>+880 1749 88 9595</span>
                            </a>
                        </div>
                        {/* সোশ্যাল মিডিয়া লিংক */}
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Follow Us</h3>
                            <div className="flex gap-4">
                                <a href="#" className="text-gray-500 hover:text-brand dark:hover:text-brand-light transition-all duration-300"><FaFacebook size={20} /></a>
                                <a href="#" className="text-gray-500 hover:text-brand dark:hover:text-brand-light transition-all duration-300"><FaInstagram size={20} /></a>
                                <a href="#" className="text-gray-500 hover:text-brand dark:hover:text-brand-light transition-all duration-300"><FaTwitter size={20} /></a>
                                <a
                                    href="https://wa.me/8801749889595"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-brand dark:hover:text-brand-light transition-all duration-300"
                                >
                                    <FaWhatsapp size={20} />
                                </a>
                            </div>
                        </div>
                        {/* ল্যাঙ্গুয়েজ ড্রপডাউন */}
                        <div ref={langDropdownRef} className="relative">
                            <button onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)} className="flex items-center justify-between w-full text-sm font-medium hover:text-brand transition-colors">
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

            {showSidebar && (<div className="fixed inset-0 bg-black bg-opacity-50 z-40 md-lg:hidden" onClick={() => setShowSidebar(false)}></div>)}
        </>
    );
};

export default Header;