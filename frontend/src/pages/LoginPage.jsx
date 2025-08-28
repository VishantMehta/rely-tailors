import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { authRequest, authSuccess, authFail } from '../features/auth/authSlice';
import { fetchUserCart } from '../features/cart/cartSlice';
// A new component for the animated background cubes
const BackgroundCubes = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    <ul className="circles">
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
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
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(authRequest());
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(
        '/api/auth/login',
        { email, password },
        config
      );
      dispatch(authSuccess(data));
      dispatch(fetchUserCart());
      navigate('/');
    } catch (err) {
      dispatch(authFail(err.response && err.response.data.message ? err.response.data.message : err.message));
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f2f2f2] font-montserrat text-slate-800 flex items-center justify-center p-4">
      <BackgroundCubes />
      <div className="relative z-10 w-full max-w-md" data-aos="fade-up">

        <form onSubmit={submitHandler} className="bg-white/40 backdrop-blur-md p-8 rounded-lg shadow-lg border border-white/20">
          <div className="text-center mb-10">
            <h2 className="font-marcellus text-4xl text-slate-900">Sign In</h2>
            <p className="text-slate-500 mt-2">Welcome back to Rely Tailors.</p>
          </div>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-bold text-slate-700 tracking-wide">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-white/50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="your.email@provider.com"
              required
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 text-sm font-bold text-slate-700 tracking-wide">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-white/50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between mb-6 text-sm">
            <div className="flex items-center">
              <input id="remember" type="checkbox" value="" className="w-4 h-4 text-slate-800 bg-slate-100 border-slate-300 rounded focus:ring-slate-500" />
              <label htmlFor="remember" className="ml-2 text-slate-600">Remember me</label>
            </div>
            <a href="#" className="font-semibold text-slate-600 hover:text-slate-900 hover:underline">Forgot password?</a>
          </div>

          <div className="space-y-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white font-bold py-3 px-8 hover:bg-slate-800 transition-colors duration-300 text-sm uppercase tracking-widest rounded-md disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <Link to="/register" className="block w-full text-center text-slate-800 bg-transparent border border-slate-300 hover:bg-slate-100 font-bold py-3 px-8 transition-colors duration-300 text-sm uppercase tracking-widest rounded-md">
              Create an Account
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;
