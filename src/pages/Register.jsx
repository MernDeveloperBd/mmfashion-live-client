import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { FaFacebookF } from 'react-icons/fa';
import { AiOutlineGoogle, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { customer_register, messageClear } from '../store/Reducers/authReducer';
import { FadeLoader } from 'react-spinners';

const Register = () => {
  const { loader, successMessage, errorMessage, userInfo } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [state, setState] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  const inputHandle = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const register = (e) => {
    e.preventDefault();
    dispatch(customer_register(state));
  };
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  if (ref) localStorage.setItem('ref', ref);
}, []);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (userInfo) {
      navigate('/');
    }
  }, [dispatch, navigate, userInfo, successMessage, errorMessage]);

  // Simple password strength UI
  const passStrength = useMemo(() => {
    const p = state.password || '';
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score; // 0-4
  }, [state.password]);

  const strengthLabel = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'][passStrength] || 'Too short';
  const strengthColor = ['bg-slate-200', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-500', 'bg-emerald-600'][passStrength] || 'bg-slate-200';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      {loader && (
        <div className="fixed inset-0 z-[999] bg-black/20 backdrop-blur-[1px] grid place-items-center">
          <FadeLoader color="#10b981" />
        </div>
      )}

      <Header />

      <main className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            {/* Visual/Brand side */}
            <div className="relative hidden md:block">
              <img
                className="w-full h-full object-cover"
                src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759566837/login_ilkshu.jpg"
                alt="Create an account"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-semibold">Join MM Fashion World</h3>
                <p className="opacity-90">Exclusive offers, fast checkout, and order tracking.</p>
                <ul className="mt-3 text-sm space-y-1 opacity-90">
                  <li>• Save your favorites</li>
                  <li>• Get early access to deals</li>
                  <li>• Seamless order updates</li>
                </ul>
              </div>
            </div>

            {/* Form side */}
            <div className="p-6 md:p-10 bg-white">
              {/* Header */}
              <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
                <p className="text-slate-600 mt-1">It only takes a minute</p>
              </div>

              {/* Form */}
              <form onSubmit={register} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                    Name
                  </label>
                  <div className="mt-1 relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <FiUser />
                    </span>
                    <input
                      onChange={inputHandle}
                      value={state.name}
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      required
                      className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <div className="mt-1 relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <FiMail />
                    </span>
                    <input
                      onChange={inputHandle}
                      value={state.email}
                      type="email"
                      id="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <FiLock />
                    </span>
                    <input
                      onChange={inputHandle}
                      value={state.password}
                      type={showPass ? 'text' : 'password'}
                      id="password"
                      name="password"
                      placeholder="At least 8 characters"
                      required
                      className="w-full pl-10 pr-12 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(p => !p)}
                      className="absolute inset-y-0 right-0 px-3 text-sm text-slate-500 hover:text-slate-700 cursor-pointer"
                      aria-label={showPass ? 'Hide password' : 'Show password'}
                    >
                      {showPass ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {/* Password strength meter */}
                  <div className="mt-2">
                    <div className="h-1.5 w-full bg-slate-100 rounded">
                      <div
                        className={`h-full rounded ${strengthColor} transition-all`}
                        style={{ width: `${(passStrength / 4) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Strength: {strengthLabel}</div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loader}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {loader ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-slate-500 text-sm">or</span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              {/* Social register */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  <FaFacebookF />
                  Continue with Facebook
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                >
                  <AiOutlineGoogle />
                  Continue with Google
                </button>
              </div>

              {/* Links */}
              <div className="text-center text-slate-700 mt-6 text-sm ">
                <p>
                  Already have an account?
                  <Link className="text-emerald-600 hover:underline ml-1 cursor-pointer" to="/login">
                    Login
                  </Link>
                </p>
                <p className="mt-2">
                  Seller?
                  <a
                    className="text-emerald-600 hover:underline ml-1"
                    target="_blank"
                    rel="noreferrer"
                    href={`${import.meta.env.VITE_DASHBOARD_URL}/login`}
                  >
                    Login to seller account
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Small safety note */}
          <p className="text-center text-xs text-slate-500 mt-6">
            By creating an account, you agree to our{" "}
            <Link to="/t&c" className="underline">Terms & Conditions</Link> and{" "}
            <Link to="/privacy-policy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;