import { useState } from "react";
import { FaList, FaWhatsapp } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";



const Navbar = ({categories}) => {
    const [categoryShow, setCategoryShow] = useState(false);
    const [category, setCategory] = useState("");
    const [searchValue, setSearchValue] = useState("");
    // const categories = ["Fashion", "Electronics", "Home & Living", "Sports"];

    return (
        <div className="w-full bg-gray-50 dark:bg-gray-800 py-1.5 transition-colors duration-300 ">
            <div className="w-full md:w-[95%] mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">

                    {/* --- ক্যাটেগরি ড্রপডাউন --- */}
                    <div className="w-full md:w-auto relative z-[9990]">
                        <button
                            onClick={() => setCategoryShow(!categoryShow)}
                            className="w-full md:w-64 flex items-center justify-between bg-brand-dark hover:bg-brand  px-5 py-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-md cursor-pointer"
                        >
                            <div className="flex items-center gap-2">
                                <FaList />
                                <span>All Category</span>
                            </div>
                            <IoIosArrowDown className={`transition-transform duration-300 ${categoryShow ? 'rotate-180' : ''}`} />
                        </button>

                        <div className={`absolute top-full left-0 w-full md:w-64 mt-2 bg-white dark:bg-gray-700 rounded-lg shadow-xl overflow-hidden transition-all duration-300 transform origin-top ${categoryShow ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
                            <ul className="py-2 overflow-auto">
                                {categories?.map((cat, i) => (
                                    <li key={i} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <Link to={`/product/${cat.slug}`} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                                            <img src={cat?.image} alt="category_image" className="w-6 h-6 rounded" />
                                            <span>{cat?.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* --- সার্চ বার --- */}
                    <div className="flex-1 w-full">
                     <div className="hidden md:block">
   <div className="flex items-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded md:rounded-full shadow-sm focus-within:ring-2 focus-within:ring-brand-dark overflow-hidden">
                            <select
                                onChange={(e) => setCategory(e.target.value)}
                                value={category}
                                className="px-4 py-2 bg-transparent outline-none text-sm text-gray-600 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600 cursor-pointer"
                            >
                                <option value="">Select Category</option>
                                {categories?.map((cat, i) => (
                                    <option value={cat} key={i}>{cat?.name}</option>
                                ))}
                            </select>
                            <input
                                onChange={(e) => setSearchValue(e.target.value)}
                                value={searchValue}
                                type="text"
                                placeholder="What do you need?"
                                className="flex-1 px-4 py-2 outline-none bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                            />
                            <button className="bg-brand-dark hover:bg-brand text-white px-6 py-2 font-semibold transition-all duration-300">
                                Search
                            </button>
                        </div>
                     </div>
                    </div>

                    {/* --- কন্টাক্ট ইনফো --- */}
                    <div className="hidden lg:flex items-center gap-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        <FaWhatsapp className="text-brand-dark text-xl" />
                        <div>
                             <a
                                href="https://wa.me/8801749889595"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-green-700 dark:hover:text-brand-light transition-all duration-300"
                            >
                            <p className="text-xs font-medium">Hotline</p>
                            <p className="text-sm font-bold">+880 1749-889595</p>
                           

                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Navbar;