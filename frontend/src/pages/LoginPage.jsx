import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import { authRequest, authSuccess, authFail } from '../features/auth/authSlice';
import { fetchUserCart } from '../features/cart/cartSlice';
import api from '../api/AxiosAPI';

// --- Background Effect ---
const AmbientBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Soft Amber Glow */}
    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[120px]"></div>
    <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-stone-800/5 rounded-full blur-[100px]"></div>
  </div>
);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, loading, error } = useSelector((state) => state.auth);

  // Redirect if user is already logged in
  useEffect(() => {
    if (userInfo) {
      dispatch(fetchUserCart());
      navigate('/');
    }
  }, [navigate, userInfo, dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(authRequest());
    try {
      const { data } = await api.post('/auth/login', { email, password });
      dispatch(authSuccess(data));
      dispatch(fetchUserCart());
      navigate('/');
    } catch (err) {
      dispatch(
        authFail(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        )
      );
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FDFBF7] font-montserrat text-stone-800 flex items-center justify-center p-6">
      <AmbientBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white border border-stone-100 shadow-2xl shadow-stone-200/50 p-8 md:p-10 rounded-sm"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6">
             <span className="font-marcellus text-3xl text-stone-900 tracking-tight">RRiwaaz</span>
          </Link>
          <h2 className="font-marcellus text-2xl text-stone-800 mb-2">Welcome Back</h2>
          <p className="text-stone-500 text-sm font-light">Sign in to access your royal wardrobe.</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-sm mb-6 text-xs font-medium text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={submitHandler} className="space-y-6">
          
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block mb-2 text-xs font-bold uppercase tracking-widest text-stone-500">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Mail size={16} />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-sm text-sm focus:outline-none focus:border-amber-700 focus:bg-white transition-all placeholder-stone-400"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-stone-500">Password</label>
              <a href="#" className="text-xs text-amber-700 hover:text-amber-800 transition-colors">Forgot Password?</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Lock size={16} />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-sm text-sm focus:outline-none focus:border-amber-700 focus:bg-white transition-all placeholder-stone-400"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-white font-bold py-4 px-6 hover:bg-amber-700 transition-all duration-300 text-xs uppercase tracking-[0.2em] rounded-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-stone-900/20"
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Sign In'}
            {!loading && <ArrowRight size={16} />}
          </button>

        </form>

        <div className="mt-10 text-center pt-6 border-t border-stone-100">
          <p className="text-stone-500 text-sm font-light">New to RRiwaaz?</p>
          <Link 
            to="/register" 
            className="inline-block mt-2 text-stone-900 font-bold text-xs uppercase tracking-widest border-b border-stone-900 pb-0.5 hover:text-amber-700 hover:border-amber-700 transition-colors"
          >
            Create an Account
          </Link>
        </div>

      </motion.div>
    </div>
  );
};

export default LoginPage;