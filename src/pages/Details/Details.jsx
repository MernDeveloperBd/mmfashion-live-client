
import { Link, } from 'react-router-dom'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { useState } from 'react'
import Ratings from '../../components/Ratings/Ratings'
import { AiFillHeart } from 'react-icons/ai'
import { FaFacebookF } from 'react-icons/fa'
import { AiOutlineTwitter } from 'react-icons/ai'
import { BsInstagram } from 'react-icons/bs'
import 'swiper/css';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';



const Details = () => {
    const [image, setImage] = useState('')
    const [state, setState] = useState('reviews')

    const products = [

        { id: 1, title: 'Summer Collection T-Shirt', price: 1250, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759381526/profile/uutlizbmkivizmulakng.jpg' },
        { id: 2, title: 'Casual Denim Jacket', price: 2500, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759378506/profile/tpdf0oib2oau58kz0aeo.jpg' },
        { id: 3, title: 'Formal Shirt', price: 1800, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759305169/products/yhuinhuas6ntvaqt5eax.jpg' },
        { id: 1, title: 'Summer Collection T-Shirt', price: 1250, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759381526/profile/uutlizbmkivizmulakng.jpg' },
        { id: 2, title: 'Casual Denim Jacket', price: 2500, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759378506/profile/tpdf0oib2oau58kz0aeo.jpg' },
        { id: 3, title: 'Formal Shirt', price: 1800, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759305169/products/yhuinhuas6ntvaqt5eax.jpg' }

    ];
    const moreProducts = [

        { id: 1, title: 'Summer Collection T-Shirt', price: 1250, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759381526/profile/uutlizbmkivizmulakng.jpg' },
        { id: 2, title: 'Casual Denim Jacket', price: 2500, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759378506/profile/tpdf0oib2oau58kz0aeo.jpg' },
        { id: 3, title: 'Formal Shirt', price: 1800, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759305169/products/yhuinhuas6ntvaqt5eax.jpg' },
        { id: 1, title: 'Summer Collection T-Shirt', price: 1250, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759381526/profile/uutlizbmkivizmulakng.jpg' },
        { id: 2, title: 'Casual Denim Jacket', price: 2500, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759378506/profile/tpdf0oib2oau58kz0aeo.jpg' },
        { id: 3, title: 'Formal Shirt', price: 1800, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759305169/products/yhuinhuas6ntvaqt5eax.jpg' }

    ];
    const relatedProducts = [

        { id: 1, title: 'Summer Collection T-Shirt', price: 1250, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759381526/profile/uutlizbmkivizmulakng.jpg' },
        { id: 2, title: 'Casual Denim Jacket', price: 2500, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759378506/profile/tpdf0oib2oau58kz0aeo.jpg' },
        { id: 3, title: 'Formal Shirt', price: 1800, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759305169/products/yhuinhuas6ntvaqt5eax.jpg' },
        { id: 1, title: 'Summer Collection T-Shirt', price: 1250, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759381526/profile/uutlizbmkivizmulakng.jpg' },
        { id: 2, title: 'Casual Denim Jacket', price: 2500, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759378506/profile/tpdf0oib2oau58kz0aeo.jpg' },
        { id: 3, title: 'Formal Shirt', price: 1800, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759305169/products/yhuinhuas6ntvaqt5eax.jpg' }

    ];

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 4
        },
        mdtablet: {
            breakpoint: { max: 991, min: 464 },
            items: 4
        },
        mobile: {
            breakpoint: { max: 768, min: 0 },
            items: 3
        },
        smmobile: {
            breakpoint: { max: 640, min: 0 },
            items: 3
        },
        xsmobile: {
            breakpoint: { max: 440, min: 0 },
            items: 2
        }
    }
    const discount = 5
    const stock = 8

    return (
        <div>
            <Header />
            <section className='bg-[url("https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759381526/profile/uutlizbmkivizmulakng.jpg")] h-[220px] w-full md:w-[95%] mx-auto md:mt-6 bg-cover bg-no-repeat relative bg-left'>
                <div className="absolute left-0 top-0 w-full md:w-[95%] mx-auto h-full text-white bg-black/40">
                    <div className="flex flex-col justify-center gap-1 items-center h-full w-full text-white">
                        <h2 className="text-2xl font-bold">Shop by</h2>

                    </div>
                </div>
            </section>

            <div className=' mx-auto px-1  md:px-8'>
                <div className='bg-slate-100 py-5 mb-5 px-3'>
                    <div className='flex justify-start items-center text-md text-slate-600 w-full'>
                        <Link to='/'>Home</Link>
                        <span className='pt-1'><MdOutlineKeyboardArrowRight /></span>
                        <Link to='/'>category</Link>
                        <span className='pt-1'><MdOutlineKeyboardArrowRight /></span>
                        <span>product name</span>
                    </div>
                </div>
            </div>
            {/*  */}
            <section>
                <div className='mx-auto px-1  md:px-8'>
                    <div className='grid md:grid-cols-2 grid-cols-1 gap-8'>
                        <div>
                            <div className='md:p-5 border border-slate-200'>
                                <img className='w-full h-[240px] md:h-[400px] ' src={image ? `https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759305169/products/yhuinhuas6ntvaqt5eax.jpg` : 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759381526/profile/uutlizbmkivizmulakng.jpg'} alt="" />
                            </div>
                            <div className='py-3'>
                                {
                                    products && <Carousel
                                        autoPlay={true}
                                        infinite={true}
                                        responsive={responsive}
                                        transitionDuration={500}
                                    >
                                        {
                                            products.map((img, i) => {
                                                return (
                                                    <div key={i} onClick={() => setImage(img)}>
                                                        <img className=' cursor-pointer aspect-square p-1' src={img.image} alt="" />
                                                    </div>
                                                )
                                            })
                                        }
                                    </Carousel>
                                }
                            </div>
                        </div>
                        {/*  */}
                        <div className='flex flex-col gap-5'>
                            <div className='text-3xl text-slate-600 font-bold'>
                                <h2>product name</h2>
                            </div>
                            <div className='flex justify-start items-center gap-4'>
                                <div className='flex text-xl'>
                                    <Ratings ratings={4} />
                                </div>
                                <span className='text-green-500'>( reviews)</span>
                            </div>
                            <div className='text-xl  font-bold flex gap-3'>
                                {
                                    discount !== 0 ? <>

                                        <h2 className='text-black'>${500 - Math.floor((500 * discount) / 100)} </h2>
                                        <h2 className='line-through text-red-500'>${540}</h2>
                                        <h2>(-{discount}%)</h2>
                                    </> : <h2>Price : ${500}</h2>
                                }
                            </div>
                            <div className='text-slate-600'>
                                <p>{"product.Reselling price"}</p>
                            </div>
                            <div className='text-slate-600'>
                                <p>{"product.description"}</p>
                            </div>
                            {/* count  */}
                            <div className='flex gap-3 pb-10 border-b'>
                                {
                                    stock ? <>
                                        <div className='flex bg-slate-200 h-[50px] justify-center items-center text-xl'>
                                            <div className='px-6 cursor-pointer'>-</div>
                                            <div className='px-5'>{5}</div>
                                            <div className='px-6 cursor-pointer'>+</div>
                                        </div>
                                        <div>
                                            <button className='px-6 md:px-8 py-3 h-[50px] cursor-pointer hover:shadow-lg hover:shadow-purple-500/40 bg-[#149777] text-white'>Add To Card</button>
                                        </div>
                                    </> : ''
                                }
                                <div>
                                    <div className='h-[50px] w-[50px] flex justify-center items-center cursor-pointer hover:shadow-lg hover:shadow-cyan-500/40 bg-cyan-500 text-white'>
                                        <AiFillHeart />
                                    </div>
                                </div>
                            </div>
                            {/*  */}
                            <div className='flex py-3 md:py-5 gap-5'>
                                <div className='w-[150px] text-black font-bold text-xl flex flex-col gap-3 md:gap-5'>
                                    <span>Availability</span>
                                    <span>Share on</span>
                                </div>
                                <div className='flex flex-col gap-5'>
                                    <span className={`text-${stock ? 'green' : 'red'}-500`}>
                                        {stock ? `In Stock(${stock})` : 'Out of Stock'}
                                    </span>
                                    <ul className='flex justify-start items-center gap-3'>
                                        <li>
                                            <a className='w-[38px] h-[38px] hover:bg-[#7fad39] hover:text-white flex justify-center items-center bg-sky-500 rounded-full text-white' href="#"><FaFacebookF /></a>
                                        </li>
                                        <li>
                                            <a className='w-[38px] h-[38px] hover:bg-[#7fad39] hover:text-white flex justify-center items-center bg-cyan-500 rounded-full text-white' href="#"><AiOutlineTwitter /></a>
                                        </li>
                                        <li>
                                            <a className='w-[38px] h-[38px] hover:bg-[#7fad39] hover:text-white flex justify-center items-center bg-red-500 rounded-full text-white' href="#"><BsInstagram /></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/*  */}
                            <div className='flex gap-3'>
                                {
                                    stock ? <button onClick={'buy'} className='px-8 py-3 h-[50px] cursor-pointer hover:shadow-lg hover:shadow-emerald-500/40 bg-emerald-500 text-white'>Buy Now</button> : ""
                                }
                                <Link to={`/dashboard/chat/${"product.sellerId"}`} className='px-8 py-3 h-[50px] cursor-pointer hover:shadow-lg hover:shadow-lime-500/40 bg-lime-500 text-white block'>Chat Seller</Link>
                            </div>
                        </div>
                    </div>
                </div>

            </section >
            {/*  */}
            <section>
                <div className='mx-auto px-1  md:px-8 mt-4'>
                    <div className='flex flex-wrap'>
                        <div className='md:w-[80%] w-full'>
                            <div className='md:pr-4 pr-0'>
                                <div className='grid grid-cols-2 gap-2'>
                                    <button onClick={() => setState('reviews')} className={`py-1 hover:text-white px-5 hover:bg-green-500 ${state === 'reviews' ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-700'} rounded-sm`}>Reviews</button>
                                    <button onClick={() => setState('description')} className={`py-1 px-5 hover:text-white hover:bg-green-500 ${state === 'description' ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-700'} rounded-sm`}>Description</button>
                                </div>
                                <div className='mt-4'>
                                    {
                                        state === 'reviews' ? "<Reviews product={'product'} />" : <p className='py-5 text-slate-600'>{("product.description")}</p>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='md:w-[20%] w-full'>
                            <div className='md:pl-4 pl-0'>
                                <div className='px-3 py-2 text-slate-600 bg-slate-200'>
                                    <h2> From {"product.shopName"}</h2>
                                </div>
                                <div className='grid grid-cols-1 gap-5 mt-3 md:border md:p-3'>
                                    {
                                        moreProducts.map((p, i) => {
                                            return (
                                                <Link key={i} to={`/product/details/${"p.slug"}`} className='block'>
                                                    <div className='relative'>
                                                        <img className='w-full h-[220px] aspect-square' src={"https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759381526/profile/uutlizbmkivizmulakng.jpg"} />
                                                        {
                                                            discount !== 0 && <div className='flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2'>{discount}%</div>
                                                        }
                                                    </div>
                                                    <h2 className='text-slate-600 p-1'>{"{p.name?.slice(0,40)}"}...</h2>
                                                    <div className='flex gap-2 p-1'>
                                                        <h2 className='text-slate-600'>Price: </h2>
                                                        <span className=' text-lg font-bold'>${150}</span>

                                                    </div>
                                                    <div className='flex gap-2'>

                                                        <div className='flex items-center gap-2'>
                                                            rating
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/*  */}
            <section>
                <div className='mx-auto px-1  md:px-8'>
                    <h2 className='text-2xl py-8 text-slate-600'>Related Products</h2>
                    <div>
                        <Swiper
                            slidesPerView='auto'
                            breakpoints={{
                                1280: {
                                    slidesPerView: 4
                                },
                                565: {
                                    slidesPerView: 2
                                }
                            }}
                            spaceBetween={25}
                            loop={true}
                            pagination={{
                                clickable: true,
                                el: '.custom_bullet'
                            }}
                            modules={[Pagination]}
                            className='mySwiper'
                        >
                            {
                                relatedProducts.map((p, i) => {
                                    return (
                                        <SwiperSlide key={i}>
                                            <Link className='block'>
                                                <div className='relative h-[270px]'>
                                                    <div className='w-full h-full'>
                                                        <img className='w-full h-full' src={"https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759381526/profile/uutlizbmkivizmulakng.jpg"} />
                                                        <div className='absolute h-full w-full top-0 left-0 bg-[#000] opacity-25 hover:opacity-50 transition-all duration-500'></div>
                                                    </div>
                                                    {
                                                        discount !== 0 && <div className='flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2'>{discount}%</div>
                                                    }
                                                </div>
                                                <div className='p-4 flex flex-col gap-1'>
                                                    <h2 className='text-slate-600 text-lg font-semibold'>{"p.name"}</h2>
                                                    <div className='flex justify-start items-center gap-3'>
                                                        <h2 className='text-[#6699ff] text-lg font-bold'>${150}</h2>
                                                        <div className='flex'>
                                                            {/* <Ratings ratings={} /> */} ringgs
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </SwiperSlide>
                                    )
                                })
                            }
                        </Swiper>
                    </div>
                    <div className='w-full flex justify-center items-center py-10'>
                        <div className='custom_bullet justify-center gap-3 !w-auto'></div>
                    </div>
                </div>
            </section>

            <Footer />
        </div >
    )
}

export default Details