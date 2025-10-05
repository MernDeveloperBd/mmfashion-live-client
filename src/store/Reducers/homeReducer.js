import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../Api/api";

export const get_category = createAsyncThunk(
    'product/get_category',
    async (_, {fulfillWithValue, rejectWithValue }) => {
        try {
            const {data} = await api.get('/home/get-categories')
                      
            return fulfillWithValue(data)

        } catch (error) {
            console.log(error.response)
            return rejectWithValue(error.response.data || error.response)

        }
    }
)

export const get_products = createAsyncThunk(
    'product/get_products',
    async (_, {  fulfillWithValue, rejectWithValue }) => {
        try {
            const { data } = await api.get('/home/get-products')
            return fulfillWithValue(data)
        } catch (error) {
           
            console.log(error.response)
            return rejectWithValue(error.response.data || error.response)
        }
    }
)

export const price_range_product = createAsyncThunk(
    'product/price_range_product',
    async (_, { fulfillWithValue, rejectWithValue }) => {
        try {
            const {data} = await api.get('/home/price-range-latest-product')
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.response)
            return rejectWithValue(error.response.data || error.response)
        }
    }
)

 export const query_products = createAsyncThunk(
  'product/query_products',
  async (query, { fulfillWithValue, rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (query.category) params.set('category', query.category);
      if (query.rating !== '' && query.rating != null) params.set('rating', query.rating);
      if (query.low != null) params.set('lowPrice', query.low);
      if (query.high != null) params.set('highPrice', query.high);
      if (query.sortPrice) params.set('sortPrice', query.sortPrice);
      if (query.pageNumber) params.set('pageNumber', query.pageNumber);
      if (query.perPage) params.set('perPage', query.perPage); // চাইলে client থেকে পাঠান
      if (query.searchValue) params.set('searchValue', query.searchValue ? query.searchValue :''); 

      const { data } = await api.get(`/home/query-products?${params.toString()}`);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.response || error);
    }
  }
);

export const homeReducer = createSlice({
    name:'home',
      initialState: {
        categories: [],
        products: [],
        totalProduct: 0,
        perPage: 12,
        latest_product: [],
        topRated_product: [],
        discount_product: [],
        priceRange: {
            low: 0,
            high: 100
        },
        product: {},
        relatedProducts: [],
        moreProducts: [],
        successMessage: '',
        errorMessage: '',
        totalReview: 0,
        rating_review: [],
        reviews: [],
        banners: []
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
          state.categories=action.payload?.categories         
        })  
         .addCase(get_products.fulfilled, (state, action) => {
          state.products=action.payload?.products
          state.latest_product = action.payload?.latest_product
            state.topRated_product = action.payload?.topRated_product
            state.discount_product = action.payload?.discount_product        
        })  
         .addCase(price_range_product.fulfilled, (state, action) => {
           state.latest_product = action.payload?.latest_product
            state.priceRange = action.payload?.priceRange        
        })  
         .addCase(query_products.fulfilled, (state, action) => {
           state.products = action.payload?.products
            state.totalProduct = action.payload?.totalProduct
            state.perPage = action.payload?.perPage
                 
        })  
     
        
    },
})

export const { messageClear } = homeReducer.actions;
export default homeReducer.reducer;