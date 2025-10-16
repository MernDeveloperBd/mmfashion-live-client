
import homeReducer from "./Reducers/homeReducer";
import authReducer from "./Reducers/authReducer";
import cardReducer from "./Reducers/cardReducer";
import orderReducer from "./Reducers/orderReducer";
import dashboardReducer from "./Reducers/dashboardReducers";
import chatReducer from "./Reducers/chatReducer";
import withdrawReducer from './Reducers/withdrawReducer'; // NEW

const rootReducers = {
  home: homeReducer,
  auth: authReducer,
  card: cardReducer,
  order: orderReducer,
  dashboard: dashboardReducer,
  chat: chatReducer,
  withdraw: withdrawReducer // NEW
};

export default rootReducers;