import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../Api/api";

export const get_dashboard_index_data = createAsyncThunk(
    'dashboard/get_dashboard_index_data',
    async (userId, {rejectWithValue, fulfillWithValue
    }) => {
        
        try {
            const {
                data
            } = await api.get(`/home/customer/gat-dashboard-data/${userId}`)
            
            
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.response.data)
        }
    }
)



export const dashboardReducer  = createSlice({
     name: 'dashboard',
    initialState: {
         recentOrders: [],
        errorMessage: '',
        successMessage: '',
        totalOrder: 0,
        pendingOrder: 0,
        cancelledOrder: 0
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = "";
            state.successMessage = "";
        },
      
    },
    extraReducers: (builder) => {
        builder        
           .addCase(get_dashboard_index_data.fulfilled, (state, action) => {
              state.totalOrder = action.payload?.totalOrder
            state.pendingOrder = action.payload?.pendingOrder
            state.cancelledOrder = action.payload?.cancelledOrder
            state.recentOrders = action.payload?.recentOrders             
            
          }) 
       
        

    },
})

export const { messageClear } = dashboardReducer.actions
export default dashboardReducer.reducer