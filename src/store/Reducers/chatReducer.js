import {
    createSlice,
    createAsyncThunk
} from '@reduxjs/toolkit'
import api from '../../Api/api'


export const add_friend = createAsyncThunk(
    'chat/add_friend',
    async (info, { fulfillWithValue, rejectWithValue }) => {

        try {
            const {
                data
            } = await api.post('/chat/customer/add-customer-friend', info)          
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const send_message = createAsyncThunk(
    'chat/send_message',
    async (info, { fulfillWithValue, rejectWithValue }) => {

        try {
            const {
                data
            } = await api.post('/chat/customer/send-message-to-seller', info)
            
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const chatReducer = createSlice({
    name: 'chat',
    initialState: {
        my_friends: [],
        fd_messages: [],
        currentFd: "",
        successMessage: "",
        errorMessage: ""
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = ''
            state.successMessage = ''
        },
        updateMessage: (state, action) => {
            state.fd_messages = [...state.fd_messages, action.payload]
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(add_friend.fulfilled, (state, action) => {
                state.fd_messages = action.payload.messages
                state.currentFd = action.payload.currentFd
                state.my_friends = action.payload.myFriends
            })
            .addCase(send_message.fulfilled, (state, action) => {
                let tempFriends = state.my_friends
                let index = tempFriends.findIndex(f => f.fdId === action.payload.message.receverId)
                while (index > 0) {
                    let temp = tempFriends[index]
                    tempFriends[index] = tempFriends[index - 1]
                    tempFriends[index - 1] = temp
                    index--
                }
                state.my_friends = tempFriends
                state.fd_messages = [...state.fd_messages, action.payload.message]
                state.successMessage = ' message send success'
            })

    },

})

export const { messageClear, updateMessage } = chatReducer.actions
export default chatReducer.reducer