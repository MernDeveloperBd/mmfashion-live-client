import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { FaFacebookF } from 'react-icons/fa';
import { AiOutlineGoogle, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FiMail, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { customer_login, messageClear } from '../store/Reducers/authReducer';

const Login = () => {
  const { loader, successMessage, errorMessage, userInfo } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [state, setState] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);

  const inputHandle = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const login = (e) => {
    e.preventDefault();
    dispatch(customer_login(state));
  };

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

  // simple input validity (UI only)
  const emailInvalid = useMemo(() => {
    if (!state.email) return false;
    return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email);
  }, [state.email]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      <Header />

      <main className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white">
            {/* Left: Visual */}
            <div className="relative hidden md:block">
              <img
                src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759566837/login_ilkshu.jpg"
                alt="Welcome back"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-semibold">Welcome back</h3>
                <p className="opacity-90">Sign in to continue shopping with us</p>
                <ul className="mt-3 text-sm space-y-1 opacity-90">
                  <li>• Faster checkout</li>
                  <li>• Order tracking</li>
                  <li>• Personalized offers</li>
                </ul>
              </div>
            </div>

            {/* Right: Form */}
            <div className="p-6 md:p-10">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-800">Login</h2>
                <p className="text-slate-600 mt-1 text-sm">Please enter your credentials to continue</p>
              </div>

              <form onSubmit={login} className="mt-6 space-y-4">
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
                      className={`w-full pl-10 pr-3 py-2.5 border rounded-lg outline-none bg-white focus:ring-2 
                        ${emailInvalid ? 'border-rose-300 focus:ring-rose-100' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'}`}
                      aria-invalid={emailInvalid}
                    />
                  </div>
                  {emailInvalid && (
                    <p className="mt-1 text-xs text-rose-600">Please enter a valid email address</p>
                  )}
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
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-12 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(p => !p)}
                      className="absolute inset-y-0 right-0 px-3 text-sm text-slate-500 hover:text-slate-700"
                      aria-label={showPass ? 'Hide password' : 'Show password'}
                    >
                      {showPass ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-2 select-none">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={() => setRemember(r => !r)}
                      className="accent-emerald-600"
                    />
                    <span className="text-slate-700">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-emerald-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loader}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {loader ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-slate-500 text-sm">or</span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              {/* Social logins */}
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
              <div className="text-center text-slate-700 mt-6 text-sm">
                <p>
                  New here?
                  <Link className="text-emerald-600 hover:underline ml-1" to="/register">
                    Create account
                  </Link>
                </p>
                <p className="mt-2">
                  Seller?
                  <a
                    className="text-emerald-600 hover:underline ml-1"
                    target="_blank"
                    rel="noreferrer"
                    href="http://localhost:5174/login"
                  >
                    Login to seller account
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Small safety note / bottom */}
          <p className="text-center text-xs text-slate-500 mt-6">
            Protected by reCAPTCHA and subject to the{' '}
            <Link to="/privacy-policy" className="underline">Privacy Policy</Link> and{' '}
            <Link to="/t&c" className="underline">Terms</Link>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;