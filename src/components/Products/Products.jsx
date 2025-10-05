import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Link } from 'react-router-dom';

const FALLBACK_IMG = 'https://via.placeholder.com/120?text=IMG';

// simple array হলে স্লাইডে ভাগ করা
const chunk = (arr = [], size = 3) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const Products = ({ title, products = [] }) => {
  // ডিজাইন অপরিবর্তিত রাখতে শুধু ডাটা নর্মালাইজ করা হয়েছে
  const slides = Array.isArray(products?.[0]) ? products : chunk(products, 3);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 1 },
    desktop:          { breakpoint: { max: 1024, min: 676 }, items: 1 },
    tablet:           { breakpoint: { max: 676, min: 464 },  items: 1 },
    mobile:           { breakpoint: { max: 464,  min: 0 },    items: 1 },
  };

  const ButtonGroup = ({ next, previous }) => (
    <div className='flex justify-between items-center gap-1 md:px-0'>
      <div className='text-[17px] font-bold text-slate-600'>{title}</div>
      <div className='flex justify-center items-center gap-3 text-slate-600'>
        <button onClick={previous} className='left_arrow'>
          <span><FiChevronLeft/></span>
        </button>
        <button onClick={next} className='left_arrow'>
          <span><FiChevronRight/></span>
        </button>
      </div>
    </div>
  );

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
        {slides.map((group, i) => (
          <div key={i} className='flex flex-col justify-start gap-2 '>
            {group.map((pl, j) => (
              <Link
                key={pl?._id || pl?.slug || j}
                className='flex justify-start items-center'
                to={`/product/details/${encodeURIComponent(pl?.slug || pl?._id || '')}`}
              >
                <img
                  className='w-[80px] h-[80px]'
                  src={pl?.images?.[0] || FALLBACK_IMG}
                  onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                  alt='images'
                />
                <div className='px-3 flex justify-start items-start gap-1 flex-col text-slate-600'>
                  <h2 className='text-[13px] text-gray-800'>
                    {(pl?.name || 'Product').slice(0, 40)}
                  </h2>
                  {pl?.price != null && (
                    <span className='text-md font-bold text-gray-800'>${pl.price}</span>
                  )}
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