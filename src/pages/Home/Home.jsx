import { useEffect } from "react";
import Banner from "../../components/Banner/Banner";
import Category from "../../components/Category/Category";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import FeaturesProduct from "../../components/Products/FeaturesProduct";
import Products from "../../components/Products/Products";
import { useDispatch, useSelector } from "react-redux";
import {  get_products } from "../../store/Reducers/homeReducer";
import FeaturesProductGrid from "../../components/Products/FeaturesProductGrid";
import FeaturesProductGridBottom from "../../components/Products/FeaturesProductGridBottom";


const Home = () => {
    const dispatch = useDispatch()
    const { products, latest_product, topRated_product, discount_product } = useSelector(state => state.home)    
 
    
    useEffect(() => {
        dispatch(get_products())
    }, [dispatch]);
    
    return (
        <div className="w-full">
            <Header  />
            <Banner />
            <div className="my-4">
                <Category />
            </div>
             <div className="py-[30px]">
                <FeaturesProductGrid products={products}/>
            </div>
             {/* Features product */}
            <div className="py-[30px]">
                <FeaturesProduct products={products}/>
            </div>
           <div className="py-[30px]">
                <FeaturesProductGridBottom products={products}/>
            </div>
            {/* <div className="my-4">
                <AllCategory />
            </div> */}
           
            <div className="md:py-2">
                <div className="w-[95%] flex flex-wrap mx-auto px-2">
                    <div className="grid w-full grid-cols-1 md:grid-cols-3 md:gap-8">
                        <div className="overflow-hidden">
                            <Products title="Latest Products" products={latest_product}/>
                        </div>
                        <div className="overflow-hidden">
                            <Products title="Top Rated Products" products={topRated_product}/>
                        </div>
                        <div className="overflow-hidden">
                            <Products title="Discout Products" products={discount_product}/>
                        </div>

                    </div>
                </div>
            </div>
            <div className="py-[20px]">
                <Footer />
            </div>
        </div>
    );
};

export default Home;