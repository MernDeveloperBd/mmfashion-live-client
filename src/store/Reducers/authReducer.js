import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import axios from 'axios'
import { base_url } from "../../utils/config";

    export const customer_register = createAsyncThunk(
  'auth/customer_register',
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const ref = localStorage.getItem('ref');
      const payload = ref ? { ...info, referralCode: ref } : info;
      const { data } = await axios.post(`${base_url}/api/customer/customer-register`, payload);
      localStorage.setItem('customerToken', data?.token);
      // success হলে ref ক্লিয়ার করতে পারেন
      localStorage.removeItem('ref');
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Register failed' });
    }
  }
);

export const getReferralInfo = createAsyncThunk(
  'auth/getReferralInfo',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('customerToken');
      const { data } = await axios.get(`${base_url}/api/customer/referral`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (data?.error) return rejectWithValue(data);
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data || { error: 'Failed to load referral' });
    }
  }
);

export const updateReferralAlias = createAsyncThunk(
  'auth/updateReferralAlias',
  async (newCode, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('customerToken');
      const { data } = await axios.put(`${base_url}/api/customer/referral-code`, { newCode }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (data?.error) return rejectWithValue(data);
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data || { error: 'Update failed' });
    }
  }
);

export const customer_login = createAsyncThunk(
    'auth/customer_login',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await axios.post(`${base_url}/api/customer/customer-login`, info)
            localStorage.setItem('customerToken', data.token)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ oldPassword, newPassword }, {fulfillWithValue, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('customerToken');
      const { data } = await axios.put(`${base_url}/api/customer/change-password`,
  { oldPassword, newPassword },
  {
    withCredentials: false, // cookie যাবে না
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  }
);
      if (data?.error) return rejectWithValue(data);
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: 'Change failed' });
    }
  }
);

const decodeToken = (token) => {
    if (token) {
        const userInfo = jwtDecode(token)
          const expireTime = new Date(userInfo.exp * 1000);
      if (new Date() > expireTime) {
        localStorage.removeItem('accessToken');
        return '';
      } else {
       return userInfo
      }
        
    } else {
        return ''
    }
}


export const authReducer = createSlice({
    name: 'auth',
    initialState: {
        loader: false,
        userInfo: decodeToken(localStorage.getItem('customerToken')),
        token: localStorage.getItem('customerToken') || null,
        errorMessage: '',
        successMessage: '',
        referral: { code: '', link: '', totalSignups: 0, balance: 0 }, // NEW
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = "";
            state.successMessage = "";
        },
        user_reset: (state) => {
            state.userInfo = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(customer_register.pending, (state) => {
                state.loader = true
            })
            .addCase(customer_register.rejected, (state, action) => {
                state.errorMessage = action.payload?.error
                state.loader = false
            })
            .addCase(customer_register.fulfilled, (state, action) => {
                const userInfo = decodeToken(action.payload?.token)
                state.successMessage = action.payload?.message
                state.loader = false
                state.userInfo = userInfo
            })
            .addCase(customer_login.pending, (state) => {
                state.loader = true
            })
            .addCase(customer_login.rejected, (state, action) => {
                state.errorMessage = action.payload?.error
                state.loader = false
            })
            .addCase(customer_login.fulfilled, (state, action) => {
                const userInfo = decodeToken(action.payload?.token)
                state.successMessage = action.payload?.message
                const token = action.payload?.token;
                state.token = token;
                state.loader = false
                state.userInfo = userInfo
            })
            // extraReducers Add
            // ✅ Change Password Cases
            .addCase(changePassword.pending, (state) => {
                state.loader = true;
                state.errorMessage = '';
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                const userInfo = decodeToken(action.payload?.token);
                state.successMessage = action.payload?.message;
                state.loader = false;
                state.userInfo = userInfo;
                state.token = action.payload?.token || null; // added
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loader = false;
                state.errorMessage = action.payload?.error || 'Invalid old password';
            })
            .addCase(getReferralInfo.pending, (state) => {
  state.loader = true;
})
.addCase(getReferralInfo.fulfilled, (state, action) => {
  state.loader = false;
  state.referral = {
    code: action.payload?.code || '',
    link: action.payload?.link || '',
    totalSignups: action.payload?.totalSignups || 0,
    balance: action.payload?.balance || 0
  };
})
.addCase(getReferralInfo.rejected, (state, action) => {
  state.loader = false;
  state.errorMessage = action.payload?.error || 'Failed to load referral';
})

.addCase(updateReferralAlias.pending, (state) => {
  state.loader = true;
})
.addCase(updateReferralAlias.fulfilled, (state, action) => {
  state.loader = false;
  state.successMessage = action.payload?.message || 'Updated';
  state.referral = {
    ...state.referral,
    code: action.payload?.code || state.referral.code,
    link: action.payload?.link || state.referral.link
  };
})
.addCase(updateReferralAlias.rejected, (state, action) => {
  state.loader = false;
  state.errorMessage = action.payload?.error || 'Update failed';
})
    },
})

export const { messageClear, user_reset } = authReducer.actions
export default authReducer.reducer