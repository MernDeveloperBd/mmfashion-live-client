import  { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import { Rating as StarInput } from '@fluentui/react-rating';

import Ratings from '../Ratings/Ratings';
import RatingTemp from '../RatingTemp';
import Pagination from '../Pagination/Pagination';

import {customer_review,  get_product,  get_reviews,  messageClear} from '../../store/Reducers/homeReducer';

const Reviews = ({ product }) => {    
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
 
  const {successMessage, reviews = [], totalReview = 0, rating_review = [] } = useSelector((state) => state.home);

  const [pageNumber, setPageNumber] = useState(1);
  const [perPage] = useState(6);

  const [rat, setRat] = useState(0); // 1..5
  const [re, setRe] = useState('');

  // রেটিং ডিস্ট্রিবিউশন 5→1
  const distribution = useMemo(() => {
    const map = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    (Array.isArray(rating_review) ? rating_review : []).forEach((it) => {
      const star = Number(it?.rating ?? it?._id);
      const sum = Number(it?.sum ?? it?.count ?? 0);
      if (map[star] != null) map[star] = sum;
    });
    return [5, 4, 3, 2, 1].map((star) => {
      const count = map[star] || 0;
      const percent = totalReview > 0 ? Math.floor((100 * count) / totalReview) : 0;
      return { star, count, percent };
    });
  }, [rating_review, totalReview]);

  const avgRating = Number(product?.rating || 0);

  // রিভিউ লোড
  useEffect(() => {
    if (product?._id) {
      dispatch(get_reviews({ productId: product._id, pageNumber, perPage }));
    }
  }, [dispatch, product?._id, pageNumber, perPage]);

  // সাবমিট সাকসেস হলে রিফ্রেশ + রিসেট
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      if (product?._id) {
        dispatch(get_reviews({ productId: product._id, pageNumber, perPage }));
      }
      if (product?.slug) dispatch(get_product(product.slug));
      setRat(0);
      setRe('');
      dispatch(messageClear());
    }
  }, [successMessage, dispatch, product?._id, product?.slug, pageNumber, perPage]);

  // সাবমিট
  const review_submit = (e) => {
    e.preventDefault();
    if (!userInfo) return toast.error('Please login to write a review');
    if (!product?._id) return;
    if (!rat || rat < 1) return toast.error('Please select a rating (1-5)');
    if (!re.trim()) return toast.error('Please write your review');

    const payload = {
      name: userInfo.name,
      review: re.trim(),
      rating: Number(rat),
      productId: product._id,
    };
    dispatch(customer_review(payload));
  };

  return (
    <div className="mt-0">
      {/* Summary */}
      <div className="flex gap-10 md:flex-col">
        {/* Left: average */}
        <div className="flex flex-col gap-2 justify-start items-start py-4">
          <div className="flex items-end gap-1">
            <span className="text-6xl font-semibold">{avgRating.toFixed(1)}</span>
            <span className="text-3xl font-semibold text-slate-600">/5</span>
          </div>
          <div className="flex text-4xl">
            <Ratings ratings={avgRating} />
          </div>
          <p className="text-sm text-slate-600">{totalReview} Reviews</p>
        </div>

        {/* Right: distribution */}
        <div className="flex gap-2 flex-col py-4">
          {distribution.map((d) => (
            <div key={d.star} className="flex justify-start items-center gap-5">
              <div className="text-md flex gap-1 w-[93px]">
                <RatingTemp rating={d.star} />
              </div>
              <div className="w-[200px] h-[14px] bg-slate-200 relative rounded">
                <div
                  style={{ width: `${d.percent}%` }}
                  className="h-full bg-[#EDBB0E] rounded"
                />
              </div>
              <p className="text-sm text-slate-600 w-[40px] text-right">{d.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Review list */}
      <h2 className="text-slate-600 text-xl font-bold py-5">
        Product Reviews ({totalReview})
      </h2>

      <div className="flex flex-col gap-8 pb-10 pt-4">
        {Array.isArray(reviews) && reviews.length > 0 ? (
          reviews.map((r, i) => (
            <div key={r?._id || i} className="flex flex-col gap-1 shadow-lg md:p-2">
              <div className="flex justify-between items-center">
                <div className="flex gap-1 text-xl">
                  <RatingTemp rating={Number(r?.rating || 0)} />
                </div>
                <span className="text-slate-600 text-sm">{r?.date}</span>
              </div>
              <span className="text-slate-700 text-sm font-medium">
                {r?.name || 'User'}
              </span>
              
              <p className="text-slate-600 text-sm">{r?.review || ''}</p>
            </div>
          ))
        ) : (
          <div className="text-slate-500 text-sm">No reviews yet.</div>
        )}

        <div className="flex justify-end">
          {totalReview > perPage && (
            <Pagination
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              totalItem={totalReview}
              perPage={perPage}
              showItem={7}
            />
          )}
        </div>
      </div>

      {/* Write a review */}
      <div className="mt-6">
        {userInfo ? (
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-slate-700">Your Rating</label>
            <div className="flex gap-1">
              {/* Fluent UI Rating */}
              <StarInput
                value={rat}
                max={5}
                size="large"             // small | medium | large (optional)
                onChange={(_, data) => setRat(Number(data.value))}
                // aria-label="Rate this product" // optional
              />
            </div>

            <form onSubmit={review_submit} className="mt-2">
              <label className="text-sm font-semibold text-slate-700">
                Your Review
              </label>
              <textarea
                value={re}
                onChange={(e) => setRe(e.target.value)}
                required
                className="border outline-0 p-3 w-full rounded mt-1 text-sm"
                rows={5}
                placeholder="Write your experience..."
              />
              <div className="mt-2">
                <button
                  type="submit"
                  className="py-1.5 px-5 bg-indigo-600 text-white rounded-sm hover:bg-indigo-700 transition text-sm font-semibold cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <Link
              className="inline-block py-1.5 px-5 bg-indigo-600 text-white rounded-sm text-sm hover:bg-indigo-700"
              to="/login"
            >
              Login to write a review
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;