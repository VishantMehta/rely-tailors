import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { authRequest, authSuccess, authFail } from '../features/auth/authSlice';

// --- (Keep your Icon and FloatingBalls components here) ---
const FacebookIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
);
const TwitterIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
);
const InstagramIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.795 2.013 10.148 2 12.315 2zm-1.161 1.545a3.27 3.27 0 01-2.17.93c-1.368.048-2.27.29-2.904.532-.7.27-1.255.635-1.813 1.192-.56.56-.92 1.113-1.192 1.813-.242.633-.484 1.536-.532 2.904-.048 1.067-.06 1.412-.06 3.56s.012 2.493.06 3.56c.048 1.368.29 2.27.532 2.904.27.7.635 1.255 1.192 1.813.56.56 1.113.92 1.813 1.192.633.242 1.536.484 2.904.532 1.067.048 1.412.06 3.56.06s2.493-.012 3.56-.06c1.368-.048 2.27-.29 2.904-.532.7-.27 1.255-.635-1.813-1.192.56-.56.92-1.113 1.192-1.813.242-.633.484-1.536.532-2.904.048-1.067.06-1.412.06-3.56s-.012-2.493-.06-3.56c-.048-1.368-.29-2.27-.532-2.904-.27-.7-.635-1.255-1.192-1.813-.56-.56-1.113-.92-1.813-1.192-.633-.242-1.536-.484-2.904-.532-1.067-.048-1.412-.06-3.56-.06zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 1.802a3.333 3.333 0 110 6.666 3.333 3.333 0 010-6.666zm5.338-3.205a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" /></svg>
);
const FloatingBalls = () => (
    <div className="absolute inset-0 z-10 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute bg-amber-400 rounded-full opacity-10 w-24 h-24 animate-float1" style={{ top: '10%', left: '5%', animationDelay: '0s' }}></div>
        <div className="absolute bg-amber-400 rounded-full opacity-10 w-16 h-16 animate-float3" style={{ top: '70%', left: '15%', animationDelay: '1s' }}></div>
        <div className="absolute bg-amber-400 rounded-full opacity-10 w-12 h-12 animate-float2" style={{ top: '85%', left: '60%', animationDelay: '2s' }}></div>
        <div className="absolute bg-amber-400 rounded-full opacity-10 w-28 h-28 animate-float3" style={{ top: '50%', left: '40%', animationDelay: '3s' }}></div>
        <div className="absolute bg-amber-400 rounded-full opacity-10 w-20 h-20 animate-float2" style={{ top: '20%', left: '80%', animationDelay: '4s' }}></div>
        <div className="absolute bg-amber-400 rounded-full opacity-10 w-10 h-10 animate-float1" style={{ top: '5%', left: '45%', animationDelay: '5s' }}></div>
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
      navigate('/'); // Or to a dashboard page
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
      navigate('/');
    } catch (err) {
      dispatch(authFail(err.response && err.response.data.message ? err.response.data.message : err.message));
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-900 font-montserrat">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1593030103066-0515674563a4?q=80&w=2070&auto.format&fit=crop" 
          alt="Tailor's workshop background" 
          className="w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/1920x1080/1e293b/1e293b'; }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>
      </div>
      <FloatingBalls />
      <div className="relative z-20 flex min-h-screen items-center justify-center">
        <div className="container mx-auto p-4">
          <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto overflow-hidden rounded-lg">
            <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 text-white">
              <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">Welcome Back</h1>
              <p className="text-gray-300 mb-8">
                Sign in to access your personalized dashboard, manage your measurements, and view your order history.
              </p>
              <div className="flex space-x-5">
                <a href="#" className="text-gray-400 hover:text-white transition-transform duration-300 hover:scale-110"><FacebookIcon /></a>
                <a href="#" className="text-gray-400 hover:text-white transition-transform duration-300 hover:scale-110"><TwitterIcon /></a>
                <a href="#" className="text-gray-400 hover:text-white transition-transform duration-300 hover:scale-110"><InstagramIcon /></a>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 bg-white bg-opacity-5 backdrop-blur-md">
              <form onSubmit={submitHandler}>
                <h2 className="text-3xl font-bold text-white mb-4">Sign In</h2>
                {error && <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>}
                {loading && <div className="text-amber-400 mb-4">Loading...</div>}
                
                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-glow bg-gray-700 bg-opacity-50 border border-gray-600 text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-3 transition duration-300" 
                    placeholder="your.email@provider.com" 
                    required 
                  />
                </div>
                
                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-glow bg-gray-700 bg-opacity-50 border border-gray-600 text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-3 transition duration-300" 
                    placeholder="••••••••" 
                    required 
                  />
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <input id="remember" type="checkbox" value="" className="w-4 h-4 text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-600 ring-offset-gray-800 focus:ring-2" />
                    <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-300">Remember me</label>
                  </div>
                  <a href="#" className="text-sm text-amber-400 hover:underline">Lost password?</a>
                </div>
                
                <div className="space-y-4 mt-8">
                    <button type="submit" disabled={loading} className="btn-glow w-full text-slate-900 bg-amber-400 hover:bg-amber-500 focus:ring-4 focus:outline-none focus:ring-amber-300 font-bold rounded-lg text-sm px-5 py-3 text-center transition duration-300 disabled:opacity-50">
                      {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                    
                    <Link to="/register" className="block w-full text-white text-center bg-slate-700 bg-opacity-50 hover:bg-opacity-75 font-bold rounded-lg text-sm px-5 py-3 transition duration-300">
                      Create an Account
                    </Link>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
