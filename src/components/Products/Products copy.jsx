import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css'; // CSS import করতে ভুলবেন না
import { Link } from 'react-router-dom';

const Products = ({title}) => {
    const products = [
        [
            { id: 1, title: 'Summer Collection T-Shirt', price: 1250, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759381526/profile/uutlizbmkivizmulakng.jpg' },
            { id: 2, title: 'Casual Denim Jacket', price: 2500, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759378506/profile/tpdf0oib2oau58kz0aeo.jpg' },
            { id: 3, title: 'Formal Shirt', price: 1800, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759305169/products/yhuinhuas6ntvaqt5eax.jpg' }
        ],
        [
            { id: 4, title: 'Winter Hoodie', price: 3200, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1752324559/products/vpvgwrulkvwwu9zcvefx.jpg' },
            { id: 5, title: 'Sports Wear Set', price: 2800, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1752324558/products/gt2pout8feanpscvl9ev.jpg' },
            { id: 6, title: 'Designer Polo', price: 2100, image: 'https://res.cloudinary.com/dpd5xwjqp/image/upload/v1752316414/products/xgemabcbdem4llf6xxyo.jpg' }
        ]
    ];

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 1
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    const ButtonGroup =({next, previous})=>{
         return(
            <div className='flex justify-between items-center md:px-0'>
                <div className='text-xl font-bold text-slate-600'>
                    {title}
                </div>
                <div className='flex justify-center items-center gap-3 text-slate-600'>
                    <button onClick={()=>previous()} className='left_arrow'>
                        <span><FiChevronLeft/></span>
                    </button>
                    <button onClick={()=>next()} className='left_arrow'>
                        <span><FiChevronRight/></span>
                    </button>
                </div>
                

            </div>
         )
    }

    return (
        <div className='flex gap-4 flex-col-reverse py-2 md:py-4'>
            <Carousel
                autoPlay={false}
                infinite={true}
                arrows={false}
                responsive={responsive}
                transitionDuration={500}
                renderButtonGroupOutside={true}
                autoPlaySpeed={3000}
                customButtonGroup={<ButtonGroup/>}
            >
                {products.map((p, i) => (
                    <div key={i} className='flex flex-col justify-start gap-4 px-1 py-4'>
                        {p.map((product) => (
                            <Link 
                                key={product.id} 
                                to={`/product/${product.id}`} 
                                className='flex justify-start items-start'
                            >
                                <div className=' overflow-hidden'>
                                    <img 
                                        src={`${product.image}`} 
                                        alt={product.title}
                                        className='w-[110px] h-[110px] object-cover hover:scale-105 transition-transform duration-300'
                                    />
                                </div>
                                <div className='px-3 py-2 flex justify-start items-start gap-1 flex-col text-slate-600'>
                                    <h2 className='text-[16px] font-medium text-gray-800 line-clamp-2'>
                                        {product.title}
                                    </h2>
                                    <span className='text-[14px] font-bold text-green-600'>
                                        TK {product.price.toLocaleString()}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default Products;