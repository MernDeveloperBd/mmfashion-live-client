import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../Api/api";
import axios from "axios";
import { base_url } from "../../utils/config";

/**
 * CUSTOMER SIDE
 */
export const place_order = createAsyncThunk(
  'order/place_order',
  async ({ price, products, shipping_fee, shippingInfo, userId, navigate, items }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(
        `${base_url}/api/home/order/palce-order`,
        { price, products, shipping_fee, shippingInfo, userId, items },
        config
      );
      // navigate to payment after order created
      navigate('/payment', {
        state: {
          price: price + shipping_fee,
          items,
          orderId: data.orderId
        }
      });
      return true;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: 'Order place failed' });
    }
  }
);

export const get_orders = createAsyncThunk(
  'order/get_orders',
  async ({ customerId, status }, { rejectWithValue, fulfillWithValue ,getState}) => {
    const token = getState().auth.token
        const config = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
    try {
      const { data } = await axios.get(`${base_url}/api/home/customer/gat-orders/${customerId}/${status}`,config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: 'Failed to load orders' });
    }
  }
);

export const get_order = createAsyncThunk(
  'order/get_order',
  async (orderId, { rejectWithValue, fulfillWithValue,getState }) => {
    const token = getState().auth.token
        const config = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
    try {
      const { data } = await axios.get(`${base_url}/api/home/customer/gat-order/${orderId}`,config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: 'Failed to load order' });
    }
  }
);

/**
 * ADMIN SIDE
 */
export const get_admin_order = createAsyncThunk(
  'order/get_admin_order',
  async (orderId, { getState, rejectWithValue, fulfillWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // আপনার backend রুট যদি আলাদা হয়, এখানটা বদলান
      const { data } = await api.get(`/admin/order/get-order/${orderId}`, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: 'Failed to load admin order' });
    }
  }
);

export const admin_order_status_update = createAsyncThunk(
  'order/admin_order_status_update',
  async ({ orderId, info }, { getState, rejectWithValue, fulfillWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // আপনার backend রুট যদি আলাদা হয়, এখানটা বদলান
      const { data } = await api.put(`/admin/order/status-update/${orderId}`, info, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: 'Failed to update status' });
    }
  }
);

/**
 * BKASH VERIFICATION (ADMIN VIEW)
 */
export const get_bkash_by_order = createAsyncThunk(
  'order/get_bkash_by_order',
  async (orderId, { getState, rejectWithValue, fulfillWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const { data } = await api.get(`/payment/bkash/by-order/${orderId}`, config);
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Network error' });
    }
  }
);

export const approve_bkash_payment = createAsyncThunk(
  'order/approve_bkash_payment',
  async ({ paymentId, orderId, note }, { getState, rejectWithValue, fulfillWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const { data } = await api.post(`/payment/bkash/approve`, { paymentId, note }, config);
      return fulfillWithValue({ ...data, orderId });
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Network error' });
    }
  }
);

export const reject_bkash_payment = createAsyncThunk(
  'order/reject_bkash_payment',
  async ({ paymentId, reason }, { getState, rejectWithValue, fulfillWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const { data } = await api.post(`/payment/bkash/reject`, { paymentId, reason }, config);
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Network error' });
    }
  }
);

/**
 * SLICE
 */
export const orderReducer = createSlice({
  name: 'order',
  initialState: {
    loader: false,
    verifyLoading: false,

    // customer
    myOrders: [],
    myOrder: null,

    // admin
    order: null,

    // bkash
    bkashPayments: [],

    // messages
    errorMessage: '',
    successMessage: '',
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // place_order
      .addCase(place_order.pending, (state) => {
        state.loader = true;
        state.errorMessage = '';
        state.successMessage = '';
      })
      .addCase(place_order.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.message || 'Order place failed';
      })
      .addCase(place_order.fulfilled, (state, action) => {
        state.loader = false;
        state.myOrder= action.payload?.myOrder
      })

      // get_orders (customer list)
      .addCase(get_orders.pending, (state) => {
        state.loader = true;
      })
      .addCase(get_orders.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.message || 'Failed to load orders';
      })
      .addCase(get_orders.fulfilled, (state, action) => {
        state.loader = false;
        state.myOrders = action.payload?.myOrder || [];
      })

      // get_order (customer details)
      .addCase(get_order.pending, (state) => {
        state.loader = true;
      })
      .addCase(get_order.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.message || 'Failed to load order';
      })
      .addCase(get_order.fulfilled, (state, action) => {
        state.loader = false;
        state.myOrder = action.payload?.order || null;
      })

      // get_admin_order (admin details)
      .addCase(get_admin_order.pending, (state) => {
        state.loader = true;
      })
      .addCase(get_admin_order.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.message || 'Failed to load admin order';
      })
      .addCase(get_admin_order.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.order = payload?.order || null;
      })

      // admin_order_status_update
      .addCase(admin_order_status_update.pending, (state) => {
        state.loader = true;
      })
      .addCase(admin_order_status_update.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.message || 'Failed to update status';
      })
      .addCase(admin_order_status_update.fulfilled, (state, action) => {
        state.loader = false;
        const payload = action.payload || {};
        state.successMessage = payload?.message || 'Status updated';

        // Update local admin order delivery status
        const newStatus = payload?.order?.delivery_status || action.meta?.arg?.info?.status;
        if (state.order && newStatus) {
          state.order.delivery_status = newStatus;
        }
      })

      // get_bkash_by_order
      .addCase(get_bkash_by_order.fulfilled, (state, { payload }) => {
        state.bkashPayments = payload?.payments || [];
      })

      // approve_bkash_payment
      .addCase(approve_bkash_payment.pending, (state) => {
        state.verifyLoading = true;
      })
      .addCase(approve_bkash_payment.rejected, (state, { payload }) => {
        state.verifyLoading = false;
        state.errorMessage = payload?.message || 'Approve failed';
      })
      .addCase(approve_bkash_payment.fulfilled, (state, { payload }) => {
        state.verifyLoading = false;
        state.successMessage = payload?.message || 'Approved';
        state.bkashPayments = state.bkashPayments.map(p =>
          p._id === payload.paymentId ? { ...p, status: 'approved' } : p
        );
        // Update both admin order and customer myOrder if present
        if (state.order) {
          state.order.payment_status = 'paid';
          state.order.payment_method = 'bkash';
        }
        if (state.myOrder) {
          state.myOrder.payment_status = 'paid';
          state.myOrder.payment_method = 'bkash';
        }
      })

      // reject_bkash_payment
      .addCase(reject_bkash_payment.pending, (state) => {
        state.verifyLoading = true;
      })
      .addCase(reject_bkash_payment.rejected, (state, { payload }) => {
        state.verifyLoading = false;
        state.errorMessage = payload?.message || 'Reject failed';
      })
      .addCase(reject_bkash_payment.fulfilled, (state, { payload }) => {
        state.verifyLoading = false;
        state.successMessage = payload?.message || 'Rejected';
        state.bkashPayments = state.bkashPayments.map(p =>
          p._id === payload.paymentId ? { ...p, status: 'rejected' } : p
        );
      });
  },
});

export const { messageClear } = orderReducer.actions;
export default orderReducer.reducer;