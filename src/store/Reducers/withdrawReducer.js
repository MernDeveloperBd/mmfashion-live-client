// src/store/Reducers/withdrawReducer.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { base_url } from '../../utils/config';

// GET user withdraw requests
export const getWithdrawRequests = createAsyncThunk(
  'withdraw/getRequests',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.auth?.token || localStorage.getItem('customerToken');
      const { data } = await axios.get(`${base_url}/api/withdrawals`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (data?.error) {
        // backend returned an error object
        return rejectWithValue(data?.error || data);
      }

      return data; // expect { requests: [...] } or { request: [...] }
    } catch (e) {
      return rejectWithValue(
        e?.response?.data?.error || e?.response?.data || e?.message || 'Failed to load'
      );
    }
  }
);

// CREATE withdraw request
export const createWithdrawRequest = createAsyncThunk(
  'withdraw/create',
  async ({ amount }, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.auth?.token || localStorage.getItem('customerToken');
      const { data } = await axios.post(
        `${base_url}/api/withdrawals`,
        { amount },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      if (data?.error) {
        return rejectWithValue(data?.error || data);
      }

      return data; // expect { message, request }
    } catch (e) {
      return rejectWithValue(
        e?.response?.data?.error || e?.response?.data || e?.message || 'Failed to submit'
      );
    }
  }
);

const initialState = {
  requests: [],
  request: '',
  wLoader: false,
  successMessage: '',
  errorMessage: ''
};

const withdrawSlice = createSlice({
  name: 'withdraw',
  initialState,
  reducers: {
    messageClear: (state) => {
      state.successMessage = '';
      state.errorMessage = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Load list
      .addCase(getWithdrawRequests.pending, (state) => {
        state.wLoader = true;
      })
      .addCase(getWithdrawRequests.fulfilled, (state, { payload }) => {
        state.wLoader = false;
        const raw =
          payload?.requests ??
          payload?.request ??
          []; // handle both {requests: []} and {request: []}
        state.requests = Array.isArray(raw) ? raw : raw ? [raw] : [];
      })
      .addCase(getWithdrawRequests.rejected, (state, { payload }) => {
        state.wLoader = false;
        state.errorMessage =
          typeof payload === 'string' ? payload : payload?.error || 'Failed to load';
      })

      // Create request
      .addCase(createWithdrawRequest.pending, (state) => {
        state.wLoader = true;
      })
      .addCase(createWithdrawRequest.fulfilled, (state, { payload }) => {
        state.wLoader = false;
        state.successMessage = payload?.message || 'Withdraw request submitted';
        if (payload?.request) {
          // prepend newly created request
          state.requests = [payload.request, ...(state.requests || [])];
          state.request = payload.request;
        }
      })
      .addCase(createWithdrawRequest.rejected, (state, { payload }) => {
        state.wLoader = false;
        state.errorMessage =
          typeof payload === 'string' ? payload : payload?.error || 'Failed to submit';
      });
  }
});

export const { messageClear } = withdrawSlice.actions;
export default withdrawSlice.reducer;