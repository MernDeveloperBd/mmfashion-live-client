import { IoIosArrowDropright } from "react-icons/io";
import { Link, useSearchParams } from "react-router-dom";
import ShopProducts from './ShopProducts'
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useState } from "react";
import { Range } from 'react-range'
// import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { AiFillStar } from "react-icons/ai";
import { CiStar } from "react-icons/ci";
import Products from "../../components/Products/Products";
import { BsFillGridFill, BsList } from "react-icons/bs";
import Pagination from "../../components/Pagination/Pagination";
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { price_range_product, query_products } from "../../store/Reducers/homeReducer.js";

const SearchProducts = () => {
    let [searchParams, setSearchParams] = useSearchParams()
    const category = searchParams.get('category')
    const searchValue = searchParams.get('value')
    const dispatch = useDispatch()
    const { products, totalProduct, latest_product, priceRange, perPage } = useSelector(state => state.home)

    const [pageNumber, setPageNumber] = useState(1)
    const [styles, setStyles] = useState('grid')
    const [filter, setFilter] = useState(false);
    const [rating, setRatingQ] = useState('')
    const [sortPrice, setSortPrice] = useState('')
    const [state, setState] = useState({ values: [priceRange.low, priceRange.high] });

    useEffect(() => {
        //  dispatch(get_products())
        // dispatch( query_products())
        dispatch(price_range_product())
    }, [dispatch])

    const [rangeData, setRangeData] = useState(null)

    useEffect(() => {
        if (priceRange.low === priceRange.high) {
            setRangeData({
                low: priceRange.low,
                high: priceRange.high + 100
            })
        } else {
            setRangeData({
                low: priceRange.low,
                high: priceRange.high
            })
        }
        setState({ values: [priceRange.low, priceRange.high] })
    }, [priceRange])

    useEffect(() => {
        dispatch(
            query_products({
                low: state.values[0] || '',
                high: state.values[1] || '',
                category,
                rating,
                sortPrice,
                pageNumber,
                searchValue
            })
        )
    }, [state.values, dispatch, category, pageNumber, rating, sortPrice, searchValue])

    return (
        <div>
            <Header />

            {/* Banner Section */}
            <section className='bg-[url("https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759381526/profile/uutlizbmkivizmulakng.jpg")] h-[220px] w-full md:w-[95%] mx-auto md:mt-6 bg-cover bg-no-repeat relative bg-left'>
                <div className="absolute left-0 top-0 w-full md:w-[95%] mx-auto h-full text-white bg-black/40">
                    <div className="flex flex-col justify-center gap-1 items-center h-full w-full text-white">
                        <h2 className="text-2xl font-bold">Shop From {category}</h2>
                        <div className="flex justify-center items-center gap-2 text-xl w-full">
                            <Link to="/">Home</Link>
                            <span className="pt-1">
                                <IoIosArrowDropright />
                            </span>
                            <span>Products</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Shop Section */}
            <section className="py-6 md:py-16 ">
                <div className="w-full md:w-[95%] mx-auto h-full">
                    {/* Mobile Filter Toggle */}
                    <div className={`md:hidden block ${filter ? "mb-6" : "mb-0"}`}>
                        <button
                            onClick={() => setFilter(!filter)}
                            className="text-center w-full py-2 px-3 bg-[#0d6b54] text-white cursor-pointer rounded"
                        >
                            {filter ? "Hide Filters" : "Filter Products"}
                        </button>
                    </div>

                    <div className="w-full flex flex-col md:flex-row gap-6 px-2">
                        {/* Sidebar */}
                        <div
                            className={`w-full md:w-3/12 pr-8 transition-all duration-300 px-2 ${filter ? "block" : "hidden md:block"
                                }`}
                        >
                            {/* Category Filter */}
                            {/*   <h2 className="text-2xl font-bold mb-3 text-slate-600">
                                Category
                            </h2>
                            <div className="py-2">
                                {categories.map((c, i) => (
                                    <div className='flex justify-start items-center gap-2 py-1' key={i}>
                                        <input checked={category === c.name ? true : false} onChange={(e) => queryCategoey(e, c.name)} type="checkbox" id={c.name} />
                                        <label className='text-slate-600 block cursor-pointer' htmlFor={c.name}>{c.name}</label>
                                    </div>
                                ))}
                            </div> */}

                            {/* Price Filter */}
                            <div className="py-2 flex flex-col gap-5">
                                <h3 className="text-2xl font-bold mb-3 text-slate-600">Price</h3>
                                {
                                    rangeData &&
                                    <Range
                                        step={1}
                                        min={rangeData?.low}
                                        max={rangeData?.high}
                                        values={state.values}
                                        onChange={(values) => setState({ values })}
                                        renderTrack={({ props, children }) => {
                                            const { key, style, ...rest } = props; // key আলাদা করলাম
                                            return (
                                                <div
                                                    key={key}               // key সরাসরি দিলাম
                                                    {...rest}               // বাকিগুলো স্প্রেড
                                                    style={style}           // লাইব্রেরি দেওয়া style কভার করতে চাইলে
                                                    className="w-full h-[6px] bg-slate-200 rounded-full cursor-default"
                                                >
                                                    {children}
                                                </div>
                                            );
                                        }}
                                        renderThumb={({ props }) => {
                                            const { key, style, ...rest } = props; // key আলাদা
                                            return (
                                                <div
                                                    key={key}               // key সরাসরি
                                                    {...rest}
                                                    style={style}
                                                    className="w-[15px] h-[15px] bg-blue-500 rounded-full"
                                                />
                                            );
                                        }}
                                    />
                                }
                                <div>
                                    <span className='text-red-500 font-bold text-sm'>TK{Math.floor(state.values[0])} - TK{Math.floor(state.values[1])}</span>
                                </div>
                            </div>

                            {/* ratings */}

                            <div className="py-2 flex flex-col gap-5">
                                <h3 className="text-2xl font-bold mb-3 text-slate-600">Rating</h3>
                                <div className="flex flex-col gap-3">
                                    <div onClick={() => setRatingQ(5)} className="text-orange-500 flex justify-start items-start gap-1 text-lg cursor-pointer" title="Rating 5">
                                        <span><AiFillStar /></span>
                                        <span><AiFillStar /></span>
                                        <span><AiFillStar /></span>
                                        <span><AiFillStar /></span>
                                        <span><AiFillStar /></span>
                                    </div>
                                    <div onClick={() => setRatingQ(4)} className="text-orange-500 flex justify-start items-start gap-1 text-lg cursor-pointer" title="Rating 4">
                                        <span><AiFillStar /></span>
                                        <span><AiFillStar /></span>
                                        <span><AiFillStar /></span>
                                        <span><AiFillStar /></span>
                                        <span><CiStar /></span>
                                    </div>
                                    <div onClick={() => setRatingQ(3)} className="text-orange-500 flex justify-start items-start gap-1 text-lg cursor-pointer" title="Rating 3">
                                        <span><AiFillStar /></span>
                                        <span><AiFillStar /></span>
                                        <span><AiFillStar /></span>
                                        <span><CiStar /></span>
                                        <span><CiStar /></span>
                                    </div>
                                    <div onClick={() => setRatingQ(2)} className="text-orange-500 flex justify-start items-start gap-1 text-lg cursor-pointer" title="Rating 2">
                                        <span><AiFillStar /></span>
                                        <span><AiFillStar /></span>
                                        <span><CiStar /></span>
                                        <span><CiStar /></span>
                                        <span><CiStar /></span>
                                    </div>
                                    <div onClick={() => setRatingQ(1)} className="text-orange-500 flex justify-start items-start gap-1 text-lg cursor-pointer" title="Rating 1">
                                        <span><AiFillStar /></span>
                                        <span><CiStar /></span>
                                        <span><CiStar /></span>
                                        <span><CiStar /></span>
                                        <span><CiStar /></span>
                                    </div>
                                    <div onClick={() => setRatingQ('')} className="text-orange-500 flex justify-start items-start gap-1 text-lg cursor-pointer" title="Reset">
                                        <span><CiStar /></span>
                                        <span><CiStar /></span>
                                        <span><CiStar /></span>
                                        <span><CiStar /></span>
                                        <span><CiStar /></span>
                                    </div>
                                </div>
                            </div>
                            {/* latest products */}
                            <div className="py-5  hidden md:block">

                            </div>
                            <Products title="Latest Products" products={latest_product} />
                        </div>
                        {/* Sidebar  ends*/}
                        {/* Products Grid */}
                        <div className="w-full md:w-9/12 mt-4">
                            <div className="pl-00 md:pl-4">
                                <div className="py-2 bg-white mb-10 px-3 rounded-md flex justify-between items-start border border-slate-200">
                                    <h2 className="text-lg font-medium text-slate-600">{products?.length} of total {totalProduct} Products</h2>
                                    <div className="flex justify-center items-center gap-3">
                                        <select onChange={(e) => setSortPrice(e.target.value)} className="p-1 border outline-0 text-slate-600 font-semibold" id="sort-price"
                                            name="sortPrice">
                                            <option value="">Sort by</option>
                                            <option value="low-to-high">Low to High Price</option>
                                            <option value="high-to-low">High to Low Price</option>
                                        </select>
                                        <div className="flex justify-center items-start gap-4 ">
                                            <div onClick={() => setStyles('grid')} className={`p-2 ${styles === 'grid' && 'bg-slate-300'} text-slate-600 hover:bg-slate-300 cursor-pointer rounded-sm`}>
                                                <BsFillGridFill />
                                            </div>
                                            <div onClick={() => setStyles('list')} className={`p-2 ${styles === 'list' && 'bg-slate-300'} text-slate-600 hover:bg-slate-300 cursor-pointer rounded-sm`}>
                                                <BsList />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                {/* products here */}
                                <div className="pb-8">
                                    <ShopProducts styles={styles} products={products} />
                                </div>
                                {
                                    totalProduct > perPage && <div>
                                        <Pagination pageNumber={pageNumber} setPageNumber={setPageNumber} totalItem={totalProduct} perPage={perPage} showItem={Math.floor(totalProduct / perPage)} />
                                    </div>
                                }


                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default SearchProducts;
