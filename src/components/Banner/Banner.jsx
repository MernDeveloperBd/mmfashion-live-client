import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css"; // স্ট্যান্ডার্ড স্টাইল ইমপোর্ট
import { Link } from "react-router-dom";
import { get_banners } from '../../store/Reducers/homeReducer.js'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
const images = [
    "https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759466127/for_babosa_kori_see5ea.jpg",
    "https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759466127/for_babosa_kori_see5ea.jpg",
    // আরও ইমেজ যোগ করতে পারেন
];

const Banner = () => {
      const dispatch = useDispatch()
    const { banners } = useSelector(state => state.home)
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 1,
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
        },
    };
       useEffect(() => {
        dispatch(get_banners())
    }, [dispatch])

    return (
        <div className="w-full md:mt-4 mb-2">
            <div className="w-[95%] mx-auto">
                <Carousel
                    autoPlay={true}
                    infinite={true}
                    arrows={true}
                    showDots={true}
                    responsive={responsive}
                    autoPlaySpeed={3000}
                    itemClass="relative"
                    containerClass="carousel-container rounded overflow-hidden"
                    dotListClass="custom-dot-list flex justify-center mt-4"
                    className="shadow-md rounded md:h-[350px]"
                >
                    {banners.map((img, i) => (
                        <Link key={i} to={`/product/details/${img?.link}`} className="block w-full">
                            <img
                                src={img.banner}
                                alt={`Banner image ${i + 1}`}
                                className="w-full h-[250px] md:h-[350px] lg:h-[450px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                                <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold text-center px-4 drop-shadow-md">
                                    Explore Latest Collections
                                </h2>
                            </div>
                        </Link>
                    ))}
                </Carousel>
            </div>
        </div>
    );
};

export default Banner;