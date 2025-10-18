import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
const Footer = () => {
    return (
        <footer className='bg-[#f3f6fa]'>
            <div className='w-[95%] flex flex-wrap mx-auto  border-b py-8 pb-'>
                <div className='w-full md:w-3/12 '>
                    <div className='flex flex-col gap-3 '>
                        <img className='w-[90px] h-[90px] shadow-2xl' src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759486364/mm_fashion_world_lgo_rdb5px.png" alt="logo" />
                        <ul className='flex flex-col gap-2 text-slate-600'>
                            <li><address>Mohammdapur, Dhaka</address></li>
                            <li>Phone: 01749-889595</li>
                            <li>Email: marifamisam@gmail.com</li>
                        </ul>

                    </div>

                </div>
                {/* 2nd */}
                <div className='w-full md:w-5/12 mt-6'>
                    <div className='flex justify-start md:justify-center w-full'>
                        <div>
                            <h2 className='font-bold text-lg mb-2'>Useful links</h2>
                            <div className='flex justify-between gap-[30px] md:gap-[80px]'>
                                <ul className='flex flex-col gap-2 text-slate-600 text-sm'>
                                    <li>
                                        <Link to='/about'>About us</Link>
                                    </li>
                                    <li>
                                        <Link>About our shop</Link>
                                    </li>
                                    <li>
                                        <Link >Delivery information</Link>
                                    </li>
                                    <li>
                                        <Link>privacy policy</Link>
                                    </li>
                                    <li>
                                        <Link to='/terms'>Terms & Conditions</Link>
                                    </li>
                                </ul>
                                <ul className='flex flex-col gap-2 text-slate-600 text-sm'>
                                    <li>
                                        <Link to='/shop'>Shop</Link>
                                    </li>
                                    <li>
                                        <Link to='/shop'>Latest Products</Link>
                                    </li>
                                    <li>
                                        <Link to='/shop'>Top Products</Link>
                                    </li>
                                    <li>
                                        <Link to='/shop'>Discout Products</Link>
                                    </li>
                                    <li>
                                        <Link to='/contact-us'>Contact us</Link>
                                    </li>
                                </ul>

                            </div>
                        </div>
                    </div>

                </div>

                {/* third */}
                <div className='w-full md:w-4/12 mt-6'>
                    <div className='w-full flex flex-col justify-start gap-5'>
                        <h2 className='font-bold text-lg mb-2'>Join with us</h2>
                        <span>Get email updates about our latest and shop special offers</span>
                        <div className='h-[40px] w-full bg-white border border-slate-300 relative rounded'>
                            <input placeholder='Enter your mail' className='h-full bg-transparent w-full px-3 outline-0' type="text" id='subscribe' name='subscribe'/>
                            <button className='h-full absolute right-0 primary_btn text-white uppercase px-4 font-bold text-sm rounded-r'>Subscribe</button>
                        </div>
                        <ul className='flex justify-start items-center gap-3'>
                            <a href="https://www.facebook.com/mmfashionworldonline" target='_blank' className="hover:text-brand text-sky-600"><FaFacebook size={20}/></a>
                            <a href="#" className="hover:text-brand text-orange-600"><FaInstagram size={20}/></a>
                            <a
                                href="https://wa.me/8801749889595"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-500 hover:text-brand dark:hover:text-brand-light transition-all duration-300"
                            >
                                <FaWhatsapp size={20} />
                            </a>
                        </ul>
                    </div>
                </div>
            </div>
            {/* copyright section */}
            <div className='w-[95%] flex flex-wrap justify-center items-center text-slate-600 mx-auto py-5 '>
                <span>Copyright &copy; 2025 All rights reserved | Mady by <Link to='/' className='text-teal-600'>MM fashion world</Link></span>
            </div>

        </footer>
    );
};

export default Footer;