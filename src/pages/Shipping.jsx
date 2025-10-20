import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowDropright } from 'react-icons/io';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { place_order } from '../store/Reducers/orderReducer';

const Shipping = () => {
     const navigate = useNavigate()
    const dispatch = useDispatch()
    const { userInfo } = useSelector(state => state.auth)
    const { order } = useSelector(state => state.order) // Added: Select order state to check success
    const { state: { products, price, shipping_fee, items } } = useLocation()
    const [res, setRes] = useState(false)
    const [state, setState] = useState({
        name: '',
        address: '',
        phone: '',
        post: '',
        province: '',
        city: "",
        area: ""
    })
    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }
    const save = (e) => {
        e.preventDefault()
        const { name, address, phone, post, province, city, area } = state;
        if (name && address && phone && post && province && city && area) {
            setRes(true)
        }
    }

       const placeOrder = () => {
        dispatch(place_order({
            price,
            products,
            shipping_fee,
            shippingInfo: state,
            userId: userInfo.id,
            navigate,
            items
        }))
    }
    
    // Added: Listen for order success and navigate
    useEffect(() => {
        if (order && order._id) { // Assuming order has _id on success
            localStorage.setItem('orderId', order._id); // Store for confirm page if needed
            navigate('/payment'); // Or '/confirm-order' - adjust to your payment/confirm route
        }
    }, [order, navigate]);

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
                            <span>Placed order</span>
                        </div>
                    </div>
                </div>
            </section>
            <section className='bg-[#eeeeee]'>
                <div className=' mx-auto md:px-16 px-0 py-6 md:py-16'>
                    <div className='w-full flex flex-wrap'>
                        <div className='md:w-[67%] w-full'>
                            <div className="flex flex-col gap-3">
                                <div className="bg-white p-6 shadow-sm rounded-md">
                                    {
                                        !res && <>
                                            <h2 className='text-slate-600 font-bold pb-3'>Shipping Information</h2>
                                            <form onSubmit={save}>
                                                <div className='flex flex-col md:flex-row md:gap-2 w-full gap-5 text-slate-600'>
                                                    <div className='flex flex-col gap-1 mb-2 w-full'>
                                                        <label htmlFor="name">Name</label>
                                                        <input onChange={inputHandle} value={state.name} type="text" className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md' name='name' placeholder='name' id='name' />
                                                    </div>
                                                    <div className='flex flex-col gap-1 mb-2 w-full'>
                                                        <label htmlFor="address">Address</label>
                                                        <input onChange={inputHandle} value={state.address} type="text" className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md' name='address' placeholder='House no / building / strreet /area' id='address' />
                                                    </div>
                                                </div>
                                                <div className='flex flex-col md:flex-row md:gap-2 w-full gap-5 text-slate-600'>
                                                    <div className='flex flex-col gap-1 mb-2 w-full'>
                                                        <label htmlFor="phone">Phone</label>
                                                        <input onChange={inputHandle} value={state.phone} type="text" className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md' name='phone' placeholder='phone' id='phone' />
                                                    </div>
                                                    <div className='flex flex-col gap-1 mb-2 w-full'>
                                                        <label htmlFor="post">Post</label>
                                                        <input onChange={inputHandle} value={state.post} type="text" className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md' name='post' placeholder='post' id='post' />
                                                    </div>
                                                </div>
                                                <div className='flex flex-col md:flex-row md:gap-2 w-full gap-5 text-slate-600'>
                                                    <div className='flex flex-col gap-1 mb-2 w-full'>
                                                        <label htmlFor="province">Province</label>
                                                        <input onChange={inputHandle} value={state.province} type="text" className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md' name='province' placeholder='province' id='province' />
                                                    </div>
                                                    <div className='flex flex-col gap-1 mb-2 w-full'>
                                                        <label htmlFor="city">City</label>
                                                        <input onChange={inputHandle} value={state.city} type="text" className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md' name='city' placeholder='city' id='city' />
                                                    </div>
                                                </div>
                                                <div className='flex md:flex-col md:gap-2 w-full gap-5 text-slate-600'>
                                                    <div className='flex flex-col gap-1 mb-2 w-full'>
                                                        <label htmlFor="area">Area</label>
                                                        <input onChange={inputHandle} value={state.area} type="text" className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md' name='area' placeholder='area' id='province' />
                                                    </div>
                                                    <div className='flex flex-col gap-1 mt-3 w-full'>
                                                        <button className='px-3 py-[6px] rounded-sm hover:shadow-indigo-500/20 hover:shadow-lg bg-[#149777] text-white cursor-pointer'>Save</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </>
                                    }
                                    {
                                        res && <div className='flex flex-col gap-1'>
                                            <h2 className='text-slate-600 font-semibold pb-2'>Deliver to {state.name}</h2>
                                            <p>
                                                <span className='bg-blue-200 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded'>Home</span>
                                                <span className='text-slate-600 text-sm'>{state.address} {state.province} {state.city} {state.area}</span>
                                                <span onClick={() => setRes(false)} className='text-indigo-500 cursor-pointer'> change</span>
                                            </p>
                                            <p className='text-slate-600 text-sm'>Email to marifamisam@gmail.com</p>
                                        </div>
                                    }
                                    <div />
                                    {
                                        products?.map((p, i) => <div key={i} className="flex bg-white p-4 flex-col gap-2">
                                            <div className="flex justify-start items-center">
                                                <h2 className="text-md">{p.shopName}</h2>
                                            </div>
                                            {
                                               p?.products?.map((pp, i) => <div key={i} className="w-full flex flex-wrap px-2">
                                                    <div className="flex w-full md:w-7/12">
                                                        <div className="flex gap-2 justify-start items-center">
                                                            <img className="w-[80px] h-[80px]" src={pp.productInfo.images[0]} alt="shipping_product_image" />
                                                            <div className="pr-4 text-slate-600">
                                                                <h2 className="text-md">{pp.productInfo.name}</h2>
                                                                <span className="text-sm">Brand: {pp.productInfo.brand}</span>
                                                            </div>

                                                        </div>

                                                    </div>

                                                    <div className="flex justify-end w-full mt-3 md:w-5/12">
                                                        <div className="pl-0 md:pl-4">
                                                            <h2 className="text-lg text-orange-500">TK {pp?.productInfo?.price}</h2>
                                                           {
                                                                    pp?.productInfo?.oldPrice > 0 && <p className="line-through">TK {pp?.productInfo?.oldPrice}</p>
                                                                }
                                                             {
                                                                    pp?.productInfo?.discount > 0 && <p>-{pp?.productInfo?.discount}%</p>
                                                                }
                                                        </div>
                                                    </div>
                                                </div>)
                                            }

                                        </div>)
                                    }

                                </div>
                            </div>                            
                        </div>
                        <div className='md:w-[33%] w-full'>
                                <div className="md:pl-3 pl-0">
                                    <div className='bg-white font-medium p-5 text-slate-600 flex flex-col gap-3'>
                                        <h2 className='text-xl font-semibold'>Order Summary</h2>
                                        <div className='flex justify-between items-center'>
                                            <span>Items Total({items})</span>
                                            <span>TK{price}</span>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <span>Delivery Fee</span>
                                            <span>TK{shipping_fee}</span>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <span>Total Payment</span>
                                            <span>TK {price + shipping_fee}</span>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <span>Total</span>
                                            <span>TK {price + shipping_fee}</span>
                                        </div>
                                        <button onClick={placeOrder} disabled={res ? false : true} className={`px-5 py-[6px] rounded-sm hover:shadow-orange-500/20 hover:shadow-lg  ${res ? 'bg-orange-500 cursor-pointer' : 'bg-orange-300'} text-sm text-white uppercase`}>Place Order</button>
                                    </div>

                                </div>
                            </div>

                    </div>
                </div>
            </section>
            <Footer />

        </div>
    );
};

export default Shipping;