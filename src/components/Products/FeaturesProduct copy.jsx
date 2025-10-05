import { FaEye, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaCartPlus } from "react-icons/fa";
import Ratings from "../Ratings/Ratings";

const FeaturesProduct = ({products}) => {
    console.log(products);
    
    return (
        <div className="w-[95%] md:mt-4 mb-2 mx-auto">
            <div className="mx-auto">
                <div className='text-center flex justify-center items-center flex-col text-4xl text-slate-800 font-bold relative pb-[45px]'>
                    <h1>Feature products</h1>
                    <div className='w-[100px] h-[3px] bg-[#0d6b54] mt-4'> </div>
                </div>
            </div>
            {/*  */}
            <div className='w-full grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-8'>
                {
                    products?.map((product) => <div key={product?._id} className='border group transition-all duration-500 hover:shadow-md hover:-mt-3 border-gray-100'>
                        <div className='relative overflow-hidden'>
                            <div className='flex justify-center items-center absolute text-white text-xs w-[35px] h-[35px] rounded-full bg-red-500 font-semibold left-2 top-2'>-{product?.discount}%</div>
                            <img className='w-full h-[180px] md:h-[240px] ' src={product?.images[0]} alt="product image" />
                            <ul className="flex transition-all duration-700 -bottom-8 justify-center items-center gap-2 absolute w-full group-hover:bottom-3">
                                <li className='w-[35px] h-[35px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-[#7faf39] hover:text-white hover:rotate-[360deg] transition-all'>
                                    <FaRegHeart />
                                </li>
                                <Link to={`/product/details/${product?.slug}`} className='w-[35px] h-[35px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-[#7faf39] hover:text-white hover:rotate-[360deg] transition-all'><FaEye /></Link>
                                <li className='w-[35px] h-[35px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-[#7faf39] hover:text-white hover:rotate-[360deg] transition-all'>
                                    <FaCartPlus />
                                </li>
                            </ul>
                        </div>
                        {/* info */}
                        <div className="flex flex-col py-3 px-2 space-y-2">
                            <h2>{product?.name}</h2>
                            <div className="flex justify-start items-center gap-3">
                                <span className="text-md font-bold">TK {product?.price}</span>
                                <div className="flex">
                                    <Ratings ratings={product?.rating}/>
                                </div>
                            </div>
                        </div>

                    </div>)
                }
              

            </div>
        </div>
    );
};

export default FeaturesProduct;