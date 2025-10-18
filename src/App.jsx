// src/App.jsx
import useSessionTracker from './hooks/useSessionTracker';
import { useNavigate } from "react-router-dom";
import WelcomeModal from "./components/Modals/WelcomeModal";

import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import Shop from "./pages/Shop/Shop"
import Card from "./pages/Card/Card"
import Details from "./pages/Details/Details"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Shipping from "./pages/Shipping"
import { useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { get_category } from "./store/Reducers/homeReducer"
import CategoryShop from "./pages/Shop/CategoryShop"
import SearchProducts from "./pages/Shop/SearchProducts"
import Payment from "./pages/Payment"
import Dashboard from "./pages/Dashboard/Dashboard"
import ProtectUser from "./utils/ProtectUser"
import Index from "./pages/Dashboard/Index"
import Orders from "./pages/Dashboard/Orders"
import Wishlist from "./pages/Dashboard/Wishlist"
import ChangePassword from "./pages/Dashboard/ChangePassword"
import Order from "./pages/Dashboard/Order"
import Chat from "./pages/Dashboard/Chat"
import ConfirmOrder from "./pages/ConfirmOrder"
import AboutUs from "./pages/AboutUs/AboutUs"
import ContactUsPage from "./pages/ContactUsPage/ContactUsPage"
import Terms from "./pages/Terms/Terms";
import SellerProducts from "./pages/SellerProducts";
import Referral from "./pages/Referral";

// Small gate that runs the session tracker inside Router context
const SessionTrackerGate = () => {
  useSessionTracker();
  return null;
};

// A small gate component that shows the welcome modal once per session
const WelcomeGate = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const sessionKey = 'introModalShown';          // প্রতি সেশনে একবার
  const snoozeKey = 'introModalSnoozeUntil';     // ৭ দিনের জন্য হাইড
  const SNOOZE_DAYS = 5;

  useEffect(() => {
    // 1) ৭ দিনের স্নুজ চেক
    const now = Date.now();
    const snoozeUntil = parseInt(localStorage.getItem(snoozeKey) || '0', 10);
    if (snoozeUntil && now < snoozeUntil) return; // এখনো স্নুজ চলছে

    // 2) এই সেশনে আগেই দেখানো হয়েছে কি?
    const shown = sessionStorage.getItem(sessionKey) === '1';
    if (!shown) {
      setOpen(true);
      sessionStorage.setItem(sessionKey, '1');
    }
  }, []);

  // ৭ দিনের জন্য আর না দেখান
  const handleSnooze7Days = () => {
    const nextShow = Date.now() + SNOOZE_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(snoozeKey, String(nextShow));
    setOpen(false);
  };

  const handleResell = () => {
    setOpen(false);
    // আপনার রিসেলিং রুট থাকলে সেটা দিন
    navigate('http://localhost:5174/login');
  };

  const handleShop = () => {
    setOpen(false);
    navigate('/');
  };

  return (
    <WelcomeModal
      open={open}
      onClose={() => setOpen(false)}
      onNeverShow={handleSnooze7Days}
      onResell={handleResell}
      onShop={handleShop}
    />
  );
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_category())
  }, [dispatch])

  return (
    <BrowserRouter>
      {/* Ensure hooks that need Router context are rendered inside BrowserRouter */}
      <SessionTrackerGate />
      <WelcomeGate />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/card" element={<Card />} />
        <Route path="/order/confirm?" element={<ConfirmOrder />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/seller/:sellerId" element={<SellerProducts />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/terms" element={<Terms />} />
        <Route path={`/products?`} element={<CategoryShop />} />
        <Route path={`/products/search?`} element={<SearchProducts />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/details/:slug" element={<Details />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/payment" element={<Payment />} />

        {/* Dashboard */}
        <Route path='/dashboard' element={<ProtectUser />}>
          <Route path='' element={<Dashboard />}>
            <Route path='' element={<Index />} />
            <Route path='my-orders' element={<Orders />} />
            <Route path='order/details/:orderId' element={<Order />} />
            <Route path='my-wishlist' element={<Wishlist />} />
            <Route path='my-profile' element={<ChangePassword />} />
            <Route path='chat' element={<Chat />} />
            <Route path="/dashboard/referral" element={<Referral />} />
            <Route path='chat/:sellerId' element={<Chat />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App