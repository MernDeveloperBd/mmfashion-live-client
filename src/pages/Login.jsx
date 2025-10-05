import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { FaFacebookF } from 'react-icons/fa';
import { AiOutlineGoogle } from 'react-icons/ai';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { customer_login, messageClear } from '../store/Reducers/authReducer';


const Login = () => {
    const { loader, successMessage, errorMessage, userInfo } = useSelector(state => state.auth)
    const dispatch = useDispatch()
 const navigate = useNavigate()
     const [state, setState] = useState({           
            email: '',
            password: ''
        })
          const inputHandle = (e) => {
            setState({
                ...state,
                [e.target.name]: e.target.value
            })
        }
         const login = (e) => {
            e.preventDefault()
              dispatch(customer_login(state))
            
        }
           useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
        if(userInfo){
            navigate('/')
        }
    }, [dispatch, navigate,userInfo,successMessage, errorMessage])
    return (
        <div>
            <Header />
            <div className='bg-slate-200 mt-4'>
                <div className='w-full justify-center items-center p-0 md:p-10 '>
                    <div className='grid grid-cols-1 md:grid-cols-2 md:w-[60%] w-full mx-auto bg-white rounded-md'>
                        <div className='px-8 py-8 w-full '>
                            <h2 className='text-center w-full text-xl text-slate-600 font-bold'>Login</h2>
                            <div>
                                <form onSubmit={login} className='text-slate-600'>
                                     <div className='flex flex-col gap-1 mb-2'>
                                        <label htmlFor="email">Email</label>
                                        <input onChange={inputHandle} value={state.email} type="email" className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md' id='email' name='email' placeholder='email' required />
                                    </div>
                                    <div className='flex flex-col gap-1 mb-4'>
                                        <label htmlFor="password">Passoword</label>
                                        <input onChange={inputHandle} value={state.password} type="password" className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md' id='password' name='password' placeholder='password' required />
                                    </div>
                                     <button className='px-8 w-full py-2 bg-[#149777] shadow-lg hover:shadow-indigo-500/30 text-white rounded-md'>Login</button>
                                </form>
                                <div className='flex justify-center items-center py-2'>
                                    <div className='h-[1px] bg-slate-300 w-[95%]'></div>
                                    <span className='px-3 text-slate-600'>or</span>
                                    <div className='h-[1px] bg-slate-300 w-[95%]'></div>
                                </div>
                                  <button className='px-8 w-full py-2 bg-indigo-500 shadow hover:shadow-indigo-500/30 text-white rounded-md flex justify-center items-center gap-2 mb-3'>
                                    <span><FaFacebookF /></span>
                                    <span>Facebook</span>
                                </button>
                                <button className='px-8 w-full py-2 bg-orange-500 shadow hover:shadow-orange-500/30 text-white rounded-md flex justify-center items-center gap-2 mb-3'>
                                    <span><AiOutlineGoogle /></span>
                                    <span>Google</span>
                                </button>
                            </div>
                            <div className='text-center text-slate-600 pt-1'>
                                <p>Already have a account?<Link className='text-blue-500' to='/register'> Register</Link></p>
                            </div>
                            {/* <div className='text-center text-slate-600 pt-1'>
                                <p> <Link className='text-blue-500' to='/login'>Login</Link> seller account</p>
                            </div> */}
                        </div>
                         <div className='w-full h-full py-4 pr-4 '>
                            <img className='w-full h-[95%]' src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1759566837/login_ilkshu.jpg" alt="" />
                        </div>

                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;