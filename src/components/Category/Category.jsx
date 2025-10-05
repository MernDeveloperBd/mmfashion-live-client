import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


const Category = () => {
    const { categories } = useSelector(state => state.home)
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 8, // ডেস্কটপে 4 টা দেখাবে
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 6,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 4, // ট্যাবলেটে 2 টা দেখাবে
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2, // মোবাইলে 2 টা দেখাবে
        },
    };


    return (
        <div className="w-full md:mt-4 mb-2 relative">
            <div className="w-[95%] mx-auto">
                <Carousel
                    autoPlay={false} 
                    infinite={true}
                    arrows={true}
                    responsive={responsive}
                    autoPlaySpeed={3000}
                    itemClass="p-2" 
                    containerClass="carousel-container rounded-xl overflow-hidden"
                    dotListClass="custom-dot-list flex justify-center mt-4"
                    className="shadow-md rounded-lg" 
                >
                    {categories.map((category, i) => (
                        <Link key={i} to={`/products?category=${category?.name}`} className="block">
                            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 cursor-pointer">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-32 object-cover rounded-t-lg" // ইমেজ সাইজ সেট
                                />
                                <h3 className="mt-2 text-center text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-brand dark:hover:text-brand-light transition-colors">
                                    {category.name}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </Carousel>
            </div>
        </div>
    );
};

export default Category;