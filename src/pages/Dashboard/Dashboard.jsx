import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { FaList } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { RiProductHuntLine } from "react-icons/ri";
import { BsChat, BsHeart } from "react-icons/bs";
import { TfiLock } from "react-icons/tfi";
import { BiLogInCircle } from "react-icons/bi";
import { VscReferences } from "react-icons/vsc";
import api from "../../Api/api";
import { useDispatch } from "react-redux";
import { user_reset } from '../../store/Reducers/authReducer'
import { reset_count } from '../../store/Reducers/cardReducer'

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false); // mobile sidebar

  const logout = async () => {
    try {
      const { data } = await api.get('/customer/logout')
      localStorage.removeItem('customerToken')
      dispatch(user_reset())
      dispatch(reset_count())
      navigate('/login')
    } catch (error) {
      console.log(error.response.data)
    }
  }

  const linkBase =
    "flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 transition";
  const activeClass = "bg-slate-100 text-slate-900 font-semibold";

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      {/* Top bar (mobile) */}
      <div className="md:w-[95%] mx-auto md:hidden flex items-center justify-between py-4">
        <h1 className="text-lg font-bold text-slate-800">Dashboard</h1>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="p-2 rounded bg-indigo-600 text-white"
        >
          <FaList />
        </button>
      </div>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Layout */}
      <div className="md:w-[95%] mx-auto pb-8 md:grid md:grid-cols-[260px_1fr] md:gap-6 relative">
        {/* Sidebar */}
        <aside
          className={`fixed md:static top-0 left-0 z-[50] md:z-20 h-full md:h-auto w-[260px] bg-white shadow md:shadow-none transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          {/* Mobile sidebar header */}
          <div className="md:hidden flex items-center justify-between px-4 py-1.5 border-b">
            <span className="font-semibold text-slate-800">Menu</span>
            <button
              onClick={() => setOpen(false)}
              className="px-3 py-1 rounded bg-slate-200 text-slate-700"
            >
              Close
            </button>
          </div>

          <nav className="p-3 md:p-0 h-[calc(100%-52px)] md:h-auto overflow-y-auto">
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? activeClass : ""}`
                  }
                  onClick={() => setOpen(false)}
                >
                  <RxDashboard className="text-xl" />
                  <span>Dashboard</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/my-orders"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? activeClass : ""}`
                  }
                  onClick={() => setOpen(false)}
                >
                  <RiProductHuntLine className="text-xl" />
                  <span>My Orders</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/my-wishlist"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? activeClass : ""}`
                  }
                  onClick={() => setOpen(false)}
                >
                  <BsHeart className="text-xl" />
                  <span>Wishlist</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/chat"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? activeClass : ""}`
                  }
                  onClick={() => setOpen(false)}
                >
                  <BsChat className="text-xl" />
                  <span>Chat</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/referral"
                  className={({ isActive }) => `${linkBase} ${isActive ? activeClass : ""}`}
                  onClick={() => setOpen(false)}
                >
                  <VscReferences className="text-xl" />
                  <span>Referral</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/change-password"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? activeClass : ""}`
                  }
                  onClick={() => setOpen(false)}
                >
                  <TfiLock className="text-xl" />
                  <span>Change Password</span>
                </NavLink>
              </li>

              <li onClick={logout}>
                <button
                  type="button"
                  className={`${linkBase} w-full text-left cursor-pointer`}
                // এখানে শুধু UI, কোনো ফাংশনালিটি নাই
                >
                  <BiLogInCircle className="text-xl" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        {/* Content */}
        <main className="md:mt-2 mt-0">
          <div className="bg-white rounded shadow-sm p-0 min-h-[50vh] md:min-h-[60vh]">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;