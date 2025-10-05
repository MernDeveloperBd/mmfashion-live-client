import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { IoIosArrowDropright } from "react-icons/io";
import Footer from "../../components/Footer/Footer";


const Card = () => {
    const card_products = [1, 2, 3, 4,];
    const outOfStockProducts = [1, 2]
    const navigate = useNavigate()

    const redirect = () =>{
        navigate('/shipping',{
             state: {
                products: [],
                price: 1520,
                shipping_fee: 140,
                items: 4
            }
        })
    }

    return (
        <div>
            <Header />
            <section className='bg-[url("https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759381526/profile/uutlizbmkivizmulakng.jpg")] h-[220px] w-full md:w-[95%] mx-auto md:mt-6 bg-cover bg-no-repeat relative bg-left'>
                <div className="absolute left-0 top-0 w-full md:w-[95%] mx-auto h-full text-white bg-black/40">
                    <div className="flex flex-col justify-center gap-1 items-center h-full w-full text-white">
                        <h2 className="text-2xl font-bold">Shop by</h2>
                        <div className="flex justify-center items-center gap-2 text-xl w-full">
                            <Link to="/">Home</Link>
                            <span className="pt-1">
                                <IoIosArrowDropright />
                            </span>
                            <span>Card</span>
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-[#eeeeee] w-full md:w-[95%] mx-auto">
                <div className="w-full md:w-[95%] mx-auto py-16">
                    {
                        card_products.length > 0 || outOfStockProducts.length > 0 ? <div className="flex flex-wrap">
                            <div className="w-full md:w-[67%]">
                                <div className=" md:pr-8">
                                    <div className="flex flex-col gap-3">
                                        <div className="bg-white p-4">
                                            <h2 className="text-md text-green-500 font-semibold">Stock products {card_products.length - outOfStockProducts.length}</h2>
                                        </div>
                                        {
                                            card_products.map((p, i) => <div key={i} className="flex bg-white p-4 flex-col gap-2">
                                                <div className="flex justify-start items-center">
                                                    <h2 className="text-md">MM Fashion world</h2>
                                                </div>
                                                {
                                                    [1, 2].map((p, i) => <div key={i} className="w-full flex flex-wrap px-2">
                                                        <div className="flex w-full md:w-7/12">
                                                            <div className="flex gap-2 justify-start items-center">
                                                                <img className="w-[80px] h-[80px]" src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1752324558/products/gt2pout8feanpscvl9ev.jpg" alt="" />
                                                                <div className="pr-4 text-slate-600">
                                                                    <h2 className="text-md">Long cotton dress for women</h2>
                                                                    <span className="text-sm">Brand: Easy</span>
                                                                </div>

                                                            </div>

                                                        </div>

                                                        <div className="flex justify-between w-full mt-3 md:w-5/12">
                                                            <div className="pl-0 md:pl-4">
                                                                <h2 className="text-lg text-orange-500">TK 600</h2>
                                                                <p className="line-through">TK 720</p>
                                                                <p>-10%</p>
                                                            </div>
                                                            <div className="flex flex-col gap-2">
                                                                <div className="flex justify-center items-center bg-slate-200 h-[30px] text-xl">
                                                                    <div className="px-3 cursor-pointer">-</div>
                                                                    <div>5</div>
                                                                    <div className="px-3 cursor-pointer">+</div>
                                                                </div>
                                                                <button className="px-5 py-[3px] bg-red-500 text-white">Delete</button>

                                                            </div>

                                                        </div>

                                                    </div>)
                                                }

                                            </div>)
                                        }
                                        {
                                            outOfStockProducts.length > 0 && <div className='flex flex-col gap-3'>
                                                <div className='bg-white p-4'>
                                                    <h2 className='text-md text-red-500 font-semibold'>Out of Stock  {outOfStockProducts.length}</h2>
                                                </div>
                                                <div className='bg-white p-4'>
                                                    {
                                                        [1, 2].map((p, i) => <div key={i} className="w-full flex flex-wrap px-2">
                                                            <div className="flex w-full md:w-7/12">
                                                                <div className="flex gap-2 justify-start items-center">
                                                                    <img className="w-[80px] h-[80px]" src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1752324558/products/gt2pout8feanpscvl9ev.jpg" alt="" />
                                                                    <div className="pr-4 text-slate-600">
                                                                        <h2 className="text-md">Long cotton dress for women</h2>
                                                                        <span className="text-sm">Brand: Easy</span>
                                                                    </div>

                                                                </div>

                                                            </div>

                                                            <div className="flex justify-between w-full mt-3 md:w-5/12">
                                                                <div className="pl-0 md:pl-4">
                                                                    <h2 className="text-lg text-orange-500">TK 600</h2>
                                                                    <p className="line-through">TK 720</p>
                                                                    <p>-10%</p>
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                    <div className="flex justify-center items-center bg-slate-200 h-[30px] text-xl">
                                                                        <div className="px-3 cursor-pointer">-</div>
                                                                        <div>5</div>
                                                                        <div className="px-3 cursor-pointer">+</div>
                                                                    </div>
                                                                    <button className="px-5 py-[3px] bg-red-500 text-white">Delete</button>

                                                                </div>

                                                            </div>

                                                        </div>)
                                                    }
                                                </div>
                                            </div>
                                        }

                                    </div>


                                </div>

                            </div>
                            {/* RIGHT */}
                            <div className='md:w-[33%] w-full'>
                                <div className='md:pl-3 pt-2 md:mt-5'>
                                    {
                                        card_products.length > 0 && <div className='bg-white p-3 text-slate-600 flex flex-col gap-3 border'>
                                            <h2 className='text-xl font-bold'>Order Summary</h2>
                                            <div className='flex justify-between items-center'>
                                                <span>4 Item</span>
                                                <span>TK 1500</span>
                                            </div>
                                            <div className='flex justify-between items-center'>
                                                <span>Shipping fee</span>
                                                <span>TK 140</span>
                                            </div>
                                            <div className='flex gap-2'>
                                                <input className='w-full px-3 py-2 border border-slate-200 outline-0 focus:border-green-500 rounded-sm' type="text" placeholder='Input Vauchar Coupon' />
                                                <button className='px-5 py-[1px] bg-blue-500 text-white rounded-sm uppercase text-sm'>Apply</button>
                                            </div>
                                             <div className='flex justify-between items-center'>
                                                <span>Total</span>
                                                <span className='text-lg text-orange-500'>TK 1458</span>
                                            </div>
                                             <button onClick={redirect} className='px-5 py-[6px] rounded-sm hover:shadow-orange-500/20 hover:shadow-lg bg-[#149777] text-sm text-white uppercase cursor-pointer'>Proceed to checkout </button>

                                        </div> 
                                    }
                                    
                                </div>
                            </div>

                        </div> : <div>
                            <Link to='/shop' className="px-4 py-1 bg-[#149777] text-white">Shop Now</Link>
                        </div>
                    }
                </div>

            </section>
            <Footer />
        </div>
    );
};

export default Card;