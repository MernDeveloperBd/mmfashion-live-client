// src/store/Reducers/withdrawReducer.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper: call API with fetch
const api = async (url, options = {}, token) => {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.message || 'Request failed';
    throw new Error(msg);
  }
  return data;
};

// GET user withdraw requests
export const getWithdrawRequests = createAsyncThunk(
  'withdraw/getRequests',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.auth?.token;
      const data = await api('/api/withdrawals', {}, token);
      return data; // expect { requests: [...] }
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

// CREATE withdraw request
export const createWithdrawRequest = createAsyncThunk(
  'withdraw/create',
  async ({ amount }, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.auth?.token;
      const data = await api('/api/withdrawals', {
        method: 'POST',
        body: JSON.stringify({ amount })
      }, token);
      return data; // expect { message, request }
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const withdrawSlice = createSlice({
  name: 'withdraw',
  initialState: {
    requests: [],
    wLoader: false,
    successMessage: '',
    errorMessage: ''
  },
  reducers: {
    messageClear: (state) => {
      state.successMessage = '';
      state.errorMessage = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWithdrawRequests.pending, (state) => {
        state.wLoader = true;
      })
      .addCase(getWithdrawRequests.fulfilled, (state, { payload }) => {
        state.wLoader = false;
        state.requests = payload?.requests || [];
      })
      .addCase(getWithdrawRequests.rejected, (state, { payload }) => {
        state.wLoader = false;
        state.errorMessage = payload || 'Failed to load';
      })
      .addCase(createWithdrawRequest.pending, (state) => {
        state.wLoader = true;
      })
      .addCase(createWithdrawRequest.fulfilled, (state, { payload }) => {
        state.wLoader = false;
        state.successMessage = payload?.message || 'Withdraw request submitted';
        // Optionally push to list immediately:
        if (payload?.request) {
          state.requests = [payload.request, ...state.requests];
        }
      })
      .addCase(createWithdrawRequest.rejected, (state, { payload }) => {
        state.wLoader = false;
        state.errorMessage = payload || 'Failed to submit';
      });
  }
});

export const { messageClear } = withdrawSlice.actions;
export default withdrawSlice.reducer;