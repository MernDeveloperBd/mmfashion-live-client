import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../Api/api";

export const get_category = createAsyncThunk(
  'product/get_category',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get('/home/get-categories');
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.response);
    }
  }
);

export const get_products = createAsyncThunk(
  'product/get_products',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get('/home/get-products');
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.response);
    }
  }
);

export const get_product = createAsyncThunk(
  'product/get_product',
  async (slug, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/home/get-product/${slug}`);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.response);
    }
  }
);

export const price_range_product = createAsyncThunk(
  'product/price_range_product',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get('/home/price-range-latest-product');
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.response);
    }
  }
);

// UPDATED: send IDs in query
export const query_products = createAsyncThunk(
  'home/query_products',
  async ({ low, high, categoryId, subcategoryId, childId, category, subcategory, child, rating, sortPrice, pageNumber, perPage }, { rejectWithValue }) => {
    try {
      const qs = new URLSearchParams();
      qs.set('page', String(pageNumber || 1));
      if (perPage) qs.set('perPage', String(perPage)); // অথবা getState থেকে নিন
      if (typeof low !== 'undefined') qs.set('low', String(low));
      if (typeof high !== 'undefined') qs.set('high', String(high));
      if (rating) qs.set('rating', String(rating));
      if (sortPrice === 'low-to-high') qs.set('sort', 'priceAsc');
      if (sortPrice === 'high-to-low') qs.set('sort', 'priceDesc');

      // IDs first (more precise)
      if (categoryId) qs.set('categoryId', categoryId);
      if (subcategoryId) qs.set('subcategoryId', subcategoryId);
      if (childId) qs.set('childId', childId);

      // Optional: name fallback
      if (category) qs.set('category', category);
      if (subcategory) qs.set('subcategory', subcategory);
      if (child) qs.set('child', child);

      const { data } = await api.get(`/product-get-all?${qs.toString()}`, { withCredentials: false });
      return data; // { products, totalProduct }
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

export const customer_review = createAsyncThunk(
  'review/customer_review',
  async (info, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.post('/home/customer/submit-review', info);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.response);
    }
  }
);

export const get_reviews = createAsyncThunk(
  'review/get_reviews',
  async ({ productId, pageNumber }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/home/customer/get-reviews/${productId}?pageNo=${pageNumber}`);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.response);
    }
  }
);

export const get_banner = createAsyncThunk(
  'banner/get_banner',
  async (productId, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/banner/get/${productId}`);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: error.message });
    }
  }
);

export const get_banners = createAsyncThunk(
  'banner/get_banners',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get('/banner/get-all');
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: error.message });
    }
  }
);

export const homeReducer = createSlice({
  name: 'home',
  initialState: {
    categories: [],
    products: [],
    totalProduct: 0,
    perPage: 12,
    latest_product: [],
    topRated_product: [],
    discount_product: [],
    priceRange: { low: 0, high: 100 },
    product: {},
    relatedProducts: [],
    moreProducts: [],
    successMessage: '',
    errorMessage: '',
    totalReview: 0,
    rating_review: [],
    reviews: [],
    banners: [],
    banner: null
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(get_category.fulfilled, (state, action) => {
        state.categories = action.payload?.categories || [];
      })
      .addCase(get_products.fulfilled, (state, action) => {
        state.products = action.payload?.products || [];
        state.latest_product = action.payload?.latest_product || [];
        state.topRated_product = action.payload?.topRated_product || [];
        state.discount_product = action.payload?.discount_product || [];
      })
      .addCase(get_product.fulfilled, (state, action) => {
        state.product = action.payload.product || {};
        state.relatedProducts = action.payload.relatedProducts || [];
        state.moreProducts = action.payload.moreProducts || [];
      })
      .addCase(price_range_product.fulfilled, (state, action) => {
        state.latest_product = action.payload?.latest_product || [];
        state.priceRange = action.payload?.priceRange || state.priceRange;
      })
      .addCase(query_products.fulfilled, (state, action) => {
        state.products = action.payload?.products || [];
        state.totalProduct = action.payload?.totalProduct || 0;
        state.perPage = action.payload?.perPage || state.perPage;
      })
      .addCase(customer_review.fulfilled, (state, action) => {
        state.successMessage = action.payload?.message || '';
      })
      .addCase(get_reviews.fulfilled, (state, action) => {
        state.reviews = action.payload?.reviews || [];
        state.totalReview = action.payload?.totalReview || 0;
        state.rating_review = action.payload?.rating_review || [];
      })
      .addCase(get_banner.fulfilled, (state, { payload }) => {
        state.banner = payload?.banner || null;
      })
      .addCase(get_banner.rejected, (state, { payload }) => {
        state.banner = null;
        state.errorMessage = payload?.message || '';
      })
      .addCase(get_banners.fulfilled, (state, { payload }) => {
        state.banners = payload?.banners || [];
      });
  },
});

export const { messageClear } = homeReducer.actions;
export default homeReducer.reducer;